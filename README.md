# grabngo
Convenient command line tool to repeatedly regex a value out of stdin and return it in a pleasant shape

```
Usage: grabngo <pattern> [options]

Commands:
  grabngo pattern  Extract pattern from stdin

Options:
  --version        Show version number                                 [boolean]
  -d, --delimiter  Delimiter for output
  -q, --quoted     Create a quoted list
  -h, --help       Show help                                           [boolean]

Examples:
  grabngo (\d{3}-\d{3}-\d{4}) -d ,  Extract phone numbers and join with commas

(C) Mike Mattozzi 2020
```

## Install
```
sudo npm install -g 
```
