#!/usr/bin/env python3


import collections
import re
import math


__version__ = '0.0.1'


NumDict = collections.namedtuple('NumDict', 'onesteens tys huge')
num_dict = NumDict(
    onesteens=(
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
    ),
    tys=(
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
    ),
    huge=(
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
    )
)


def sanitize(num):
    num = re.sub(r'[^\d\.]', r'', num)
    num = re.sub(r'\.{2,}', r'.', num)
    num = re.sub(r'\.$', r'', num)
    num = re.sub(r'^0+([^0]+)', r'\1', num)
    num = re.sub(r'^\.(.+)', r'0.\1', num)
    num = re.sub(r'(\d+(\.\d+)?).*$', r'\1', num)

    return num


def split_whole_numbers(num):
    return re.sub(r'\B(?=(\d{3})+(?!\d))', ',', num).split(',')


def split_number(num):
    num_split = sanitize(num).split('.')
    NumSplit = collections.namedtuple('NumSplit', 'whole_numbers decimals')

    return NumSplit(
        whole_numbers=split_whole_numbers(num_split[0]),
        decimals=num_split[1] if len(num_split) > 1 else None
    )


def convert_till_hundreds(num):
    _num = int(num)
    _tens = math.floor(((_num % 100) / 10)) if _num > 9 else 0
    _ones = math.floor(_num % 10)
    hundreds = math.floor(_num / 100)
    tens = (_tens * 10 + _ones) if _tens == 1 else _tens
    ones = 0 if tens > 9 else _ones
    output = []

    if hundreds > 0:
        output.append(num_dict.onesteens[hundreds] + ' hundred')

    if _tens == 0:
        if not (hundreds > 0 and ones == 0):
            output.append(num_dict.onesteens[ones])
    elif _tens == 1:
        output.append(num_dict.onesteens[tens])
    elif _tens > 1:
        _tys = num_dict.tys[_tens]
        _tys += ' ' + num_dict.onesteens[_ones] if _ones > 0 else ''
        output.append(_tys)

    return ' '.join(output)


def convert_decimals(num):
    result = []

    for deci in list(num):
        result.append(num_dict.onesteens[int(deci)])

    return ' '.join(result)


def digitxt(num):
    decimal = ''
    whole = []

    num = split_number(num)

    for (key, val) in enumerate(num.whole_numbers):
        index = len(num.whole_numbers) - key - 1
        denomination = ' ' + num_dict.huge[index] if index != 0 else ''
        whole.append(convert_till_hundreds(val) + denomination)

    if num.decimals:
        decimal = ' point ' + convert_decimals(num.decimals)

    return ' '.join(whole) + decimal
