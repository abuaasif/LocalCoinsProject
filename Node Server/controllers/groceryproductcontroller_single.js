require('dotenv').config();   /**Access Environment Variables */
const db = require('../Mysql2'); /**Access Db objects */
const multer = require('multer'); /** middleware for handling multipart/form-data, which is primarily used for uploading files. */
const fs = require('fs').promises;
/**With the fs module, you can perform various operations such as reading from and writing to files, creating directories, 
 * deleting files, and much more. It's an essential module for many Node.js applications that 
 * need to work with files and directories. 
 * In Node.js, the fs.promises API provides an alternative way to work with the filesystem module (fs) using promises rather 
 * than callbacks. 
 * It allows you to perform filesystem operations asynchronously without the need for explicit callback functions.*/
const path = require('path');
const dir = `${process.env.PRODUCTS_STORAGE_DIR}`;

/**The path module provides utilities for working with file and directory paths. 
 * It offers methods for handling path resolution, parsing, joining, and normalization. 
 * This module is particularly useful for ensuring cross-platform compatibility when dealing with file paths.

Once imported, you can use the functions provided by the path module to manipulate file paths in your Node.js application. 
This includes tasks such as:

Resolving absolute or relative paths.
Joining multiple path segments together to form a single path.
Extracting directory names, file names, and file extensions from paths.
Normalizing path strings to a standardized format.
Overall, the path module is essential for working with file system operations in Node.js 
and ensures that your code behaves consistently across different operating systems */

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        
        try {
            await fs.mkdir(dir, { recursive: true });
            cb(null, dir); // Changed: Call the callback function with the destination directory
        } catch (error) {
            cb(error); // Call the callback function with the error
        }
    },
    filename: async function (req, file, cb) {
        try {
            const ext = await path.extname(file.originalname);
            const date = new Date().toISOString().replace(/:/g, '_');
            const filename = `Image_${date}_${req.body.name}_${file.originalname}`;
            cb(null, filename); // Changed: Call the callback function with the generated filename
        } catch (error) {
            cb(error); // Call the callback function with the error
        }
    }
});

/**The line await fs.mkdir(dir, { recursive: true }) is using the mkdir function 
* from the fs module in Node.js to create a directory. Here's what each part does: */
/**{ recursive: true }: This is an options object passed as the second argument to the mkdir function. 
 * The recursive option, when set to true, tells mkdir to create any necessary parent directories if they do not already exist. 
 * This means that if the directory specified by dir doesn't exist, mkdir will create it along with any necessary parent directories. */

const upload = multer({storage:storage});

// const upload = multer({ 
//     storage: storage,
//     limits: { fileSize: 1024 * 1024 * 5 } // Example: limit file size to 5MB
// });

//////////////////////==============================Create Product=============================\\\\\\\\\\\\\\\\\\\\\\\\\\

const createGrocery= async (req, res) => {
    // Check for missing fields
    const requiredFields = ['name', 'category', 'currency', 'quantity', 'price', 'description', 'rating'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    /**filter(): This is an array method used to create a new array with all elements that pass the test implemented by the provided function.
     * field => !req.body[field]: This is the filtering function. For each element field in requiredFields, it checks if req.body[field] is falsy. 
     * If it's falsy, it means that the field is missing in the request body.
     */

    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing fields: ${missingFields.join(', ')}` });
    }

    // Check for null or empty fields
    const nullFields = requiredFields.filter(field => !req.body[field] || req.body[field] === '');
    if (nullFields.length > 0) {
        return res.status(400).json({ error: `Null or empty fields: ${nullFields.join(', ')}` });
    }

    // Additional check for file upload
    if (!req.file) {
        return res.status(400).json({ message: 'Image upload is mandatory.' });
    }


    // Inserting data into the database
    let image = `${req.file.filename}`;

    const sql = 'INSERT INTO grocery (product_name, select_category, currency, quantity, price, description, rating, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [req.body.name, req.body.category, req.body.currency, req.body.quantity, req.body.price, req.body.description, req.body.rating, image];

    try {
        const product = await db.query(sql, params);
        let image = `${req.protocol}://${req.get('host')}/${dir}/${req.file.filename}`
        res.status(201).json({ message: 'Product data saved successfully.', imagePath: `${image}`, product: product.insertId });
    } catch (error) {
        console.error('Error inserting product data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

///////////////////======================================Get Product  ========================================\\\\\\\\\\\\\\\\

async function getGrocerys(req, res) {
    try {
        const products = await db.query('SELECT * FROM grocery');
        // const dir = process.env.RESTAURANT_STORAGE_DIR
        // Transform the image path to full URLs
        const transformedResults = products.map(products => ({
            ...products,
            image: products.image.startsWith('http') ? products.image : `${req.protocol}://${req.get('host')}/${dir}/${products.image}`
        }));
        /**this statement maps through an array of restaurant objects, and for each object, it checks if the Rest_logo property is already a complete URL. 
         * If it is, it leaves it unchanged. If not, it constructs a new URL using information from the request (req) object and the directory (dir). 
         * Finally, it returns an array of transformed restaurant objects with updated Rest_logo properties. 
         * This is commonly used to ensure that the logo URLs are consistent and usable across different parts of the application. */

        res.status(200).json(transformedResults);

    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

///////////////////======================================Get Product by Category================================\\\\\\\\\\\\\\\\

// Define the getGroceryByCategory function
const getGrocerybyCategory = async (req, res) => {
    // Assuming category is passed as a query parameter, change to req.params if passed as a route parameter
    const category = req.query.category;

    let query = 'SELECT * FROM grocery';
    const params = [];

    if (category) {
        query += ' WHERE select_category = ?';
        params.push(category);
    }

    try {
        // Query the database to get the groceries by category
        const products = await db.query(query, params); // Use params array for parameterized query
        if (products.length === 0) {
            return res.status(404).json({ error: 'No grocery item available in this category' });
        }

        // Assuming there's a directory set up for grocery item images
        const dir = process.env.GROCERY_STORAGE_DIR || 'path/to/default/dir';

        // Transform the image path to full URLs
        const transformedResults = products.map(product => ({
            ...product,
            image: product.image.startsWith('http') ? product.image : `${req.protocol}://${req.get('host')}/${dir}/${product.image}`
        }));

        res.status(200).json(transformedResults);

    } catch (error) {
        console.error('Error fetching grocery by category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


///////////////////======================================Get Prodcut by ID  ========================================\\\\\\\\\\\\\\\\

async function getGrocerysById(req, res) {
    const id = req.query.id;
    // const id = req.query.id;
    try {
        // Query the database to get the product by its ID
        const product = await db.query('SELECT * FROM grocery WHERE prod_id = ?', [id]);
        if (product.length === 0) {
            // If no restaurant found with the given ID, return 404 Not Found
            return res.status(404).json({ error: 'grocery not found' });
        }
        // If restaurant found, return it

        // Transform the image path to full URLs
        const transformedResults = {
            ...product[0],
            image: product[0].image.startsWith('http') ? product[0].image : `${req.protocol}://${req.get('host')}/${dir}/${product[0].image}`
        }
        res.status(200).json(transformedResults);
    } catch (error) {
        console.error('Error fetching restaurant by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

///////////////////======================================Delete Product  ========================================\\\\\\\\\\\\\\\\


async function deleteGrocery(req, res) {
    // const id = req.params.id;
    const id = req.query.id;
    try {
        // Check if the restaurant with the given ID exists
        const product = await db.query('SELECT * FROM grocery WHERE prod_id = ?', [id]);
        if (product.length === 0) {
            // If no restaurant found with the given ID, return 404 Not Found
            return res.status(404).json({ error: 'grocery not found' });
        }

        // Delete the restaurant from the database
        await db.query('DELETE FROM grocery WHERE prod_id = ?', [id]);

        // Return success message
        res.status(200).json({ message: 'grocery deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

///////////////////======================================Update Grocery  ========================================\\\\\\\\\\\\\\\\
async function updateGrocery(req, res) {
    const id = req.params.id;
    //const id = req.query.id;
    const { product_name, select_category, currency, quantity, price, description, rating } = req.body;

    try {
        // Fetch existing restaurant data from the database based on the provided ID
        const existingProduct = await db.query('SELECT * FROM grocery WHERE prod_id = ?', [id]);
        if (existingProduct.length === 0) {
            return res.status(404).json({ error: 'grocery not found' });
        }
        const existingData = existingProduct[0];

        // Handle file upload if a file is included in the request
        let updatedProdImage = existingData.image;
        if (req.file) {
            // If a new file is uploaded, handle file upload and update Rest_logo
            updatedProdImage = `${req.file.filename}`;
        }

        // Compare request data with existing data to identify changed fields
        const updatedData = {
            product_name: product_name || existingData.product_name,
            select_category: select_category || existingData.select_category,
            currency: currency || existingData.currency,
            quantity: quantity || existingData.quantity,
            price: price || existingData.price,
            description: description || existingData.description,
            rating: rating || existingData.rating,
            image: updatedProdImage
        };

        // Construct the update query based on the changed fields
        const updateColumns = [];
        const updateValues = [];
        for (const [key, value] of Object.entries(updatedData)) {
            if (value !== existingData[key]) {
                updateColumns.push(`${key} = ?`);
                updateValues.push(value);
            }
        }
        if (updateColumns.length === 0) {
            // No fields have changed, return success message
            return res.status(200).json({ message: 'Restaurant data unchanged' });
        }
        updateValues.push(id); // Add the ID for the WHERE clause
        const updateQuery = `UPDATE grocery SET ${updateColumns.join(', ')} WHERE prod_id = ?`;

        // Execute the update query
        await db.query(updateQuery, updateValues);
         // Fetch updated restaurant details
         const updatedProduct = await db.query('SELECT * FROM grocery WHERE prod_id = ?', [id]);
        // Transform the image path to full URLs
        const transformedResults = {
            ...updatedProduct[0],
            image: updatedProduct[0].image.startsWith('http') ? updatedProduct[0].image : `${req.protocol}://${req.get('host')}/${dir}/${updatedProduct[0].image}`
        }
        console.log(transformedResults)

        // Return success message
        res.status(200).json({ message: 'grocery updated successfully',transformedResults });
    } catch (error) {
        console.error('Error updating grocery:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


module.exports ={createGrocery,upload,getGrocerys,getGrocerysById,deleteGrocery,updateGrocery,getGrocerybyCategory};
