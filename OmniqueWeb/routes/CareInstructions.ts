import express = require('express');
const router = express.Router();
import path = require("path");

const resources = path.resolve(__dirname, '../public/res');
const careJson = require(resources + '/care.json');


//***
//* GET home page.
//*
router.get('/', (req: express.Request, res: express.Response) => {
    // default messages to stop pug from complaining, the formhelper should maybe handle this
    var messages = { errors: [], info: [] };
    res.render('care-instructions', { title: 'Care Instructions', messages: messages, care: careJson });
});

export default router;