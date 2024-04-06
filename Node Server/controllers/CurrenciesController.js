require('dotenv').config();   /**Access Environment Variables */
const db = require('../Mysql2'); /**Access Db objects */


async function getCurrencies(req, res) {
    try {
        const currencies = await db.query('SELECT * FROM currency');
        res.status(200).json(currencies);
    } catch (error) {
        console.error('Error fetching currencies:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports={getCurrencies};