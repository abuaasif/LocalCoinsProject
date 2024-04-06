const mysql = require('mysql2/promise')
require('dotenv').config();


/** Data base configuration  */
const pool = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_SCHEMA,
});

console.log(process.env.DB_HOST)

/** Data base connect check */
async function testConnection(){
    try{
        await pool.query('SELECT 1'); 
    }
    catch(error){
            console.log("Failed to connect Database: ",error);
    }
}

/**Handle Sql queries */

async function query(sql,params){
    try{
        const [results,]=await pool.execute(sql,params);
        return results;
    }catch(error){ 
        console.log("Failed to execute the query")
        throw error;
    }
}
module.exports = {testConnection,query};