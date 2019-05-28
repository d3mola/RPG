const express = require('express');
const fs = require('fs');
const { performance } = require('perf_hooks');
const util = require('util');
const debug = util.debuglog('performance');
const bodyParser = require('body-parser');

const PhoneNumberGenerator = require('./src/PhoneNumberGenerator');
const utils = require('./src/utils');

let cache = {};
const generator = new PhoneNumberGenerator(cache);

const app = express();

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

const PORT = process.env.PORT || 8080;

app.get('/api', (req, res) => {
    res.status(200).json({
        message: 'Welcome to phone number generator'
    });
});

// view phone numebrs
app.get('/api/numbers', (req, res) => {
    try {
        const { order } = req.query;
        const numbersStr = utils.getPhoneNumbers();

        let numbers = numbersStr.split(',');
        numbers = numbers.slice(0, numbers.length - 1);
        const sortedAsc = [...numbers].sort((a, b) => a - b);
        const sortedDesc = [...sortedAsc].reverse();
        const amount = numbers.length;

        const min = sortedAsc[0];
        const max = sortedDesc[0];

        if (order === 'desc') {
            numbers = sortedDesc;
        } else {
            numbers = sortedAsc;
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
    } catch (error) {
        return res.status(400).json({
            status: 'failure',
            message: error
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

    performance.measure(
        'Entire POST Request',
        'Beginning POST Request',
        'End of post request'
    );
    const measurements = performance.getEntriesByType('measure');

    measurements.forEach(measurement => {
        debug(
            '\x1b[32m%s\x1b[0m',
            measurement.name + ' ' + measurement.duration
        );
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
        message:
            'Visit https://github.com/d3mola/RPG/blob/master/README.md to view valid routes'
    });
});

app.listen(PORT, () => {
    console.log('server running on port...', PORT);
});

module.exports = app;
