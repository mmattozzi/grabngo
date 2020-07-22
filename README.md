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

## Examples

Imagine you have a source input such as:
```
$ cat /tmp/springfield.txt
Number	Name/Address
(800) 555-0000  	Moe Szyslak's "That's right. I'm a surgeon" Number
555-0001	C. Montgomery Burns
555-0078	Ruff-form Dog School
(636) 555-0113	C. Montgomery Burns
(939) 555-0113	742 Evergreen Terrace
555-1000	Sleep-Eazy Motel
555-1239	Moe's Tavern
555-1680  	Marital Street Hotline
555-2253	Someone in Springfield Phone Book
555-2362	Cathy Neu
555-2362	Susan Newhall
555-2600	3rd, 4th, 5th Floor For Lease
555-2668	New York Parking Violation Bureau
555-2849	Canine Therapy Institute
555-3226	Mr. Plow
```

### Parse out phone numbers, one per line
```
$ cat /tmp/springfield.txt | grabngo '((\(\d{3}\)\s)?\d{3}-\d{4})'
(800) 555-0000
555-0001
555-0078
(636) 555-0113
(939) 555-0113
555-1000
555-1239
555-1680
555-2253
555-2362
555-2362
555-2600
555-2668
555-2849
555-3226
```
Notes:
* Any non-matching line is ignored
* You can use as many parenthesis as you need, but only the first is extracted

### Parse out phone numbers, comma separated
```
$ cat /tmp/springfield.txt | grabngo '((\(\d{3}\)\s)?\d{3}-\d{4})' -d ,
(800) 555-0000,555-0001,555-0078,(636) 555-0113,(939) 555-0113,555-1000,555-1239,555-1680,555-2253,555-2362,555-2362,555-2600,555-2668,555-2849,555-3226,
```

### Parse out phone numbers, quoted list
```
$ cat /tmp/springfield.txt | grabngo '((\(\d{3}\)\s)?\d{3}-\d{4})' -q
"(800) 555-0000", "555-0001", "555-0078", "(636) 555-0113", "(939) 555-0113", "555-1000", "555-1239", "555-1680", "555-2253", "555-2362", "555-2362", "555-2600", "555-2668", "555-2849", "555-3226",
```
Helpful if you need to drop this into a JSON array or many programming languages
