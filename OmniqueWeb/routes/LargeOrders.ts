import express = require('express');
const router = express.Router();
import MailHelper = require('../common/helpers/MailHelper');

//***
//* GET large orders page.
//*
router.get('/', (req: express.Request, res: express.Response) => {
    var messages = { errors: [], info: [] };
    res.render('large-orders', { title: 'Large Orders', messages: messages });
});


// process form for large order
router.post('/', (req: express.Request, res: express.Response) => {
    var messages = { errors: [], info: [] };

    var info = {
        contactName: req.body['contactname'],
        groupName: req.body['groupname'],
        email: req.body['email'],
        confirmEmail: req.body['emailConfirm'],
        itemType: req.body['type'],
        quantity: req.body['quantity'],
        itemColour: req.body['itemcolour'],
        sizeInfo: req.body['sizesinfo'],
        designColour: req.body['designcolour'],
        designInfo: req.body['designinfo'],
        deadline: req.body['deadline'],
        otherInfo: req.body['otherinfo']
    };

    // are emails matching (really this is to force the user to check their email is correct)
    if (info.email.toLowerCase() != info.confirmEmail.toLowerCase()) {
        messages.errors.push('Emails do not match!');
    }

    if (messages.errors.length == 0) {
        messages.info.push('Thank you for submitting!');

        // send email
        MailHelper.sendLargeOrder(info);
    }

    res.render('large-orders', { title: 'Large Orders', messages: messages });
});

export default router;
