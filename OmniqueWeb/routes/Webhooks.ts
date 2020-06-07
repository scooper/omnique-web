import express = require('express');
import dropbox = require('../common/helpers/DropboxHelper');
const router = express.Router();

//***
//* this is the dropbox webhook, it triggers a poll event to download any new dropbox files
//*
router.post('/dropbox', (req: express.Request, res: express.Response) => {
    dropbox.DropboxHelper.PollFiles();
});

// dropbox will send a get request for validation to any newly added webhook
// this needs to be triggered for any other webhooks to be sent
router.get('/dropbox', (req: express.Request, res: express.Response) => {

    // get the challenge token
    var challenge = req.query.challenge;
    // handle error
    if (challenge == null) {
        res.status(401);
        res.render('error', {
            message: 'Unauthorised access!',
            error: {status: 401}
        });
    }


    // set appropriate headers and respond
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.send(challenge);
});

export default router