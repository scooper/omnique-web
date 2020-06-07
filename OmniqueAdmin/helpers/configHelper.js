var fs = require('fs')
var path = require('path')

const config = path.resolve(__dirname, '../configs');

class ConfigHelper {
    static getConfig = () => {
        var config = null;
        try {
            config = require('../configs/config.json')
        }
        catch {
            config = require('../configs/defaultConfig.json')
        }
        return config;
    }

    static saveConfig = async (data, configName = 'config') => {
        var json = JSON.stringify(data)
        console.log(config)
        await fs.writeFile(config + '/' + configName + '.json', json, 'utf8', () => {
            console.log("Successfully saved!");
        })
    }
}

module.exports = ConfigHelper