#!/usr/bin/env perl

use strict;
use warnings;

binmode STDOUT, ":utf8";
use utf8;

require Digitxt::digitxt;


my $file = "../test-data.txt";
my $fh = undef;
my $result = open $fh, "<", $file;

if (!$result) {
    die "Couldn't open '" . $file . "' for reading because: " . $!;    
}

my $has_fail = 0;

while(my $line = <$fh>) {
	chomp $line;
	if (! do_test(parse_test_data($line))) {
	    $has_fail = 1;
	}
}

if (! $has_fail) {
    print "All test passed\n";
}

sub parse_test_data {
    my $line = shift @_;
    my @data = split /=/, $line;
    my @retval = (
        trim($data[0]),
        trim($data[1])
    );
    
    return @retval;
}

sub do_test {
    my $arg      = shift @_;
    my $expect   = shift @_;
    my $received = digitxt($arg);
    
    if ($received ne $expect) {
        print "FAILED\n";
        print " expected: $expect\n";
        print " received: $received\n";
        
        return 0;
    } else {
        return 1;
    }
}

sub trim {
    my $str = shift @_;
    $str =~ s/(^\s+|\s+$)//g;
    
    return $str;
}