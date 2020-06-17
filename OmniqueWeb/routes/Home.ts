import express = require('express');
const router = express.Router();
import path = require("path");
const fs = require('fs');

const resources = path.resolve(__dirname, '../public/res');
const infoJson = require(resources + '/home-info.json');

const carousel = [
    { caption: "Crochet", image: "c-crochet.jpg"},
    { caption: "Prints", image: "c-prints.jpg"},
    { caption: "Apparel", image: "c-apparel.jpg"},
    { caption: "Glassware", image: "c-glassware.jpg"},
    { caption: "Merchandise", image: "c-merchandise.jpg"}
]

//***
//* GET home page.
//*
router.get('/', (req: express.Request, res: express.Response) => {
    var raw = fs.readFileSync(resources + '/home-cards.json');
    var cards = JSON.parse(raw);
    res.render('home', { title: 'About Us', cards: cards.cards, carousel: carousel, info: infoJson.info });
});

export default router;