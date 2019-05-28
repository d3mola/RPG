const fs = require('fs');

const utils = {};

utils.getPhoneNumbers = () => {
    if (fs.existsSync('./src/phoneNumbers.txt')) {
        return fs.readFileSync('./src/phoneNumbers.txt', 'utf-8');
    }

    throw 'File does not exist';
};

utils.saveNumbertoFile = (numbers, cache) => {
    fs.appendFile('./src/phoneNumbers.txt', numbers + ',', function(err) {
        if (err) {
            return console.log(err);
        }

        console.log('The file was saved!');
    });

    cache = { ...cache };
};

module.exports = utils;
