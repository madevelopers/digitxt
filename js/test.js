#!/usr/bin/env node

var testcase,
    expect,
    testCount   = 0,
    passedCount = 0,
    failedCount = 0,
    failureMessages = [],
    digitxt  = require('./digitxt');
    testdata = require('../testdata');

for (data in testdata) {
    if (testdata.hasOwnProperty(data)) {
        testcase = digitxt(data);
        expect = testdata[data];
        testCount += 1;

        if (testcase !== expect) {
            failedCount += 1;
            failureMessages.push([
                'failed on: ' + data,
                'expected: ' + expect,
                'received: ' + testcase
            ].join('\n'));
        } else {
            passedCount += 1;
        }
    }
}

console.log('Total test count: ' + testCount);
console.log('Passed: ' + passedCount);
console.log('Failed: ' + failedCount);

if (failureMessages.length) {
    console.log('\n' + failureMessages.join('\n\n'));
}
