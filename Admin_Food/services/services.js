const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mysql = require('mysql2');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3100;
// require('dotenv').config();

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON-encoded bodies

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// Database connection
// const db=mysql.createConnection({
//   host:"103.92.235.85",
//   user:"yatayati_ameersk",
//   password:"Sohail@123",
//   database:"yatayati_Localcoins"

// });
const db=mysql.createConnection({
  host:"127.0.0.1",
  user:"root",
  password:"Sohail@123",
  database:"restaurant2"

});
db.connect((err) => {  
  if (err) {    
       console.error('Error connecting to database:', err);    
        return;  
      }  
      console.log('Connected to database!');
  });
  module.exports = db;


// Adjust multer storage configuration to not rely on req.body before it's available
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Use a default directory or extract the name later in the endpoint
    const dir = `./uploads/restaurant/temp`;
    fs.mkdir(dir, { recursive: true }, (error) => cb(error, dir));
  },
  filename: function (req, file, cb) {
    // Generate a temporary filename; will adjust the path later
    const fileName = `temp_${new Date().getTime()}.${file.originalname.split('.').pop()}`;
    cb(null, fileName);
  }

});

const upload = multer({ storage: storage });

// API to insert new restaurant
app.post('/api/restaurants', upload.single('rest_image'), (req, res) => {
  const { name, description, phone, address, manager, opening_time, closing_time } = req.body;
  if (req.file) {
    // Adjust the file's directory based on the restaurant's name now that we have it
    const newDir = `./uploads/restaurant/${name}`;
    const newFilePath = `${newDir}/${req.file.filename}`;

    fs.mkdir(newDir, { recursive: true }, (error) => {
      if (error) return res.status(500).send('Error creating directory');

      // Move the file to the new directory
      fs.rename(req.file.path, newFilePath, (err) => {
        if (err) return res.status(500).send('Error moving file');

        // Update the rest_image path to reflect the new location
        const rest_image = `${req.protocol}://${req.get('host')}/uploads/restaurant/${name}/${req.file.filename}`;

        const query = `INSERT INTO restaurant (name, description, phone, address, manager, opening_time, closing_time, rest_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        // Database query to insert the new restaurant data
        db.query(query, [name, description, phone, address, manager, opening_time, closing_time, rest_image], (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Error saving restaurant data');
          }
          res.status(201).send(`Restaurant added successfully and the new id is : ${result.insertId}`);
        });
      });
    });
  } else {
    // Handle case where no image is uploaded
    res.status(400).send('No image uploaded');
  }
});

// API to get all restaurants
app.get('/api/restaurants', (req, res) => {
  db.query('SELECT * FROM restaurant', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching restaurants');
    }
    // Transform the image path to full URLs
    const transformedResults = results.map(restaurant => ({
      ...restaurant,
      Rest_image: restaurant.Rest_image.startsWith('http') ? restaurant.Rest_image : `${req.protocol}://${req.get('host')}/${restaurant.Rest_image}`
    }));
    res.status(200).json(transformedResults);
  });
});

app.get('/api/restaurants/:id', (req, res) => {
  const { id } = req.params; // Extract the id from request parameters

  const query = 'SELECT * FROM restaurant WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: 'Error fetching restaurant data' });
    }
    if (results.length > 0) {
      res.status(200).json(results[0]); // Send the first (and should be only) result
    } else {
      res.status(404).json({ message: 'Restaurant Not Found, please Enter Valid Restaurant ID' });
    }
  });
});

app.get('/api/restaurant-image/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query('SELECT Rest_image FROM restaurant WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).send('Restaurant not found');
    }

    const imagePath = rows[0].Rest_image;
    // Assuming the imagePath is a relative path from the server's root
    const fullPath = path.join(__dirname, imagePath);

    // Check if the image exists
    if (fs.existsSync(fullPath)) {
      return res.sendFile(fullPath);
    } else {
      return res.status(404).send('Image not found');
    }
  } catch (err) {
    console.error('Error fetching image:', err);
    return res.status(500).send('Server error');
  }
});


const storage1 = multer.diskStorage({
  destination: (req, file, cb) => {
    const category = req.body.select_category; // Get category from form data
    const uploadPath = path.join(__dirname, 'uploads', category); // Create upload path
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    // Construct complete URL path
    const urlPath = `http://localhost:${port}/uploads/${req.body.select_category}/${file.fieldname}-${uniqueSuffix}${ext}`;
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    // Append the complete URL path to the file
    req.filePath = urlPath;
  }
});
// API endpoint to insert data and handle image upload
app.post('/api/products', upload.single('image'), (req, res) => {
  const { product_name, select_category, currency, quantity, price, description, rating } = req.body;
  const image = `${req.protocol}://${req.get('host')}/uploads/restaurant/temp/${req.file.filename}`;

  const query = `INSERT INTO products (product_name, select_category, currency, quantity, price, description, rating, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [product_name, select_category, currency, quantity, price, description, rating, image], (err, result) => {
    if (err) {
      console.error('Failed to insert data into database', err);
      return res.status(500).send('Failed to insert data into database');
    }
    res.status(201).send(`Prodcut successfully and the new id is : ${result.insertId}`);
  });
});

// API endpoint to get all products
app.get('/api/products', (req, res) => {
  const query = 'SELECT * FROM products';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Failed to fetch data from database', err);
      return res.status(500).send('Failed to fetch data from database');
    }
    res.json(results);
  });
});

app.get('/api/products/:productId', (req, res) => {
  const productId = req.params.productId;
  const query = 'SELECT * FROM products WHERE id = ?';

  db.query(query, [productId], (err, results) => {
    if (err) {
      console.error('Failed to fetch data from database', err);
      return res.status(500).send('Failed to fetch data from database');
    }
    // Since productId should uniquely identify a product, expect 0 or 1 result.
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('Product not found');
    }
  });
});

// API endpoint to get all categories
app.get('/api/categories', (req, res) => {
  const query = 'SELECT * FROM prodcate';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching categories: ', err);
      res.status(500).send('Error fetching categories');
      return;
    }
    res.json(results);
  });
});

app.get('/api/currencies', (req, res) => {
  const query = 'SELECT * FROM currency';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Failed to fetch currencies from database', err);
      return res.status(500).send('Failed to fetch currencies from database');
    }
    res.json(results);
  });
});

// API endpoint to get all categories
app.get('/api/categories', (req, res) => {
  const query = 'SELECT * FROM prodcate';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching categories: ', err);
      res.status(500).send('Error fetching categories');
      return;
    }
    res.json(results);
  });
});


app.put('/updateProduct', (req, res) => {
  const { prod_id, product_name, select_category, currency, quantity, price, description, rating, image } = req.body;

  // Check for missing fields
  // if (!prod_id || !product_name || !select_category || !currency || !quantity || !price || !description || rating === undefined || !image) {
  //   return res.status(400).send('Error: All fields are required');
  // }

  const updateSql = `
    UPDATE products SET 
    product_name = ?, 
    select_category = ?, 
    currency = ?, 
    quantity = ?, 
    price = ?, 
    description = ?, 
    rating = ?, 
    image = ?
    WHERE prod_id = ?`;

  const values = [product_name, select_category, currency, quantity, price, description, rating, image, prod_id];

  db.query(updateSql, values, (updateErr, updateResult) => {
    if (updateErr) {
      return res.status(500).send('Error: ' + updateErr.message);
    }
    // Check if the update was successful
    if (updateResult.affectedRows > 0) {
      // After a successful update, fetch the updated record
      const selectSql = `SELECT * FROM products WHERE prod_id = ?`;
      db.query(selectSql, [prod_id], (selectErr, selectResult) => {
        if (selectErr) {
          return res.status(500).send('Error fetching updated record: ' + selectErr.message);
        }
        // Send the updated record as a response
        res.json({
          message: 'Product updated successfully.',
          updatedRecord: selectResult[0] // Assuming prod_id is unique, there should only be one record
        });
      });
    } else {
      // If no rows were affected, it means no product was found with that prod_id
      res.status(404).send('No product found with the specified ID.');
    }
  });
});
// app.delete('/deleteProducts', (req, res) => {
//   // The request body should contain an array of product IDs to delete
//   const { productIds } = req.body;

//   // Validate the input to ensure it's an array and not empty
//   if (!Array.isArray(productIds) || productIds.length === 0) {
//     return res.status(400).send('Error: Please provide an array of product IDs.'); 
//   }

//   // Construct the SQL query to delete products by their IDs
//   // The query uses the IN clause to specify which IDs should be matched
//   let sql = `DELETE FROM products WHERE prod_id IN (?)`;

//   // Execute the query
//   db.query(sql, [productIds], (err, result) => {
//     if (err) {
//       console.error('Error deleting products:', err);
//       return res.status(500).send('Error deleting products');
//     }
//     // Check if any rows were affected
//     if (result.affectedRows > 0) {
//       res.send(`Products deleted successfully. Rows affected: ${result.affectedRows}`);
//     } else {
//       res.status(404).send('No products found with the specified IDs.');
//     }
//   });
// });

app.delete('/deleteProducts', (req, res) => {
  const { productIds } = req.body;

  // Validate the input
  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).send('Error: Please provide an array of product IDs.');
  }

  // First, find which of the provided IDs exist in the database
  const selectSql = `SELECT prod_id FROM products WHERE prod_id IN (?)`;
  db.query(selectSql, [productIds], (selectErr, selectResults) => {
    if (selectErr) {
      console.error('Error fetching products:', selectErr);
      return res.status(500).send('Error fetching products');
    }

    // Extract existing IDs from the query result
    const existingIds = selectResults.map(row => row.prod_id);
    const notFoundIds = productIds.filter(id => !existingIds.includes(id));

    // If there are IDs to delete
    if (existingIds.length > 0) {
      // Proceed to delete the products that exist
      const deleteSql = `DELETE FROM products WHERE prod_id IN (?)`;
      db.query(deleteSql, [existingIds], (deleteErr, deleteResult) => {
        if (deleteErr) {
          console.error('Error deleting products:', deleteErr);
          return res.status(500).send('Error deleting products');
        }

        // Respond with details about deletion and not found IDs
        res.json({
          message: `Successfully deleted products with IDs: ${existingIds.join(', ')}.`,
          deletedIds: existingIds,
          notFoundIds: notFoundIds
        });
      });
    } else {
      // If no provided IDs exist, just return the not found message
      res.status(404).json({
        message: 'No products found with the specified IDs.',
        notFoundIds: notFoundIds
      });
    }
  });
});

// / Update restaurant data API
app.put('/updateRestaurant', (req, res) => {
  const { id, name, description, phone, address, manager, opening_time, closing_time, rest_image } = req.body;
  if (!id || !name || !description || !phone || !address || !manager || !opening_time || !closing_time || !rest_image) {
    return res.status(400).json({ error: 'All fields are mandatory' });
  }

  const query = `UPDATE restaurant SET name = ?, description = ?, phone = ?, address = ?, manager = ?, opening_time = ?, closing_time = ?, rest_image = ? WHERE id = ?`;

  db.query(query, [name, description, phone, address, manager, opening_time, closing_time, rest_image, id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json({ message: 'Restaurant updated successfully' });
  });
});
// Delete multiple restaurants API
// app.delete('/deleteRestaurants', (req, res) => {
//   const { ids } = req.body; // Expecting an array of ids
//   if (!ids || ids.length === 0) {
//     return res.status(400).json({ error: 'An array of ids is mandatory for deletion.' });
//   }

//   // Constructing the query with placeholders for the IN clause
//   const placeholders = ids.map(() => '?').join(',');
//   const query = `DELETE FROM restaurant WHERE id IN (${placeholders})`;

//   db.query(query, ids, (error, results) => {
//     if (error) {
//       return res.status(500).json({ error: error.message });
//     }

//     if (results.affectedRows === 0) {
//       return res.status(404).json({ message: 'No restaurants found or already deleted.' });
//     }

//     res.json({ message: `${results.affectedRows} Restaurant(s) deleted successfully.` });
//   });
// });
// Delete multiple restaurants API with detailed response

app.delete('/deleterestaurants', (req, res) => {
  const { restaurantIds } = req.body;

  // Validate the input
  if (!Array.isArray(restaurantIds) || restaurantIds.length === 0) {
    return res.status(400).send('Error: Please provide an array of restaurant IDs.');
  }

  // First, find which of the provided IDs exist in the database
  const selectSql = 'SELECT id FROM restaurant WHERE id IN (?)';
  db.query(selectSql, [restaurantIds], (selectErr, selectResults) => {
    if (selectErr) {
      console.error('Error fetching restaurant:', selectErr);
      return res.status(500).send('Error fetching restaurant');
    }

    // Extract existing IDs from the query result
    const existingIds = selectResults.map(row => row.prod_id);
    const notFoundIds = restaurantIds.filter(id => !existingIds.includes(id));

    // If there are IDs to delete
    if (existingIds.length > 0) {
      // Proceed to delete the products that exist
      const deleteSql = `DELETE FROM restaurant WHERE id IN (?)`;
      db.query(deleteSql, [existingIds], (deleteErr, deleteResult) => {
        if (deleteErr) {
          console.error('Error deleting restaurant:', deleteErr);
          return res.status(500).send('Error deleting restaurants');
        }

        // Respond with details about deletion and not found IDs
        res.json({
          message: `Successfully deleted restaurants with IDs: ${existingIds.join(', ')}.`,
          deletedIds: existingIds,
          notFoundIds: notFoundIds
        });
      });
    } else {
      // If no provided IDs exist, just return the not found message
      res.status(404).json({
        message: 'No restaurants found with the specified IDs.',
        notFoundIds: notFoundIds
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
