const express = require('express');
const router = express.Router();

router.get('/api/groceries', async (req, res) => {
    // Extract category and product_prefix from query parameters
    const { category, product_prefix } = req.query;

    let sql = 'SELECT * FROM grocery WHERE 1=1';
    const params = [];

    // Append conditions to SQL query based on provided query parameters
    if (category) {
        sql += ' AND select_category = ?';
        params.push(category);
    }
    if (product_prefix) {
        // Note: SQL uses '%' as a wildcard for zero or more characters
        sql += ' AND product_name LIKE ?';
        params.push(`${product_prefix}%`);
    }
    // No additional condition is needed for fetching all records, as 'WHERE 1=1'
    // effectively does nothing and is only there to simplify query concatenation

    try {
        // Execute the query with the appropriate filters
        const products = await db.query(sql, params);

        // Check if products exist
        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found matching the criteria.' });
        }

        // Respond with the filtered or all products based on the query parameters
        res.json({
            message: 'Products retrieved successfully.',
            products: products
        });
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
