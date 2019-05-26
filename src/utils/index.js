const fs = require('fs');

const utils = {};

utils.getPhoneNumbers = () => {
	return fs.readFileSync("./src/phoneNumbers.txt", 'utf-8')
};

utils.saveNumbertoFile = (numbers, cache) => {
	fs.appendFile("./src/phoneNumbers.txt", numbers + ',', function(err) {
		if(err) {
			return console.log(err);
		}
	
		console.log("The file was saved!");
	});

	cache = { ...cache };
};

module.exports = utils;
