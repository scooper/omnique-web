import express = require('express');
const router = express.Router();
import path = require("path");
const fs = require('fs');

const resources = path.resolve(__dirname, '../public/res');

//***
//* GET home page.
//*
router.get('/', (req: express.Request, res: express.Response) => {
    var raw = fs.readFileSync(resources + '/home-cards.json');
    var cards = JSON.parse(raw);
    res.render('home', { title: 'About Us', cards: cards.cards });
});

export default router;