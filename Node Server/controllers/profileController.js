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
const dir = `${process.env.PROFILE_STORAGE_DIR}`;

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
            const filename = `Image_${date}_${req.body.Displayname}_${file.originalname}`;
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

//////////////////////==============================Create profile=============================\\\\\\\\\\\\\\\\\\\\\\\\\\

const createprofile = async (req, res) => {
    // Check for missing fields
    const requiredFields = ['Firstname', 'Lastname', 'Email', 'Mobilenumber', 'Password', 'ConfirmPassword', 'nameofshop', 'Displayname', 'intro', 'aboutyourself', 'time'];
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

    const sql = 'INSERT INTO profile ( Firstname, Lastname, Email,Mobilenumber,Password , ConfirmPassword, nameofshop,Displayname,intro,aboutyourself,time,image) VALUES ( ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)';
    const params = [ req.body.Firstname, req.body.Lastname, req.body.Email, req.body.Mobilenumber, req.body.Password, req.body.ConfirmPassword, req.body.nameofshop, req.body.Displayname, req.body.intro, req.body.aboutyourself, , req.body.time, image];

    try {
        const profile = await db.query(sql, params);
        let image = `${req.protocol}://${req.get('host')}/${dir}/${req.file.filename}`
        res.status(201).json({ message: 'profile data created successfully.', imagePath: `${image}`, profile: profile.insertId });
    } catch (error) {
        console.error('Error inserting profile data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
///////// get profile/////////////////////////
async function getprofile(req, res) {
    try {
        const profile = await db.query('SELECT* FROM profile');
        const transformedResults = profile.map(profile => ({
            ...profile,
            image: profile.image.startsWith('http') ? profile.image : `${req.protocol}://${req.get('host')}/${dir}/${profile.image}`
        }));
        res.status(200).json(transformedResults);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}
/////////// Get profile by Category////////////////////////////////////

const getprofilebyCategory = async (req, res) => {
    const category = req.query.category;
    let query = 'SELECT * FROM profile';
    const params = [];

    if (category) {
        query += ' WHERE select_category = ?';
        params.push(category);
    }
    try {
        // Query the database to get the groceries by category
        const profile = await db.query(query, params); // Use params array for parameterized query
        if (profile.length === 0) {
            return res.status(404).json({ error: 'No profile item available in this category' });
        }

        // Assuming there's a directory set up for grocery item images
        const dir = process.env.PROFILE_STORAGE_DIR || 'path/to/default/dir';

        // Transform the image path to full URLs
        const transformedResults = profile.map(profile => ({
            ...profile,
            image: profile.image.startsWith('http') ? profile.image : `${req.protocol}://${req.get('host')}/${dir}/${profile.image}`
        }));

        res.status(200).json(transformedResults);
    } catch (error) {
        console.error('Error fetching profile by category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
/////////// Get profile by id////////////////////////////////////////
async function getprofileById(req, res) {
    const id = req.query.id;
    // const id = req.query.id;
    try {
        // Query the database to get the product by its ID
        const profile = await db.query('SELECT * FROM profile WHERE Profile_id = ?', [id]);
        if (profile.length === 0) {
            // If no restaurant found with the given ID, return 404 Not Found
            return res.status(404).json({ error: 'profile not found' });
        }
        // If restaurant found, return it

        // Transform the image path to full URLs
        const transformedResults = {
            ...profile[0],
            image: profile[0].image.startsWith('http') ? profile[0].image : `${req.protocol}://${req.get('host')}/${dir}/${profile[0].image}`
        }
        res.status(200).json(transformedResults);
    }catch (error) {
        console.error('Error fetching restaurant by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}



///////////////////////////Delete profile/////////////////////////////
async function deleteprofile(req, res) {
    // const id = req.params.id;
    const id = req.query.id;
    try {
        // Check if the restaurant with the given ID exists
        const profile = await db.query('SELECT * FROM profile WHERE profile_id = ?', [id]);
        if (profile.length === 0) {
            // If no restaurant found with the given ID, return 404 Not Found
            return res.status(404).json({ error: 'profile not found' });
        }

        // Delete the restaurant from the database
        await db.query('DELETE FROM profile WHERE profile_id = ?', [id]);

        // Return success message
        res.status(200).json({ message: 'Profile deleted successfully' });
    } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
//////// update profile/////////////////
async function updateprofile(req, res) {
    const id = req.params.id;
    //const id = req.query.id;
    const {Firstname, Lastname, Email, Mobilenumber, Password,ConfirmPassword,nameofshop,Displayname,intro,aboutyourself,time} = req.body;

    try {
        // Fetch existing restaurant data from the database based on the provided ID
        const existingprofile = await db.query('SELECT * FROM profile WHERE profile_id = ?', [id]);
        if (existingprofile.length === 0) {
            return res.status(404).json({ error: 'profile not found' });
        }
        const existingData = existingprofile[0];

    
        let updatedProfImage = existingData.image;
        if (req.file) {
            // If a new file is uploaded, handle file upload and update Rest_logo
            updatedProfImage =`${req.file.filename}`;
        }
        const updatedData = {
     
            Firstname:Firstname || existingData. Firstname,
            Lastname: Lastname|| existingData.Lastname,
            Email: Email || existingData.Email,
            Mobilenumber:Mobilenumber || existingData.Mobilenumber,
            Password:Password || existingData.Password,
        	Confirmpassword:ConfirmPassword || existingData.Confirmpassword,
            nameofshop:nameofshop || existingData.nameofshop,
            Displayname:Displayname || existingData.Displayname,
            intro:intro || existingData.intro,
           aboutyourself: aboutyourself || existingData.aboutyourself,
            time:time || existingData.time,
            image:updatedProfImage
          };

        
        const updateColumns = [];
        const updateValues = [];
        for (const [key, value] of Object.entries(updatedData)) {
            if (value !== existingData[key]) {
                updateColumns.push(`${ key } = ?`);
                updateValues.push(value);
            }
        }
        if (updateColumns.length === 0) {
            // No fields have changed, return success message
            return res.status(200).json({ message: 'Restaurant data unchanged' });
        }
        updateValues.push(id); // Add the ID for the WHERE clause
        const updateQuery = `UPDATE profile SET ${ updateColumns.join(', ') } WHERE profile_id = ? `;

        // Execute the update query
        await db.query(updateQuery, updateValues);
         // Fetch updated restaurant details
         const updatedprofile = await db.query('SELECT * FROM profile WHERE profile_id = ?', [id]);
        // Transform the image path to full URLs
        const transformedResults = {
            ...updatedprofile[0],
            image: updatedprofile[0].image.startsWith('http') ? updatedprofile[0].image : `${ req.protocol }://${req.get('host')}/${dir}/${updatedprofile[0].image}`
    }
        console.log(transformedResults)

    // Return success message
    res.status(200).json({ message: 'profile updated successfully', updateddetails:transformedResults });
} catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
}
}


module.exports = { createprofile, upload, getprofile, getprofileById, deleteprofile, updateprofile, getprofilebyCategory };



