const express = require('express');
const path = require('path');
const fs = require('fs').promises; // To read directory contents
require('dotenv').config();
const dir = process.env.PRODUCTS_STORAGE_DIR

// const filterImagesByKeyword = async (req, res, next) => {
//     const protocol = req.protocol; // 'http' or 'https'
//     const host = req.get('host'); // Host includes both hostname and port (if specified)
//     const baseUrl = `${protocol}://${host}`;

//     try {
//         const files = await fs.readdir(dir);
//         const matchedFiles = files.filter(file => file.includes(req.query.keyword));
        
//         if (matchedFiles.length === 0) {
//             return res.status(404).send('No matching files found');
//         }

//         const filesObject = matchedFiles.map((fileName, index) => {
//             // Split the fileName by underscores and remove the last part (e.g., "download.jpg")
//             let nameParts = fileName.split('_');
//             nameParts.pop(); // Removes the last part like "download.jpg"
//             let readableName = nameParts.join(' '); // Re-join the parts for a more readable name

//             // Extracting the image name, assuming it's before "_download.jpg"
//             let imageName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "Unnamed";

//             return {
//                 id: `img-${Date.now()}-${index}`, // Unique ID for each image
//                 name: imageName, // Use the more readable name
//                 url: `${baseUrl}/${dir}/${encodeURIComponent(fileName)}`,
//             };
//         });
        
//         // Prepare and send the response
//         res.json({
//             totalFiles: matchedFiles.length,
//             files: filesObject
//         });

//     } catch (error) {
//         console.error('Error serving filtered images:', error);
//         next(error);
//     }
// };

const filterImagesByKeyword = async (req, res, next) => {
    const protocol = req.protocol; // 'http' or 'https'
    const host = req.get('host'); // Host includes both hostname and port (if specified)
    const baseUrl = `${protocol}://${host}`;

    try {
        const files = await fs.readdir(dir);
        const matchedFiles = files.filter(file => file.includes(req.query.keyword));
        
        if (matchedFiles.length === 0) {
            return res.status(404).send({message : 'No matching files found'});
        }

        const filesObject = matchedFiles.map((fileName, index) => {
            // Split the fileName by underscores
            let nameParts = fileName.split('_');
            // Assuming the desired part is always before the last occurrence of "_download.jpg"
            // Extract the part of the name that you're interested in, which is before "_download.jpg"
            let imageNameWithExtension = nameParts.slice(-1)[0];
            let imageName = imageNameWithExtension.split('.')[0]; // Removes the ".jpg"

            return {
                id: `img-${Date.now()}-${index}`, // Unique ID for each image
                name: imageName, // Use the extracted part as the name
                url: `${baseUrl}/${dir}/${encodeURIComponent(fileName)}`, // Construct the URL
                file: `${dir}/${encodeURIComponent(fileName)}`,
            };
        });
        
        // Prepare and send the response
        res.json({
            totalFiles: matchedFiles.length,
            files: filesObject
        });
        

    } catch (error) {
        console.error('Error serving filtered images:', error);
        next(error);
    }
};



module.exports = {filterImagesByKeyword};