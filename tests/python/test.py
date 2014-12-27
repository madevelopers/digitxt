#!/usr/bin/env python3
import sys
sys.path.append('../../python')

import colorama
from colorama import Fore

import digitxt

colorama.init(autoreset=True)

with open('../test-data.txt') as test_data_file:
    for line in test_data_file:
        data = line.split('=')
        arg = data[0].strip()
        expect = data[1].strip()
        received = digitxt.digitxt(arg)

        if received == expect:
            result = 'passed'
            result_colored = '%s%s' % (Fore.GREEN, result)
        else:
            result = 'failed'
            result_colored = '%s%s' % (Fore.RED, result)

        print('%s: %s' % (arg, result_colored))
        if result == 'failed':
            print('expected: %s%s' % (Fore.YELLOW, expect))
            print('received: %s%s' % (Fore.CYAN, received))
