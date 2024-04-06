const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const RestaurantRouter = require('./Router/RestaurantRouter');
const ProductsRouter = require('./Router/ProductsRouter');
const CurrenciesRouter = require('./Router/CurrencyRouter');
const CategoryRouter = require('./Router/CategoryRouter');
const groceryRouter = require('./Router/groceryRouter');
const MeatProdRouter = require('./Router/MeatProdRouter');
const profileRouter = require('./Router/profileRouter');
const {testConnection,query} = require('./Mysql2');
const ImageRouter = require('./Router/ImageRouter');
const router = express.Router();
/**const testConnection = require('./Mysql2'): This statement directly assigns the entire module object exported by './Mysql2' 
 * to the constant variable testConnection. If the module exports multiple functions or variables, they would be accessible through 
 * the testConnection variable as properties of the imported module object. 
 * To use the testConnection function, you would call it as testConnection.testConnection(). */

/**const {testConnection} = require('./Mysql2'): This statement uses object destructuring to import only the 
 * testConnection function from the './Mysql2' module. It creates a constant variable named 
 * testConnection that directly references the testConnection function exported by the module. */

const App = express();
App.use(cors());
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({extended:false})); /**used to handle form data requests */

const port = process.env.PORT || 3000;
testConnection()  /** const {testConnection} = require('./Mysql2')*/
//testConnection.testConnection() /** const testConnection = require('./Mysql2') */
    .then(()=>console.log("DB Connected successfully."))
    .catch((error)=>console.log("Error Connecting DB: ",error));

App.use('/api',RestaurantRouter,ProductsRouter,CurrenciesRouter,CategoryRouter,groceryRouter,MeatProdRouter,profileRouter,ImageRouter);
App.use(`/${process.env.RESTAURANT_STORAGE_DIR}`, express.static(`${process.env.RESTAURANT_STORAGE_DIR}`));
App.use(`/${process.env.PROFILE_STORAGE_DIR }`, express.static(`${process.env.PROFILE_STORAGE_DIR }`));
/**express.static(): This is a built-in middleware function in Express that serves static files and is based on the serve-static middleware. 
 * It takes the root directory from which to serve static assets as an argument. */
App.use(`/${process.env.PRODUCTS_STORAGE_DIR}`, express.static(`${process.env.PRODUCTS_STORAGE_DIR}`));


App.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}`);
});