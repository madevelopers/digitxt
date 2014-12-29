(function () {
    var numDict,
        R;

    R = require('ramda');

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

    function sanitize(num) {
        var removeInvalid  = R.replace(/[^\d\.]/ig, ''),
            removeMultiDot = R.replace(/\.{2,}/g, '.'),
            removeLastDot  = R.replace(/\.$/, ''),
            removeLeadingZero = R.replace(/^0+([^0]+)/, '$1'),
            noLeadingDotChar  = R.replace(/^\.(.+)/, '0.$1'),
            removeMultiDecis  = R.replace(/(\d+(\.\d+)?).*$/, '$1'),
            result;

        result = R.pipe(
            removeInvalid,
            removeMultiDot,
            removeLastDot,
            removeLeadingZero,
            noLeadingDotChar,
            removeMultiDecis
        );

        return result(num);
    };

    function splitWholeNumbers(num) {
        var groupByThree = R.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            splitOnComma = R.split(','),
            result;

        result = R.pipe(groupByThree, splitOnComma);

        return result(num);
    }

    function splitNumber(num) {
        var splitOnDot = R.split('.'),
            splitter   = R.pipe(sanitize, splitOnDot),
            numSplit   = splitter(num);

        return {
            wholeNumbers : splitWholeNumbers(numSplit[0]),
            decimals     : numSplit[1]
        };
    }

    function convertTillHundreds(num) {
        // Not sure how to convert this to functional!!!!
        var _tys,
            _num     = parseInt(num, 10),
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
    }

    function convertDecimals(num) {
        var splitPerChar = R.split(''),
            decimals = splitPerChar(num),
            result;

        function getTextEquiv(n) {
            return numDict.onesteens[n];
        }

        result = R.map(getTextEquiv, decimals);

        return result.join(' ');
    }

    function digitxt(num) {
        var N, whole, decimal = '';

        function getWholeTextEquiv(v, k, list) {
            var index = list.length - k - 1,
                denom = (index !== 0) ? (' ' + numDict.huge[index]) : '';

            return convertTillHundreds(v) + denom;
        }

        N = splitNumber(num);
        whole = R.map.idx(getWholeTextEquiv, N.wholeNumbers);

        if (N.decimals) {
            decimal = ' point ' + convertDecimals(N.decimals);
        }

        return whole.join(' ') + decimal;
    }


    module.exports = digitxt;
}).call(this);