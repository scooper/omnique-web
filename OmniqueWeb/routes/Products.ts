/*
 * GET product page.
 */
import express = require('express');
const router = express.Router();
import ProductDal = require ('../common/DAL/ProductDAL');

router.get('/', async (req: express.Request, res: express.Response) => {
    // get products from DB
    var products = await ProductDal.getProducts(true);

    // pass through products to be displayed
    res.render('products', { title: 'Products', products: products });
});

export default router;