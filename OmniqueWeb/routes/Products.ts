/*
 * GET product page.
 */
import express = require('express');
const router = express.Router();
import ProductDal = require ('../common/DAL/ProductDAL');

router.get('/', async (req: express.Request, res: express.Response) => {
    // test products?
    var useTestProducts = process.env.NODE_ENV == 'development';
    // get products from DB
    var products = await ProductDal.getProducts(useTestProducts);

    // pass through products to be displayed
    res.render('products', { title: 'Products', products: products });
});

router.get('/:productId', async (req: express.Request, res: express.Response) => {
    // pass through product using ID
    var product = await ProductDal.getProductById(req.params.productId);
    product.description = product.description.replace(/(?:\r\n|\r|\n)/g, '<br>');
    res.render('product', { title: 'Products', product: product });
});

export default router;