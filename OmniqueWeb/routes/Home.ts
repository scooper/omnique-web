import express = require('express');
const router = express.Router();
import path = require("path");
const fs = require('fs');

const resources = path.resolve(__dirname, '../public/res');
const infoJson = require(resources + '/home-info.json');
const cardsJson = require(resources + '/home-cards.json');

const carousel = [
    { caption: "Crochet", image: "c-crochet.jpg"},
    { caption: "Prints", image: "c-prints.jpg"},
    { caption: "Apparel", image: "c-apparel.jpg"}
    //{ caption: "Merchandise", image: "c-merchandise.jpg"}
]

//***
//* GET home page.
//*
router.get('/', (req: express.Request, res: express.Response) => {
    res.render('home', { title: 'About Us', cards: cardsJson.cards, carousel: carousel, info: infoJson.info });
    //res.render('coming-soon');
});

export default router;