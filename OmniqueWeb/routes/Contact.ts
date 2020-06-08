import express = require('express');
const router = express.Router();

//***
//* GET home page.
//*
router.get('/', (req: express.Request, res: express.Response) => {
    // default messages to stop pug from complaining, the formhelper should maybe handle this
    var messages = { errors: [], info: [] };
    res.render('contact', { title: 'Contact Us', messages: messages });
});

// /contact - post for the contact form, should use some form helper in the future to build the forms
// right now extract info, using a message system show any errors, else show success message
router.post('/', (req: express.Request, res: express.Response) => {
    var messages = { errors: [], info: []};
    var fname = req.body['firstname'];
    var lname = req.body['lastname'];
    var email = req.body['email'];
    var confirmEmail = req.body['emailConfirm'];
    var message = req.body['message'];

    // are emails matching (really this is to force the user to check their email is correct)
    if (email != confirmEmail) {
        messages.errors.push('Emails do not match!');
    }

    if (messages.errors.length == 0) {
        messages.info.push('Thank you for submitting!');

        // send email
    } 

    res.render('contact', { title: 'Contact Us', messages: messages });

})

export default router;