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
    .alias('l', 'newline')
    .nargs('l', 0)
    .describe('l', 'End output with a newline')
    .help('h')
    .alias('h', 'help')
    .nargs('prefix', 1)
    .describe('prefix', 'Prefix in front of extracted value')
    .nargs('suffix', 1)
    .describe('suffix', 'Suffix after the extracted value')
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

var prefix = '';
if (argv.prefix) {
  prefix = argv.prefix;
}
var suffix = '';
if (argv.suffix) {
  suffix = argv.suffix;
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

var printedOneMatch = false;

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
        if (printedOneMatch) {
          process.stdout.write(", ");
        }
        process.stdout.write('"' + prefix + m + suffix + '"');
      } else {
        if (printedOneMatch) {
          process.stdout.write(delimiter)
        }
        process.stdout.write(prefix + m + suffix);
      }
      printedOneMatch = true;
    });
  }
  
  if (argv.l) {
    process.stdout.write("\n");
  }
}

rl.on('line', function(line) {
    var matches = line.match(pattern);
    if (matches && matches[group]) {
      if (sort || unique) {
        results.push(matches[group]);
      } else {
        if (quoted) {
          if (printedOneMatch) {
            process.stdout.write(", ");
          }
          process.stdout.write('"' + prefix + matches[group] + suffix + '"');
        } else {
          if (printedOneMatch) {
            process.stdout.write(delimiter);
          }
          process.stdout.write(prefix + matches[group] + suffix);          
        }
        printedOneMatch = true;
      }
    }
});

rl.on('end', end);
rl.on('close', end);
