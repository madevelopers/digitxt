//
// digitxt.js
// ==========
//
// digitxt implementation in javascript.
// coding pattern inspired by underscore (http://underscorejs.org/)
//

(function () {
    var _dt = {},       // internal digitxt object
        digitxt,        // digitxt exposure object
        numDict,        // number conversion dictionary
        root;

    // Current version
    _dt.VERSION = '0.0.1';

    // Establish the root object, `window` in the browser,
    // or `global` on the server.
    root = this;

    numDict = {
        onesteens : [
            'zero',
            'one',
            'two',
            'three',
            'four',
            'five',
            'six',
            'seven',
            'eight',
            'nine',
            'ten',
            'eleven',
            'twelve',
            'thirteen',
            'fourteen',
            'fifteen',
            'sixteen',
            'seventeen',
            'eighteen',
            'nineteen'
        ],
        tys : [
            '',
            '',
            'twenty',
            'thirty',
            'forty',
            'fifty',
            'sixty',
            'seventy',
            'eighty',
            'ninety'
        ],
        huge : [
            '',
            'thousand',
            'million',
            'billion',
            'trillion',
            'quadrillion',
            'quintillion',
            'sextillion',
            'septillion',
            'octillion',
            'nonillion',
            'decillion',
            'undecillion',
            'duodecillion',
            'tredecillion',
            'quattuordecillion',
            'quindecillion',
            'sexdecillion',
            'septendecillion',
            'octodecillion',
            'novemdecillion',
            'vigintillion',
            'unvigintillion',
            'duovigintillion',
            'trevigintillion',
            'quattuorvigintillion',
            'quinvigintillion',
            'sexvigintillion',
            'septenvigintillion',
            'octovigintillion',
            'novemvigintillion',
            'trigintillion',
            'untrigintillion',
            'duotrigintillion',
            'tretrigintillion',
            'quattuortrigintillion',
            'quintrigintillion',
            'sextrigintillion',
            'septentrigintillion',
            'octotrigintillion',
            'novemtrigintillion',
            'quadragintillion',
            'unquadragintillion',
            'duoquadragintillion',
            'trequadragintillion',
            'quattuorquadragintillion',
            'quinquadragintillion',
            'sexquadragintillion',
            'septenquadragintillion',
            'octoquadragintillion',
            'novemquadragintillion',
            'quinquagintillion',
            'unquinquagintillion',
            'duoquinquagintillion',
            'trequinquagintillion',
            'quattuorquinquagintillion',
            'quinquinquagintillion',
            'sexquinquagintillion',
            'septenquinquagintillion',
            'octoquinquagintillion',
            'novemquinquagintillion',
            'sexagintillion',
            'unsexagintillion',
            'duosexagintillion',
            'tresexagintillion',
            'quattuorsexagintillion',
            'quinsexagintillion',
            'sexsexagintillion',
            'septsexagintillion',
            'octosexagintillion',
            'novemsexagintillion',
            'septuagintillion',
            'unseptuagintillion',
            'duoseptuagintillion',
            'treseptuagintillion',
            'quattuorseptuagintillion',
            'quinseptuagintillion',
            'sexseptuagintillion',
            'septseptuagintillion',
            'octoseptuagintillion',
            'novemseptuagintillion',
            'octogintillion',
            'unoctogintillion',
            'duooctogintillion',
            'treoctogintillion',
            'quattuoroctogintillion',
            'quinoctogintillion',
            'sexoctogintillion',
            'septoctogintillion',
            'octooctogintillion',
            'novemoctogintillion',
            'nonagintillion',
            'unnonagintillion',
            'duononagintillion',
            'trenonagintillion',
            'quattuornonagintillion',
            'quinnonagintillion',
            'sexnonagintillion',
            'septnonagintillion',
            'octononagintillion',
            'novemnonagintillion',
            'centillion'
        ]
    };

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

    // Expose this version only
    digitxt = function (num) {
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
    };

    // Export the digitxt object for **Node.js**, with
    // backwards-compatibility for the old `require()` API.
    // If we're in the browser, add `digitxt` as a global object
    // via a string identifier, for Closure Compiler "advanced" mode.
    if (typeof exports !== undefined) {
        if (typeof module !== undefined && module.exports) {
            module.exports = digitxt;
        }
    } else {
        root.digitxt = digitxt;
    }
}).call(this);
