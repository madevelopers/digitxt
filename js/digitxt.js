(function (root) {
    var _dt,      // internal digitxt object
        numDict;  // number conversion dictionary

    _dt = {
        version: '0.0.1'
    };
    numDict = require('../numbers.json');

    // Sanitize the supplied number for conversion
    _dt.sanitize = function (num) {
        // replace invalid characters with nothing
        // (valid characters are numbers 0-9 and period)
        num = num.replace(/[^\d\.]/ig, '');

        // remove multiple dot occurences
        num = num.replace(/\.{2,}/g, '.');

        // remove the last dot character if present
        num = num.replace(/\.$/, '');

        // remove leading zeroes
        num = num.replace(/^0+([^0]+)/, '$1');

        // prepend `0` if first character is a dot
        num = num.replace(/^\.(.+)/, '0.$1');

        // only single decimals allowed
        num = num.replace(/(\d+(\.\d+)?).*$/, '$1');

        return num;
    };

    // Splits the sanitized whole number and groups it by three from the last
    // Regex copied from http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    _dt.splitWholeNumbers = function (num) {
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',').split(',');
    };

    // Splits the supplied number to two groups: 'wholeNumbers' and 'decimals'
    _dt.splitNumber = function (num) {
        var numSplit = _dt.sanitize(num).split('.');

        return {
            wholeNumbers : _dt.splitWholeNumbers(numSplit[0]),
            decimals     : numSplit[1]
        };
    };

    // Converts the supplied number to its hundreds denomination
    _dt.convertTillHundreds = function (num) {
        var _tys,
            _num      = parseInt(num, 10),
            _tens    = Math.floor((_num > 9) ? ((_num % 100) / 10) : 0),
            _ones    = Math.floor(_num % 10),
            hundreds = Math.floor(_num / 100),
            tens     = (_tens === 1) ? (_tens * 10 + _ones) : _tens,
            ones     = (tens > 9) ? 0 : _ones,
            output   = [];

        if (hundreds > 0) {
            output.push(numDict.onesteens[hundreds] + ' hundred');
        }

        if (_tens === 0) {
            // handle `ones` value
            if (!((hundreds > 0) && (ones === 0))) {
                output.push(numDict.onesteens[ones]);
            }
        } else if (_tens === 1) {
            // handle `teens` value
            output.push(numDict.onesteens[tens]);
        } else if (_tens > 1) {
            // handle tys
            _tys = numDict.tys[_tens];
            _tys += (_ones > 0) ? (' ' + numDict.onesteens[_ones]) : '';
            output.push(_tys);
        }

        return output.join(' ');
    };

    _dt.convertDecimals = function (num) {
        var result = [],
            decis = num.split(''),
            _i = 0,
            _l = decis.length;

        for (; _i < _l; _i += 1) {
            result.push(numDict.onesteens[decis[_i]]);
        }

        return result.join(' ');
    };

    function digitxt(num) {
        var decimal = '',
            whole = [];

        num = _dt.splitNumber(num);

        num.wholeNumbers.forEach(function (v, k) {
            var denomination = (function () {
                    var index = num.wholeNumbers.length - k - 1;
                    return (index !== 0) ? (' ' + numDict.huge[index]) : '';
                }());
            whole.push(_dt.convertTillHundreds(v) + denomination);
        });

        if (num.decimals) {
            decimal = ' point ' + _dt.convertDecimals(num.decimals);
        }

        return whole.join(' ') + decimal;
    }

    module.exports = digitxt;
}(this));
