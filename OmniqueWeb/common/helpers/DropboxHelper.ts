import http = require('http');
import path = require('path');
import fs = require("fs");
import db = require('dropbox');
var fetch = require('isomorphic-fetch');
const config = require('../../config/config.json');

const productImages = path.resolve(__dirname, '../../public/images/products');

export class DropboxHelper {
    //***
    //* Get dropbox context
    //*
    private static dbx = new db.Dropbox({
        fetch: fetch,
        accessToken: config.dropbox.accessToken
    });

    //***
    //* check for any new files in app folder
    //* if images, validate they are images and download them to public
    //* if config, validate json and download/replace file
    //*
    public static PollFiles() {
        DropboxHelper.dbx.filesListFolder({ path: '' }).then(DropboxHelper.resolve).catch(DropboxHelper.error);
    }

    private static resolve(data) {
        var serverFiles: string[] = [];
        for (const entry of data.entries as db.files.FileMetadataReference[]) {
            console.log(entry);
            serverFiles.push(entry.name);
        }
        // need to see if there are any more files

        var localFiles = DropboxHelper.getLocalFiles();

        var localResults = localFiles.filter(x => !serverFiles.includes(x));
        var serverResults = serverFiles.filter(x => !localFiles.includes(x));

        // delete files
        localFiles.forEach((val) => {
            fs.unlink(productImages + '/' + val, DropboxHelper.error);
        });

        // download files
        serverFiles.forEach((val) => {
            DropboxHelper.dbx.filesDownload({ path: '/' + val }).then((metadata) => {
                // @ts-ignore
                fs.writeFile(productImages + '/' + val, metadata.fileBinary, 'binary', DropboxHelper.error);

            }).catch(DropboxHelper.error);
        });
    }

    private static getLocalFiles(): string[] {
        let files = fs.readdirSync(productImages);
        return files;
    }

    private static error(err) {
        console.error(err);
        return;
    }
}