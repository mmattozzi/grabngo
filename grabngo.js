#!/usr/bin/env node
var readline = require('readline');
const yargs = require('yargs');
var argv = yargs
    .usage('Usage: $0 <pattern> [options]')
    .command('pattern', 'Extract a pattern line by line and merge results')
    .demandCommand(1)
    .example('$0 (\d{3}-\d{3}-\d{4}) -d ,', 'Extract phone numbers and join with commas')
    .alias('d', 'delimit')
    .nargs('d', 1)
    .describe('d', 'Join the output with a specified delimiter')
    .alias('q', 'quote')
    .nargs('q', 0)
    .describe('q', "Join the output into a quoted list")
    .alias('s', 'sort')
    .nargs('s', 0)
    .describe('s', "Sort the results")
    .alias('u', 'unique')
    .nargs('u', 0)
    .describe('u', "Reduce results to a unique set")
    .alias('g', 'group')
    .nargs('g', 1)
    .describe('g', 'Group number to extract, default: 1')
    .help('h')
    .alias('h', 'help')
    .epilog('Copyright 2020')
    .argv;

var pattern = argv._;

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

var quoted = false;
var delimiter = "\n";
if (argv.q) {
  quoted = true;
} else if (argv.d) {
  
  if (typeof argv.d === "string") {
    delimiter = argv.d;
  } else {
    yargs.showHelp();
    process.exit(1);
  }
}

var sort = false;
if (argv.s) {
  sort = true;
}

var unique = false;
if (argv.u) {
  unique = true;
}

var group = 1;
if (argv.g) {
  group = parseInt(argv.g);
  if (isNaN(group)) {
    yargs.showHelp();
    process.exit(2);
  }
}

var results = [];

function uniq(a) {
   return Array.from(new Set(a));
}

function end() {
  if (sort || unique) {
    if (sort) {
      results.sort();
    }
    if (unique) {
      results = uniq(results);
    }
    results.forEach(function(m) {
      if (quoted) {
        process.stdout.write('"' + m + '", ');
      } else {
        process.stdout.write(m + delimiter);
      }
    });
  }
}

rl.on('line', function(line) {
    var matches = line.match(pattern);
    if (matches && matches[group]) {
      if (sort || unique) {
        results.push(matches[group]);
      } else {
        if (quoted) {
          process.stdout.write('"' + matches[group] + '", ');
        } else {
          process.stdout.write(matches[group] + delimiter);
        }
      }
    }
});

rl.on('end', end);
rl.on('close', end);
