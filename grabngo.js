#!/usr/bin/env node
var readline = require('readline');
const yargs = require('yargs');
var argv = yargs
    .usage('Usage: $0 <pattern> [options]')
    .command('pattern', 'Count the lines in a file')
    .demandCommand(1)
    .example('$0 (\d{3}-\d{3}-\d{4}) -d ,', 'Extract phone numbers and join with commas')
    .alias('d', 'delimiter')
    .nargs('d', 1)
    .describe('d', 'Delimiter for output')
    .alias('q', 'quoted')
    .nargs('q', 0)
    .describe('q', "Create a quoted list")
    .alias('s', 'sort')
    .nargs('s', 0)
    .describe('s', "Sort the results")
    .alias('u', 'unique')
    .nargs('u', 0)
    .describe('u', "Reduce results to a unique set")
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
    if (matches) {
      if (sort || unique) {
        results.push(matches[1]);
      } else {
        if (quoted) {
          process.stdout.write('"' + matches[1] + '", ');
        } else {
          process.stdout.write(matches[1] + delimiter);
        }
      }
    }
});

rl.on('end', end);
rl.on('close', end);
