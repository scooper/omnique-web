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

// Handle this info

/* contactName
   groupName
   email
   confirmEmail
   itemType
   quantity
   itemColour
   sizeInfo
   designColour
   designInfo
   deadline
   otherInfo */

function sendLargeOrder(info) {
    var text = `
===== Contact =====
Email: ${info.email}
Contact Name: ${info.contactName} ${info.groupName != "" ? "- Group Name: " : ""}${info.groupName}
    
Items wanted for ${info.deadline}

===== Item ========
Item: ${info.itemType}, Quantity: ${info.quantity}
Item Colours: ${info.ItemColour}
${info.sizeInfo != "" ? "Sizes: " : ""}
${info.sizeInfo}

===== Design ======
Design Colour: ${info.designColour}
Design Information:
${info.designInfo}

${info.otherInfo != "" ? "===== Notes =======" : ""}
${info.otherInfo}
`;


    var mailOptions = {
        from: config.emailer.infoEmail,
        to: config.emailer.omniqueEmail,
        subject: 'OmniqueWeb - Merchandise Enquiry -' + info.contactName,
        text: text
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Email sent: ' + info);
        }
    });

}

export { send, sendLargeOrder }