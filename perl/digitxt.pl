#!/usr/bin/env perl
#
# digitxt.pl
# ==========
#
# Digitxt implementation in Perl
#

use strict;
use warnings;

use POSIX qw/floor/;


my %num_dict = (
    'onesteens' => [
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
        'nineteen',
    ],
    'tys' => [
        '',
        '',
        'twenty',
        'thirty',
        'forty',
        'fifty',
        'sixty',
        'seventy',
        'eighty',
        'ninety',
    ],
    'huge' => [
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
        'centillion',
    ]
);


sub sanitize {
    my $num = shift @_;
    $num =~ s/[^\d\.]//g;
    $num =~ s/\.{2,}/\./g;
    $num =~ s/\.$//g;
    $num =~ s/^0+([^0]+)/$1/g;
    $num =~ s/^\.(.+)/0\.$1/g;
    $num =~ s/(\d+(\.\d+)?).*$/$1/g;

    return $num;
}
# print sanitize("abc001234.90..345...") . "\n";


sub split_whole_numbers {
    my $num = shift @_;
    $num =~ s/\B(?=(\d{3})+(?!\d))/,/g;
    my @num_split = split /,/, $num;

    return @num_split;
}
# print join(", ", split_whole_numbers "1234567890") . "\n";


sub split_number {
    my $num           = shift @_;
    my @nsplit        = split(/\./, sanitize($num));
    my @whole_numbers = split_whole_numbers($nsplit[0]);
    my $decimals      = scalar(@nsplit) > 1 ? $nsplit[1] : undef;
    # UNSAON MAN NI??????
    my %num_split = (
        'whole_numbers' => \@whole_numbers,
        'decimals' => \$decimals,
    );

    return %num_split;
}
# my %result = split_number('123456.78');
# print "> @{ $result{'whole_numbers'} }\n";
# print "> ${ $result{'decimals'} }\n";


sub convert_till_hundreds {
    my $_num     = shift @_;
    my $_tens    = ($_num > 9) ? floor(($_num % 100) / 10) : 0;
    my $_ones    = floor($_num % 10);
    my $hundreds = floor($_num / 100);
    my $tens     = ($_tens == 1) ? $_tens * 10 + $_ones : $_tens;
    my $ones     = ($tens > 9) ? 0 : $_ones;
    my @output   = ();

    if ($hundreds > 0) {
        push @output, "$num_dict{'onesteens'}[$hundreds] hundred";
    }

    if ($_tens == 0) {
        unless ($hundreds > 0 && $ones == 0) {
            push @output, $num_dict{'onesteens'}[$ones];
        }
    } elsif ($_tens == 1) {
        push @output, $num_dict{'onesteens'}[$tens];
    } elsif ($_tens > 1) {
        my $_tys = $num_dict{'tys'}[$_tens];
        $_tys .= ($_ones > 0) ? ' ' . $num_dict{'onesteens'}[$_ones] : '';
        push @output, $_tys;
    }

    return join(' ', @output);
}
# print convert_till_hundreds '786';


sub convert_decimals {
    my $num    = shift @_;
    my @result = ();

    for my $deci (split //, $num) {
        push @result, $num_dict{'onesteens'}[$deci];
    }

    return join ' ', @result;
}
# print convert_decimals('2054');


sub digitxt {
    my $num     = shift @_;
    my $decimal = '';
    my @whole   = ();

    my @result = split_number($num);
    print "@{ $result{'whole_numbers'} }";

    foreach my $k (0 .. $#whole_numbers) {
        print "$k";
    }

    return join(' ', @whole) . $decimal;
}
digitxt('12345.67');
