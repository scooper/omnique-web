import express = require('express');
const router = express.Router();
import path = require("path");


const resources = path.resolve(__dirname, '../public/res');

const testimonialJson = require(resources + '/testimonials.json');

//***
//* GET testimonals page.
//*
router.get('/', (req: express.Request, res: express.Response) => {
    res.render('testimonials', { title: 'Testimonials', testimonials: testimonialJson.testimonials });
});

export default router;
