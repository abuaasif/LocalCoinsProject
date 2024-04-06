require('dotenv').config();   /**Access Environment Variables */
const db = require('../Mysql2'); /**Access Db objects */


async function getCategory(req, res) {
    try {
        const prodCategory = await db.query('SELECT * FROM prodcate');
        res.status(200).json(prodCategory);
    } catch (error) {
        console.error('Error : Unable to fetch prodcate', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getgrocycat(req,res) {
    try{
        const grocycat =await db.query('SELECT*FROM grocycat');
        res.status(200).json(grocycat);
    }catch(error) {
        console.error('Error : unable to fetch grocycat',error);
        res.status(500).json({error:'Internal server error' });
    }
}
async function getmeatcate(req,res) {
    try{
        const meatcate = await db.query('SELECT*FROM meatcate');
        res.status(200).json(meatcate);
    }catch(error) {
        console.error('Error: unable to fetch meatcate',error);
        res.status(500).json({error:'Internal server error'});
    }
    }

module.exports={getCategory,getgrocycat,getmeatcate};