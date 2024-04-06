require('dotenv').config();
const bodyParser = require('body-parser');
const db = require('../Mysql2');
const multer = require('multer');
const fs = require('fs').promises;

const path = require('path');
const { json } = require('express');
const { error } = require('console');
const dir = `${process.env.PRODUCTS_STORAGE_DIR}`;

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        try {
            await fs.mkdir(dir, { recursive: true });
            cb(null, dir);
        } catch (error) {
            cb(error);
        }
    },
    filename: async function (req, file, cb) {
        try {
            const ext = await path.extname(file.originalname);
            const date = new Date().toISOString().replace(/:/g, '_');
            const filename = `Image_${date}_${req.body.name}_${file.originalname}`;
            cb(null, filename);
        } catch (error) {
            cb(error);
        } 

    }
});
////////////////////create grcoery multiple images

const upload = multer({ storage: storage });
const createGrocery = async (req,res) => {
    const requiredFields = ['name','category','currency','quantity', 'price', 'description', 'rating'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    const nullFields =requiredFields.filter(field => !req.body[field] || req.body[field]=== '');
    if (missingFields.length > 0) {
        return res.status(400).json({error: `Missing fields: ${missingFields.join(',')}`});
    }
    if (nullFields.length > 0) {
        return res.status(400).json({error: `Null or empty fields: ${nullFields.join(',')}`});
    }
    if (!req.files || req.files.length ===0 ) {
        return res.status(400).json({message: 'Image upload is mandatory.'});
    }
    let imageFilenames = req.files.map(file => `${file.filename}`);
    const images = JSON.stringify(imageFilenames);
    const sql = 'INSERT INTO grocery (product_name, select_category, currency, quantity, price, description, rating, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [req.body.name, req.body.category, req.body.currency,req.body.quantity,req.body.price,req.body.description, req.body.rating, images];

    try {
        const productInsertionResult = await db.query(sql, params);
        const productId = productInsertionResult.insertId;
        const productResponse = {
            prod_id : productId,
            product_name: req.body.name,
            select_category: req.body.category,
            currency: req.body.currency,
            quantity: req.body.quantity,
            price: req.body.price,
            description: req.body.description,
            rating: req.body.rating
            
        };
        imageFilenames.forEach((filename, index) => {
            const imageUrl = `${req.protocol}://${req.get('host')}/${dir}/${filename}`;
            productResponse[`image${index + 1}`] = imageUrl;
        });

        res.status(201).json({
            message: 'Product data saved successfully.',
            product: productResponse,
        });
    } catch (error) {
        console.error('Error inserting product data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
///////////////////////////get All Grocerys with multiple Images

// const getAllGrocerys = async(req,res) => {
//     const sql = 'SELECT * FROM grocery';
//     try{
//         const result = await db.query(sql);
//         const products = result.map(product => {
//             let imageFilenames = [];
//             try {
//                 imageFilenames = JSON.parse(product.image);
//             } catch (parseError) {
//                 console.error('Failed to parse image filenames:', parseError);
//             }
//             const productResponse = {
//                 prod_id: product.prod_id,
//                 product_name: product.product_name,
//                 select_category:product.select_category,
//                 currency: product.currency,
//                 quantity:product.quantity,
//                 price: product.price,
//                 description:product.description,
//                 rating:product.rating
//             };
//             imageFilenames.forEach((filename, index)=>{
//                 const imageUrl= `${req.protocol}://${req.get('host')}/${dir}/${filename}`;
//                 productResponse[`image${index + 1}`] = imageUrl;

//             });
//             return productResponse;
//         });
//         res.json({
//             message: 'Products retrieved successfully.',
//             products: products
//         });
//     } catch (error) {
//         console.error('Error retriving products:', error);
//         res.status(500).json({error: 'Internal server error' });
//     }

// };

const getAllGrocerys = async(req, res) => {
    const sql = 'SELECT * FROM grocery';
    try {
        const result = await db.query(sql);
        // Initialize an object to store product prefixes grouped by category
        const productPrefixesByCategory = {};
        const products = result.map(product => {
            let imageFilenames = [];
            try {
                imageFilenames = JSON.parse(product.image);
            } catch (parseError) {
                console.error('Failed to parse image filenames:', parseError);
            }
            // Extract the prefix from the product name
            const [prefix] = product.product_name.split(' ');
            const category = product.select_category;

            // Add the prefix to the array in the productPrefixesByCategory object, grouped by category
           // Add the prefix to the array in the productPrefixesByCategory object, grouped by category
            // Check if the category array has been initialized, and if the prefix does not already exist in it
            if (!productPrefixesByCategory[category]) {
                productPrefixesByCategory[category] = [prefix];
            } else if (!productPrefixesByCategory[category].includes(prefix)) {
                productPrefixesByCategory[category].push(prefix);
            }
            // productPrefixesByCategory[category].push(prefix);

            const productResponse = {
                prod_id: product.prod_id, 
                product_name: product.product_name,
                select_category: category,
                currency: product.currency,
                quantity: product.quantity,
                price: product.price,
                description: product.description,
                rating: product.rating,
                product_prefix: prefix // Include the product prefix in each item
            };
            imageFilenames.forEach((filename, index) => {
                const imageUrl = `${req.protocol}://${req.get('host')}/upload/product/${filename}`;
                productResponse[`image${index + 1}`] = imageUrl;
            });
            return productResponse;
        });

        res.json({
            message: 'Products retrieved successfully.',
            products: products,
            product_prefixes_by_category: productPrefixesByCategory // Include the object of product prefixes grouped by category
        });
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




/////////////////======================================Get Grocery by category /prefix/Category and Prefix  for Multiple Image ========================================\\\\\\\\\\\\\\\\


//  const getsubCategory = async (req, res) =>{
//     // Extract category and product_prefix from query parameters
//     const { category, product_prefix } = req.query;

//     let sql = 'SELECT * FROM grocery WHERE 1=1';
//     const params = [];
//     console.log(sql)
//     // Append conditions to SQL query based on provided query parameters
//     if (category) {
//         sql += ' AND select_category = ?';
//         params.push(category);
//     }
//     if (product_prefix) {
//         // Note: SQL uses '%' as a wildcard for zero or more characters
//         sql += ' AND product_name LIKE ?';
//         params.push(`${product_prefix}%`);
//     }
//     // No additional condition is needed for fetching all records, as 'WHERE 1=1'
//     // effectively does nothing and is only there to simplify query concatenation

//     try {
//         // Execute the query with the appropriate filters
//         const products = await db.query(sql, params);

//         // Check if products exist
//         if (products.length === 0) {
//             return res.status(404).json({ message: 'No products found matching the criteria.' });
//         }

//         // Respond with the filtered or all products based on the query parameters
//         res.json({
//             message: 'Products retrieved successfully.',
//             products: products
//         });
//     } catch (error) {
//         console.error('Error retrieving products:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }

const getsubCategory = async (req, res) => {
    const { category, product_prefix } = req.query;

    if (!category) {
        return res.status(400).json({ message: 'Please provide a category.' });
    }

    let sql = 'SELECT * FROM grocery WHERE select_category = ?';
    const params = [category];

    if (product_prefix) {
        const prefixes = product_prefix.split(',');
        const likeClauses = prefixes.map((_) => `product_name LIKE ?`);
        sql += ` AND (${likeClauses.join(' OR ')})`;
        const likeParams = prefixes.map(prefix => `${prefix}%`);
        params.push(...likeParams);np
    }

    try {
        const result = await db.query(sql, params);

        if (result.length === 0) {
            return res.status(404).json({ message: 'No products found matching the criteria.' });
        }

        const products = result.map(product => {
            let imageFilenames = [];
            try {
                imageFilenames = JSON.parse(product.image);
            } catch (parseError) {
                console.error('Failed to parse image filenames:', parseError);
            }
            const productResponse = {
                prod_id: product.prod_id,
                product_name: product.product_name,
                select_category:product.select_category,
                currency: product.currency,
                quantity:product.quantity,
                price: product.price,
                description:product.description,
                rating:product.rating
            };
            imageFilenames.forEach((filename, index)=>{
                const imageUrl= `${req.protocol}://${req.get('host')}/${dir}/${filename}`;
                productResponse[`image${index + 1}`] = imageUrl;

            });
            return productResponse;
        });
        res.json({
            message: 'Products retrieved successfully.',
            products: products
        });
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




/////////////////======================================Get Grocery by ID  for Multiple Image ========================================\\\\\\\\\\\\\\\\

async function getGroceryById(req, res) {
    try {
        const {id} = req.query;
        if (!id) {
            return res.status(400).json({message: 'Product ID is required'});
        }
        const result = await db.query('SELECT * FROM grocery Where prod_id = ?', [id]);

        if (result.length === 0 ) {
            return res.status(404).json({ message: 'Product not found'});

        }
        const product = result[0];
 
        let imageFilenames = [];
        try{
            imageFilenames = JSON.parse(product.image);
        } catch(error) {
            console.error('Failed to parse image filenames:', error);
        }
        const transformedProduct = {
            prod_id: product.prod_id,
            product_name :product. product_name,
            select_category: product.select_category,
            currency:product.currency,
            quantity:product.quantity,
            price:product.price,
            description: product.description,
            rating:product.rating,
        };
        imageFilenames.forEach((filename, index)=> {
            transformedProduct[`image${index + 1}`] = filename.startsWith('http') ? filename : `${req.protocol}://${req.get('host')}/${dir}/${filename}`;
        });
        res.status(200).json(transformedProduct);
    } catch (error) {
        console.error('Error fetching product:',error);
        res.status(500).json({error: 'Internal server error'});
    }
};
/////////////////// update grocery with  multuple images///////////////
async function updategrocery(req, res) {
    // const {id} = req.params;
    const {id} = req.query
    const { product_name,select_category,currency, quantity,price, description, rating} = req.body;
    if (!id) {
        return res.status(400).json({ error: 'Product ID is required.',id });
    }
    try {
        const existingProduct = await db.query('SELECT * FROM grocery WHERE prod_id = ?', [id]);
        if(existingProduct.length === 0) {
            return res.status(404).json({error: 'Product not found.'});
        }
        const existingData = existingProduct[0];

        let updatedProdImages = existingData.image ? JSON.parse(existingData.image) : [];
        if (req.files && req.files.length > 0) {
            updatedProdImages = req.files.map(file => `${file.filename}`);

        }

        const updatedData = {
             product_name: product_name || existingData.product_name,
             select_category: select_category || existingData.select_category,
             currency: currency || existingData.currency,
             quantity: quantity || existingData.quantity,
             price: price || existingData.price,
             description: description || existingData.description,
             rating: rating || existingData.rating,
             image: JSON.stringify(updatedProdImages) 
        } ;
        const updateColumns = [];
        const updateValues = [];
        for (const [key, Value] of Object.entries(updatedData)) {
            if (key === 'image' || Value !== existingData[key]) {
                updateColumns.push(`${key}= ?`);
                updateValues.push(Value);
            }
        }  
        if (updateColumns.length === 0) {
            return res.status(200).json({ message: 'No changes detected, product data unchanged.'});
        } 
        let imageFilenames = req.files.map(file => `${file.filename}`);
        const images = JSON.stringify(imageFilenames);
        try{
            updateValues.push(id);
            const updateQuery = `UPDATE grocery SET ${updateColumns.join(',')} WHERE prod_id = ?`;
            await db.query(updateQuery, updateValues);
            const productResponse = {
                prod_id: id,
                product_name: req.body.name,
                select_category: req.body.category,
                currency: req.body.currency,
                quantity: req.body.quantity,
                price: req.body.price,
                description: req.body.description,
                rating: req.body.rating

            };

            imageFilenames.forEach((filename,index)=> {
                const imageUrl = `${req.protocol}://${req.get('host')}/${dir}/${filename}`;
                productResponse[`image${index + 1}`] = imageUrl;
            });
            res.status(201).json({
                message: 'Product data saved successfully.',
                product: productResponse,
            });
        } catch (error) {
            console.error('Error inserting product data:',error);
            res.status(500).json({error: 'Internal server error'});
        }
    } catch (error) {
        console.error('Error updating product:',error);
        res.status(500).json({error:'Internal server error'})
    }
        
    };
async function deletegrocery(req,res) {
    const id = req.query.id;
    try{
        const product = await db.query('SELECT * FROM grocery WHERE prod_id = ?', [id]);
        if (product.length === 0) {
            return res.status(404).json({error: 'Product not found'});
        }
        await db. query ('DELETE FROM grocery WHERE prod_id = ?',[id]);

        res.status(200).json({message:'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting prodcut:', error);
        res.status(500).json({error:'Internal server error'});

    }
 };
   


module.exports = { createGrocery,getGroceryById,updategrocery, upload,deletegrocery ,getAllGrocerys,getsubCategory};
