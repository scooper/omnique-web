/*
 * GET product page.
 */
import express = require('express');
const router = express.Router();

router.get('/', (req: express.Request, res: express.Response) => {
    res.render('products', { title: 'Products' });
});

export default router;