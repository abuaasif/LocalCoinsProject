const multer = require('multer');
const path = require('path');
/**The path module is required for working with file paths in Node.js,
 and it's used here to extract the file extension from the original filename. */
const fs = require('fs').promises;
const db = require('../Mysql2');
require('dotenv').config();


// Multer storage configuration
const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        var dir = `./${process.env.RESTAURANT_STORAGE_DIR}`;
        try {
            await fs.mkdir(dir, { recursive: true });
            cb(null, dir); // Destination folder
        } catch (error) { cb(error); }

    },
    filename: async function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const date = new Date().toISOString().replace(/:/g, '_'); // Date format for filename
        cb(null, `Image_${date}_${req.body.name}_${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// const upload = multer({ 
//     storage: storage,
//     limits: { fileSize: 1024 * 1024 * 5 } // Example: limit file size to 5MB
// });

/** requiredFields:             This is an array containing the names of all fields that are required for the restaurant data.
filter():                   This method is used to create a new array with all elements that pass the test implemented by the provided function.
field => !req.body[field]: This is the function provided to filter(). It takes each field from requiredFields and checks if it 
exists in req.body. If the field is missing in req.body, !req.body[field] evaluates to true, meaning the field is missing. */
///////////////////======================================Create Restaurant  ========================================\\\\\\\\\\\\\\\\
const createRestaurant = async (req, res) => {
    // Check for missing fields
    const requiredFields = ['name', 'description', 'phone', 'address', 'manager', 'opening_time', 'closing_time'];
    const missingFields = requiredFields.filter(field => !req.body[field]);


    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing fields: ${missingFields.join(', ')}` });
    }

    // Check for null or empty fields
    const nullFields = requiredFields.filter(field => !req.body[field] || req.body[field].trim() === '');
    if (nullFields.length > 0) {
        return res.status(400).json({ error: `Null or empty fields: ${nullFields.join(', ')}` });
    }

    // Additional check for file upload
    if (!req.file) {
        return res.status(400).json({ message: 'Image upload is mandatory.' });
    }


    // Inserting data into the database
    const Rest_logo = `${req.file.filename}`;

    const sql = 'INSERT INTO restaurant (name, description, phone, address, manager, opening_time, closing_time, Rest_logo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const params = [req.body.name, req.body.description, req.body.phone, req.body.address, req.body.manager, req.body.opening_time, req.body.closing_time, Rest_logo];

    try {
        const restaurant = await db.query(sql, params);
        await db.query(sql, params);
        const image = `${req.protocol}://${req.get('host')}/${process.env.RESTAURANT_STORAGE_DIR}/${req.file.filename}`
        res.status(201).json({ message: 'Restaurant data saved successfully.', imagePath: `${image}`, restaurant_id: restaurant.insertId });
    } catch (error) {
        console.error('Error inserting restaurant data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


///////////////////======================================Get Restaurant  ========================================\\\\\\\\\\\\\\\\

async function getRestaurants(req, res) {
    try {
        const restaurants = await db.query('SELECT * FROM restaurant');
        const dir = process.env.RESTAURANT_STORAGE_DIR
        // Transform the image path to full URLs
        const transformedResults = restaurants.map(restaurant => ({
            ...restaurant,
            Rest_logo: restaurant.Rest_logo.startsWith('http') ? restaurant.Rest_logo : `${req.protocol}://${req.get('host')}/${dir}/${restaurant.Rest_logo}`
        }));
        /**this statement maps through an array of restaurant objects, and for each object, it checks if the Rest_logo property is already a complete URL. 
         * If it is, it leaves it unchanged. If not, it constructs a new URL using information from the request (req) object and the directory (dir). 
         * Finally, it returns an array of transformed restaurant objects with updated Rest_logo properties. 
         * This is commonly used to ensure that the logo URLs are consistent and usable across different parts of the application. */

        res.status(200).json(transformedResults);
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

///////////////////======================================Get Restaurantby ID  ========================================\\\\\\\\\\\\\\\\

async function getRestaurantById(req, res) {
    const id = req.query.id;
    // const id = req.query.id;
    try {
        // Query the database to get the restaurant by its ID
        const restaurant = await db.query('SELECT * FROM restaurant WHERE id = ?', [id]);
        if (restaurant.length === 0) {
            // If no restaurant found with the given ID, return 404 Not Found
            return res.status(404).json({ error: 'Restaurant not found' });
        }
        // If restaurant found, return it
        const dir = process.env.RESTAURANT_STORAGE_DIR
        // Transform the image path to full URLs
        const transformedResults = {
            ...restaurant[0],
            Rest_logo: restaurant[0].Rest_logo.startsWith('http') ? restaurant[0].Rest_logo : `${req.protocol}://${req.get('host')}/${dir}/${restaurant[0].Rest_logo}`
        }
        res.status(200).json(transformedResults);
    } catch (error) {
        console.error('Error fetching restaurant by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

///////////////////======================================Delete Restaurant  ========================================\\\\\\\\\\\\\\\\


async function deleteRestaurant(req, res) {
    // const id = req.params.id;
    const id = req.query.id;
    try {
        // Check if the restaurant with the given ID exists
        const restaurant = await db.query('SELECT * FROM restaurant WHERE id = ?', [id]);
        if (restaurant.length === 0) {
            // If no restaurant found with the given ID, return 404 Not Found
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        // Delete the restaurant from the database
        await db.query('DELETE FROM restaurant WHERE id = ?', [id]);

        // Return success message
        res.status(200).json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        console.error('Error deleting restaurant:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

///////////////////======================================Update Restaurant  ========================================\\\\\\\\\\\\\\\\
async function updateRestaurant(req, res) {
    const id = req.params.id;
    const { name, description, phone, address, manager, opening_time, closing_time } = req.body;

    try {
        // Fetch existing restaurant data from the database based on the provided ID
        const existingRestaurant = await db.query('SELECT * FROM restaurant WHERE id = ?', [id]);
        if (existingRestaurant.length === 0) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }
        const existingData = existingRestaurant[0];

        // Handle file upload if a file is included in the request
        let updatedRestLogo = existingData.Rest_logo;
        if (req.file) {
            // If a new file is uploaded, handle file upload and update Rest_logo
            const dir = process.env.RESTAURANT_STORAGE_DIR;
            updatedRestLogo = `${req.file.filename}`;
        }

        // Compare request data with existing data to identify changed fields
        const updatedData = {
            name: name || existingData.name,
            description: description || existingData.description,
            phone: phone || existingData.phone,
            address: address || existingData.address,
            manager: manager || existingData.manager,
            opening_time: opening_time || existingData.opening_time,
            closing_time: closing_time || existingData.closing_time,
            Rest_logo: updatedRestLogo
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
        const updateQuery = `UPDATE restaurant SET ${updateColumns.join(', ')} WHERE id = ?`;

        // Execute the update query
        await db.query(updateQuery, updateValues);
         // Fetch updated restaurant details
         const updatedRestaurant = await db.query('SELECT * FROM restaurant WHERE id = ?', [id]);

        const dir = process.env.RESTAURANT_STORAGE_DIR
        // Transform the image path to full URLs
        const transformedResults = {
            ...updatedRestaurant[0],
            Rest_logo: updatedRestaurant[0].Rest_logo.startsWith('http') ? updatedRestaurant[0].Rest_logo : `${req.protocol}://${req.get('host')}/${dir}/${updatedRestaurant[0].Rest_logo}`
        }
        console.log(transformedResults)

        // Return success message
        res.status(200).json({ message: 'Restaurant updated successfully',transformedResults });
    } catch (error) {
        console.error('Error updating restaurant:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { createRestaurant, upload, getRestaurants, getRestaurantById, deleteRestaurant, updateRestaurant };




/**In this code snippet:

The upload.single('image') middleware is used to handle file uploads. It expects a single file with the field name 'image' 
in the request.
The uploaded file information is available in req.file.
The filename of the uploaded file is used as a parameter value (req.file.filename) to be inserted into the database. 
This is assuming that the upload middleware is configured to save the uploaded file with the multer package.
If the file upload fails for any reason, the req.file object will be undefined, and you should handle that case accordingly. */