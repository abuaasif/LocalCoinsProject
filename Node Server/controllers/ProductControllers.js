const fs = require('fs'); // Import the base fs module for createWriteStream
const fsp = require('fs').promises; // Import fs.promises for promise-based file operations
const axios = require('axios');
require('dotenv').config();   /**Access Environment Variables */
const db = require('../Mysql2'); /**Access Db objects */
const multer = require('multer'); /** middleware for handling multipart/form-data, which is primarily used for uploading files. */
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
            await fsp.mkdir(dir, { recursive: true });
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

const upload = multer({ storage: storage });

// const upload = multer({ 
//     storage: storage,
//     limits: { fileSize: 1024 * 1024 * 5 } // Example: limit file size to 5MB
// });

//////////////////////==============================Create Product=============================\\\\\\\\\\\\\\\\\\\\\\\\\\

const createProduct1 = async (req, res) => {
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

    const sql = 'INSERT INTO products (product_name, select_category, currency, quantity, price, description, rating, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [req.body.name, req.body.category, req.body.currency, req.body.quantity, req.body.price, req.body.description, req.body.rating, image];

    try {
        const product = await db.query(sql, params);
        let image = `${req.protocol}://${req.get('host')}/${dir}/${req.file.filename}`
        res.status(201).json({ message: 'Product data saved successfully.', imagePath: `${image}`, product: product.insertId });
    } catch (error) {
        console.error('Error inserting product data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

///////////////////======================================Get Product  ========================================\\\\\\\\\\\\\\\\

async function getProducts(req, res) {
    try {
        const products = await db.query('SELECT * FROM products');
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
};

///////////////////======================================Get Product by Category================================\\\\\\\\\\\\\\\\

// Define the getProductbyCategory function
async function getProductbyCategory(req, res) {
    const categoryName = req.query.category;

    try {
        let productsResult;
        let queryMessage;

        // Determine if a category was specified and adjust the query accordingly
        if (categoryName) {
            productsResult = await db.query('SELECT * FROM products WHERE select_category = ?', [categoryName]);
            queryMessage = `Products in category '${categoryName}'`;
        } else {
            productsResult = await db.query('SELECT * FROM products');
            queryMessage = 'All products';
        }

        // if (productsResult.length === 0) {
        //     return res.status(404).json({ message: 'No products found.' });
        // }
        const transformedProducts = productsResult.map(product => {
            let transformedProduct = {
                prod_id: product.prod_id,
                product_name: product.product_name,
                select_category: product.select_category,
                currency: product.currency,
                quantity: product.quantity,
                price: product.price,
                description: product.description,
                rating: product.rating,
            };

            try {
                const images = JSON.parse(product.image);
                images.forEach((filename, index) => {
                    const imageUrl = filename.startsWith('http') ? filename : `${req.protocol}://${req.get('host')}/${dir}/${filename}`;
                    transformedProduct[`image${index + 1}`] = imageUrl;
                });
            } catch (error) {
                console.error('Error parsing image filenames:', error);
                // Optionally handle the error, e.g., by setting a default image or leaving the images out
            }

            return transformedProduct;
        });

        res.json({ message: queryMessage, products: transformedProducts });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}





///////////////////======================================Get Prodcut by ID  for Single Image ========================================\\\\\\\\\\\\\\\\

// async function getProductsById(req, res) {
//     const id = req.query.id;
//     // const id = req.query.id;
//     try {
//         // Query the database to get the product by its ID
//         const product = await db.query('SELECT * FROM products WHERE prod_id = ?', [id]);
//         if (product.length === 0) {
//             // If no restaurant found with the given ID, return 404 Not Found
//             return res.status(404).json({ error: 'Product not found' });
//         }
//         // If restaurant found, return it

//         // Transform the image path to full URLs
//         const transformedResults = {
//             ...product[0],
//             image: product[0].image.startsWith('http') ? product[0].image : `${req.protocol}://${req.get('host')}/${dir}/${product[0].image}`
//         }
//         res.status(200).json(transformedResults);
//     } catch (error) {
//         console.error('Error fetching restaurant by ID:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

///////////////////======================================Get Prodcut by ID  for Multiple Image ========================================\\\\\\\\\\\\\\\\

async function getProductById(req, res) {
    try {
        const { id } = req.query;
        // Validate the product ID
        if (!id) {
            return res.status(400).json({ message: 'Product ID is required' });
        }
        const result = await db.query('SELECT * FROM products WHERE prod_id = ?', [id]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const product = result[0];
        // Decode the JSON-encoded array of image filenames
        let imageFilenames = [];
        try {
            imageFilenames = JSON.parse(product.image);
        } catch (error) {
            console.error('Failed to parse image filenames:', error);
            // Consider how you want to handle this error. For now, we'll proceed with an empty array.
        }

        // Initialize the transformed product object excluding the original image field
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

        // Dynamically add each image URL to the transformed product object
        imageFilenames.forEach((filename, index) => {
            transformedProduct[`image${index + 1}`] = filename.startsWith('http') ? filename : `${req.protocol}://${req.get('host')}/${dir}/${filename}`;
        });

        res.status(200).json(transformedProduct);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

///////////////////======================================Delete Product  ========================================\\\\\\\\\\\\\\\\
async function deleteProduct(req, res) {
    // const id = req.params.id;
    const id = req.query.id;
    try {
        // Check if the restaurant with the given ID exists
        const product = await db.query('SELECT * FROM products WHERE prod_id = ?', [id]);
        if (product.length === 0) {
            // If no restaurant found with the given ID, return 404 Not Found
            return res.status(404).json({ error: 'Product not found' });
        }

        // Delete the restaurant from the database
        await db.query('DELETE FROM products WHERE prod_id = ?', [id]);

        // Return success message
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

///////////////////======================================Update Restaurant  ========================================\\\\\\\\\\\\\\\\
// async function updateProduct(req, res) {
//     const id = req.params.id;
//     //const id = req.query.id;
//     const { product_name, select_category, currency, quantity, price, description, rating } = req.body;

//     try {
//         // Fetch existing restaurant data from the database based on the provided ID
//         const existingProduct = await db.query('SELECT * FROM products WHERE prod_id = ?', [id]);
//         if (existingProduct.length === 0) {
//             return res.status(404).json({ error: 'Product not found' });
//         }
//         const existingData = existingProduct[0];

//         // Handle file upload if a file is included in the request
//         let updatedProdImage = existingData.image;
//         if (req.file) {
//             // If a new file is uploaded, handle file upload and update Rest_logo
//             updatedProdImage = `${req.file.filename}`;
//         }

//         // Compare request data with existing data to identify changed fields
//         const updatedData = {
//             product_name: product_name || existingData.product_name,
//             select_category: select_category || existingData.select_category,
//             currency: currency || existingData.currency,
//             quantity: quantity || existingData.quantity,
//             price: price || existingData.price,
//             description: description || existingData.description,
//             rating: rating || existingData.rating,
//             image: updatedProdImage
//         };

//         // Construct the update query based on the changed fields
//         const updateColumns = [];
//         const updateValues = [];
//         for (const [key, value] of Object.entries(updatedData)) {
//             if (value !== existingData[key]) {
//                 updateColumns.push(`${key} = ?`);
//                 updateValues.push(value);
//             }
//         }
//         if (updateColumns.length === 0) {
//             // No fields have changed, return success message
//             return res.status(200).json({ message: 'Restaurant data unchanged' });
//         }
//         updateValues.push(id); // Add the ID for the WHERE clause
//         const updateQuery = `UPDATE products SET ${updateColumns.join(', ')} WHERE prod_id = ?`;

//         // Execute the update query
//         await db.query(updateQuery, updateValues);
//         // Fetch updated restaurant details
//         const updatedProduct = await db.query('SELECT * FROM products WHERE prod_id = ?', [id]);
//         // Transform the image path to full URLs
//         const transformedResults = {
//             ...updatedProduct[0],
//             image: updatedProduct[0].image.startsWith('http') ? updatedProduct[0].image : `${req.protocol}://${req.get('host')}/${dir}/${updatedProduct[0].image}`
//         }
//         console.log(transformedResults)

//         // Return success message
//         res.status(200).json({ message: 'Product updated successfully', transformedResults });
//     } catch (error) {
//         console.error('Error updating Product:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

///////////////////======================================Update Restaurant  with multiple images ========================================\\\\\\\\\\\\\\\\
async function updateProduct(req, res) {
    const { id } = req.params; // Make sure the route captures the 'id'.
    const { product_name, select_category, currency, quantity, price, description, rating } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Product ID is required.' });
    }

    try {
        const existingProduct = await db.query('SELECT * FROM products WHERE prod_id = ?', [id]);
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
            const updateQuery = `UPDATE products SET ${updateColumns.join(', ')} WHERE prod_id = ?`;
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

///////////////////======================================Create Product with Multiple Images  ========================================\\\\\\\\\\\\\\\\
// const createProduct = async (req, res) => {
//     // Check for missing and null or empty fields
//     const requiredFields = ['name', 'category', 'currency', 'quantity', 'price', 'description', 'rating'];
//     const missingFields = requiredFields.filter(field => !req.body[field]);
//     const nullFields = requiredFields.filter(field => !req.body[field] || req.body[field] === '');

//     if (missingFields.length > 0) {
//         return res.status(400).json({ error: `Missing fields: ${missingFields.join(', ')}` });
//     }
//     if (nullFields.length > 0) {
//         return res.status(400).json({ error: `Null or empty fields: ${nullFields.join(', ')}` });
//     }

//     // Additional check for file uploads
//     if (!req.files || req.files.length === 0) {
//         return res.status(400).json({ message: 'Image upload is mandatory.' });
//     }

//     // Processing multiple images
//     let imageFilenames = req.files.map(file => `${file.filename}`);
//     const images = JSON.stringify(imageFilenames);
//     // const images = imageFilenames 

//     const sql = 'INSERT INTO products (product_name, select_category, currency, quantity, price, description, rating, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
//     const params = [req.body.name, req.body.category, req.body.currency, req.body.quantity, req.body.price, req.body.description, req.body.rating, images];

//     try {
//         const productInsertionResult = await db.query(sql, params);
//         const productId = productInsertionResult.insertId;
//         // Construct the product object for the response
//         const productResponse = {
//             prod_id: productId,
//             product_name: req.body.name,
//             select_category: req.body.category,
//             currency: req.body.currency,
//             quantity: req.body.quantity,
//             price: req.body.price,
//             description: req.body.description,
//             rating: req.body.rating
//             // The original 'image' field is omitted as per your requirement
//         };

//         // Adding image URLs dynamically to the response object
//         imageFilenames.forEach((filename, index) => {
//             const imageUrl = `${req.protocol}://${req.get('host')}/${dir}/${filename}`;
//             productResponse[`image${index + 1}`] = imageUrl;
//         });

//         // Respond with the success message and the product object
//         res.status(201).json({
//             message: 'Product data saved successfully.',
//             product: productResponse,
//         });
//     } catch (error) {
//         console.error('Error inserting product data:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };
/* Asynchronously downloads an image from a given URL and saves it to a specified directory.
 * @param {string} url - The URL of the image to download.
 * @param {string} directory - The directory where the image will be saved.
 * @returns {Promise<string>} A promise that resolves with the filename of the saved image.
 */
const downloadImage = async (url, directory, customName) => {
    try {
        const response = await axios.get(url, { responseType: 'stream' });


        // filename = customName.replace(/[<>:"\/\\|?*]+/g, '_'); // Sanitize filename by replacing invalid characters with underscore

        const saveDirectory = path.resolve(directory);
        await fsp.mkdir(saveDirectory, { recursive: true });

        const filepath = path.join(saveDirectory, customName);

        const writer = fs.createWriteStream(filepath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(filepath));
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('Failed to download or save image:', error);
        throw error;
    }
};

const createProduct = async (req, res) => {
    const requiredFields = ['name', 'category', 'currency', 'quantity', 'price', 'description', 'rating'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    const nullFields = requiredFields.filter(field => req.body[field] === null || req.body[field] === '');

    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing fields: ${missingFields.join(', ')}` });
    }
    if (nullFields.length > 0) {
        return res.status(400).json({ error: `Null or empty fields: ${nullFields.join(', ')}` });
    }


    
    let imageProcesses = [];
    let imageFilenames = [];
    let imageNames = []

    if (req.files && req.files.length > 0) {
        imageFilenames = req.files.map(file => `${req.protocol}://${req.get('host')}/${dir}/${file.filename}`);
        imageNames = req.files.map(file => `${file.filename}`);
    }

    // Prepare images input
    let imagesInput = req.body.images;
    console.log("ImagesInput ====== >>>>>>> ", imagesInput);
    // Process image URLs
    if (req.body.images && req.body.images.length > 0) {
        // Prepare images input
        let imagesInput = req.body.images;
        if (typeof imagesInput === 'string') {
            imagesInput = imagesInput.split(',').map(image => image.trim());
        } // If it's not a string, assume it's already in the correct array format.
        console.log("ImagesInput ====== >>>>>>> ", imagesInput);
        imagesInput.forEach((imageInput, index) => {
            if (typeof imageInput === 'string' && imageInput.startsWith('http')) {
                // Extract the file extension from the URL
                const urlPath = new URL(imagesInput).pathname;
                const originalFilename = path.basename(urlPath);
                const fileExtension = originalFilename.split('.').pop();

                // Format the filename with the customName and the original file extension
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                let filename = `Image_${req.body.name}_${index}_${timestamp}.${fileExtension}`;
                filename = filename.replace(/[<>:"\/\\|?*]+/g, '_'); // Sanitize filename by replacing invalid characters with underscore

                // Construct the full filepath
                const filepath = path.join(dir, filename);

                imageProcesses.push(downloadImage(imageInput, dir, filename).then(() => {
                    imageFilenames.push(`${req.protocol}://${req.get('host')}/${dir}/${filename}`);
                    imageNames.push(filename)
                }).catch(error => {
                    console.error('Failed to download or save image:', error);
                }));
            }
        });
    }
    if (!(req.files && req.files.length > 0) && (!imagesInput || imagesInput.length === 0)) {
        return res.status(400).json({ message: 'At least one image (file upload or URL) is required.' });
    }

    try {
        await Promise.all(imageProcesses);

        const images = JSON.stringify(imageNames);
        const sql = 'INSERT INTO products (product_name, select_category, currency, quantity, price, description, rating, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const params = [req.body.name, req.body.category, req.body.currency, req.body.quantity, req.body.price, req.body.description, req.body.rating, images];

        const productInsertionResult = await db.query(sql, params); // Ensure `db.query` is promisified or supports async/await.
        const productId = productInsertionResult.insertId;

        res.status(201).json({
            message: 'Product data saved successfully.',
            product: {
                id: productId,
                product_name: req.body.name,
                select_category: req.body.category,
                currency: req.body.currency,
                quantity: req.body.quantity,
                price: req.body.price,
                description: req.body.description,
                rating: req.body.rating,
                images: imageFilenames
            }
        });
    } catch (error) {
        console.error('Error processing images or inserting product data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


///////////////////======================================get All products with multiple Images ========================================\\\\\\\\\\\\\\\\
const getAllProducts = async (req, res) => {
    const sql = 'SELECT * FROM products';
    try {
        const result = await db.query(sql);
        const products = result.map(product => {
            let imageFilenames = [];
            try {
                // Safely parse the 'image' field, expecting a JSON-encoded array of filenames
                imageFilenames = JSON.parse(product.image);
            } catch (parseError) {
                console.error('Failed to parse image filenames:', parseError);
                // If parsing fails, consider how you want to handle this. Options might include:
                // - Skipping this product
                // - Setting imageFilenames to an empty array (as done here)
                // - Using a default image filename
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
                // 'image' field is not included directly
            };

            // Adding image URLs dynamically to the product object
            imageFilenames.forEach((filename, index) => {
                const imageUrl = `${req.protocol}://${req.get('host')}/${dir}/${filename}`;
                productResponse[`image${index + 1}`] = imageUrl;
            });

            return productResponse;
        });

        // Respond with all products
        res.json({
            message: 'Products retrieved successfully.',
            products: products
        });
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getAllProducts, createProduct, upload, getProducts, getProductById, deleteProduct, updateProduct, getProductbyCategory };
