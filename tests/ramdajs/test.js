#!/usr/bin/env node

// This is the same test from the js example

var fs             = require('fs'),
    lazy           = require('lazy'),
    colors         = require('colors'),
    testDataStream = fs.createReadStream('../test-data.txt'),
    digitxt        = require('../../ramdajs/digitxt-ramda');

lazy(testDataStream).lines.forEach(function (line) {
    var data     = line.toString().split('='),
        arg      = data[0].trim(),
        expect   = data[1].trim(),
        received = digitxt(arg),
        result   = received === expect ? 'passed'.green : 'failed'.red;

    console.log(arg + ': ' + result);
    if (/failed/.test(result)) {
        console.log('expected: ' + expect.toString().yellow);
        console.log('received: ' + received.toString().cyan);
    }
});
