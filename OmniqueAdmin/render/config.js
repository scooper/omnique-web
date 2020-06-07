'use strict'

const $ = require('jquery');
const { remote, ipcRenderer } = require('electron')
const ConfigHelper = require('../helpers/configHelper')

const config = ConfigHelper.getConfig();

// TODO: Probably to do this along with putting ipcMain events into separate files, config data should be stored
//       using electron-store like the products, and should be dynamically reloaded on save rather than having
//       to restart the application

$(document).ready(function () {
    // loop config, creating input fields based on type (we currently support 'text' and 'directory')
    for (var [key, value] of Object.entries(config)) {
        console.log(key + ' ' + value)
        var content = []
        switch (value.type) {
            case 'text':
                content.push($('<span>').addClass('input-group-addon').text(value.friendlyName))
                content.push($('<input>').addClass('form-input').attr('type', 'text').attr('id', key).val(value.value))
                break
            case 'directory':
                content.push($('<span>').addClass('input-group-addon').text(value.friendlyName))
                content.push($('<input>').addClass('form-input disabled').attr('type', 'text').attr('id', key).val(value.value))
                content.push($('<button>').addClass('btn input-group-btn file-choose').text("Choose Folder"))
                break
            default:
                break
        }
        console.log(content.length)
        if (content.length > 0)
            $('#configs').append($('<div>').addClass('input-group').append(content))
    }

    // event listener for file choosing
    $('.file-choose').click(async function (e) {
        e.preventDefault()
        $(this).addClass("loading")
        var path = await remote.dialog.showOpenDialog({
            properties: ['openDirectory']
        })

        $(this).removeClass("loading")

        if (path != null) {
            $(this).siblings('input').val(path.filePaths[0]);
        }
    })

    // save button
    $('#save').click(async function (e) {
        e.preventDefault()
        $('input').each(function () {
            config[$(this).attr('id')].value = $(this).val()
        })
        $(this).addClass('loading');
        await ConfigHelper.saveConfig(config);
        $(this).removeClass('loading');
        alert("The application will now shut down!")
        ipcRenderer.send('reload-config-page');
    })
})



