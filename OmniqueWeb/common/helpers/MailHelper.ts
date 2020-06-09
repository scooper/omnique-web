// class for integrating with the node emailer
// should probably have some utilities which can accept form details

const nodemailer = require('nodemailer');
const config = require('../../config/config.json');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.emailer.infoEmail,
        pass: config.emailer.password
    }
});

function send(info) {
    var mailOptions = {
        from: config.emailer.infoEmail,
        to: config.emailer.omniqueEmail,
        subject: 'OmniqueWeb - ' + info.firstname + '\'s Message',
        text: 'Name: ' + info.firstname + ' ' + info.lastname + '\nEmail: ' + info.email + '\n' + info.message
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + info);
        }
    });
}

export { send }