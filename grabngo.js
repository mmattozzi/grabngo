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

rl.on('line', function(line) {
    var matches = line.match(pattern);
    if (matches) {
      if (quoted) {
        process.stdout.write('"' + matches[1] + '", ');
      } else {
        process.stdout.write(matches[1] + delimiter);
      }
    }
});
