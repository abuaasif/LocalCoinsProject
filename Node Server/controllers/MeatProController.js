require('dotenv').config();// access envronment variables
const bodyParser = require('body-parser');
const db = require('../Mysql2');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const { json } = require('express');
const { error, Console } = require('console');
const dir = `${process.env.PRODUCTS_STORAGE_DIR}`;

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        try {
            await fs.mkdir(dir, { recursive: true })
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
///////////////////////create meat multiple images///////////

const upload = multer({ storage: storage });
const createmeat = async (req, res) => {
    const requiredFields = ['name', 'category', 'currency', 'quantity', 'price', 'description', 'rating'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    const nullFields = requiredFields.filter(field => !req.body[field] || req.body[field] === '');
    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing fields: ${missingFields.join(',')}` });
    }
    if (nullFields.length > 0) {
        return res.status(400).json({ error: `Null or empty fields: ${nullFields.join(',')}` });
    }
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'Image upload is mandatory.' });
    }
    let imageFilenames = req.files.map(file => `${file.filename}`);
    const images = JSON.stringify(imageFilenames);
    const sql = 'INSERT INTO meat (product_name,select_category, currency, quantity, price, description,rating, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [req.body.name, req.body.category, req.body.currency, req.body.quantity, req.body.price, req.body.description, req.body.rating, images];

    try {
        const productInsertionResult = await db.query(sql, params);
        const productId = productInsertionResult.insertId;
        const productResponse = {
            prod_id: productId,
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

////////////////////////////////get All meats with multiple Images

const getAllmeats = async (req, res) => {
    const sql = 'SELECT * FROM meat';

    try {
        const result = await db.query(sql);
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
                select_category: product.select_category,
                currency: product.currency,
                quantity: product.quantity,
                price: product.price,
                description: product.description,
                rating: product.rating
            };
            imageFilenames.forEach((filename, index) => {
                const imageUrl = `${req.protocol}://${req.get('host')}/${dir}/${filename}`;
                productResponse[`image${index + 1}`] = imageUrl;

            });
            return productResponse;
        });
        res.json({
            message: 'Products retrieved successfully.',
            products: products

        });
    } catch (error) {
        console.error('Error retriving products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

///////////////////////////get meat by ID  for multiple image/////////////////////////
async function getmeatById(req, res) {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ message: 'Product ID is required' });
        }
        const result = await db.query('SELECT * FROM meat Where prod_id = ?', [id]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Product not found' });

        }
        const product = result[0];

        let imageFilenames = [];
        try {
            imageFilenames = JSON.parse(product.image);
        } catch (error) {
            console.error('Failed to parse image filenames:', error);
        }
        const transformedProduct = {
            prod_id: product.prod_id,
            product_name: product.product_name,
            select_category: product.select_category,
            currency: product.currency,
            quantity: product.quantity,
            price: product.price,
            description: product.description,
            rating: product.rating,
        };
        imageFilenames.forEach((filename, index) => {
            transformedProduct[`image${index + 1}`] = filename.startsWith('http') ? filename : `${req.protocol}://${req.get('host')}/${dir}/${filename}`;
        });
        res.status(200).json(transformedProduct);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
///////////////////////////////////update meat with multiple images //////////////////////////
async function updatemeats(req, res) {
    const { id } = req.query // Make sure the route captures the 'id'.
    const { product_name, select_category, currency, quantity, price, description, rating } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Product ID is required.' });
    }

    try {
        const existingProduct = await db.query('SELECT * FROM meat WHERE prod_id = ?', [id]);
        if (existingProduct.length === 0) {
            return res.status(404).json({ error: 'Product not found.' });
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
            image: JSON.stringify(updatedProdImages) // Storing the array as a JSON string
        };

        const updateColumns = [];
        const updateValues = [];
        for (const [key, value] of Object.entries(updatedData)) {
            if (key === 'image' || value !== existingData[key]) {
                updateColumns.push(`${key} = ?`);
                updateValues.push(value);
            }
        }

        if (updateColumns.length === 0) {
            return res.status(200).json({ message: 'No changes detected, product data unchanged.' });
        }
        // Processing multiple images
        let imageFilenames = req.files.map(file => `${file.filename}`);
        const images = JSON.stringify(imageFilenames);
        // const images = imageFilenames 
        try {
            updateValues.push(id);
            const updateQuery = `UPDATE meat SET ${updateColumns.join(', ')} WHERE prod_id = ?`;
            await db.query(updateQuery, updateValues);
            // Construct the product object for the response
            const productResponse = {
                prod_id: id,
                product_name: req.body.name,
                select_category: req.body.category,
                currency: req.body.currency,
                quantity: req.body.quantity,
                price: req.body.price,
                description: req.body.description,
                rating: req.body.rating
                // The original 'image' field is omitted as per your requirement
            };

            // Adding image URLs dynamically to the response object
            imageFilenames.forEach((filename, index) => {
                const imageUrl = `${req.protocol}://${req.get('host')}/${dir}/${filename}`;
                productResponse[`image${index + 1}`] = imageUrl;
            });

            // Respond with the success message and the product object
            res.status(201).json({
                message: 'Product data saved successfully.',
                product: productResponse,
            });
        } catch (error) {
            console.error('Error inserting product data:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
async function deletemeats(req, res) {
    const id = req.query.id;
    try {
        const product = await db.query('SELECT * FROM meat WHERE prod_id = ?', [id]);
        if (product.length === 0) {
            return res.status(404).json({ error: 'Product not found' });

        }
        await db.query('DELETE FROM meat WHERE prod_id = ?', [id]);

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




module.exports = { createmeat, upload, getAllmeats, updatemeats, deletemeats, getmeatById };

