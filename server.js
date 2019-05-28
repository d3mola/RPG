const express = require('express');
const fs = require('fs');
const { performance } = require('perf_hooks');
const util = require('util');
const debug = util.debuglog('performance');
const bodyParser = require('body-parser')

const PhoneNumberGenerator = require('./src/PhoneNumberGenerator');
const utils = require('./src/utils');

let cache = {};
const generator = new PhoneNumberGenerator(cache);

const app = express();

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
	extended: true
}));

const PORT = process.env.PORT || 8080;

app.get('/api', (req, res) => {
    res.status(200).json({
		message: 'Welcome to phone number generator'
	});
});

// view phone numebrs
app.get('/api/numbers', (req, res) => {
	const {order} = req.query;
	console.log(req.query);
	const numbersStr = utils.getPhoneNumbers();
	
	if (numbersStr.length) {
		let numbers = numbersStr.split(',');
		numbers = numbers.slice(0, numbers.length - 1);
		const amount = numbers.length;
		const min = Math.min(...numbers);
		const max = Math.max(...numbers);

		if (order === 'desc') {
			numbers = numbers.sort((a, b) => b - a);
		} else {
			numbers = numbers.sort((a, b) => a - b);
		}

		return res.status(200).json({
			status: 'success',
			message: 'Numbers retrieved successfully',
			data: {
				numbers,
				amount,
				min,
				max
			}
		});
	}
});

// generate phone numbers
app.post('/api/numbers', (req, res) => {
	performance.mark('Beginning POST Request');
	console.log('about to generate numbers');
	

    const numbers = generator.generatePhoneNumbers(req.query.amount);

	// saveNumbertoFile(numbers);
	utils.saveNumbertoFile(numbers, cache);

	performance.mark('End of post request');

	performance.measure('Entire POST Request', 'Beginning POST Request', 'End of post request');
	const measurements = performance.getEntriesByType('measure');
	
	measurements.forEach(measurement => {
	  debug('\x1b[32m%s\x1b[0m', measurement.name + ' ' + measurement.duration);
	});
	
    return res.status(201).json({
        status: 'success',
        message: 'Phone numbers generated',
        data: {
            numbers,
            amount: numbers.length
        }
	});
});

app.get('/*', (req, res) => {
	res.status(200).json({
		message: 'Visit https://github.com/d3mola/RPG/blob/master/README.md to view valid routes'
	});
})


app.listen(PORT, () => {
	console.log('server running on port...', PORT);
});

module.exports = app;