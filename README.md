# node-aspell

A node.js module that parses [aspell](http://aspell.net/) output.  Aspell is a spell checker.

Currently works with node.js v0.10.1+ (and probably lower).

## Examples

```javascript
var aspell = require("aspell");

var emitter = aspell("spelll chek me"); // Returns event emitter

emitter
	.on("error", function(chunk) { /* ... contents of stderr sent here ... */ })
	.on("result", function(result) {
	/**
		`result` is an object that has a property called "type"

		When "type" equals:
			"ok" -- aspell has encountered a correctly spelled word.
			  Other optional properties:
				- "run-together" -- is true if aspell encounters a compound word
			"misspelling" -- aspell has encountered a misspelled word.
			  Other properties:
				- "word" -- the incorrectly spelled word.
				- "position" -- the character distance from the last line break
				- "alternatives" -- a list of possible corrections
			"comment" -- aspell has return comment.
			  Other properties:
				- "line" -- contains the full comment.
			"line-break" -- aspell has encountered a line break in the input text
			"unknown" -- aspell has return an unsupported control character
	*/
	})
	.on("end", function() { /* ... called when no more results are available ... */ })
;
```

## API

- `require("aspell").args` -- Contains a list of arguments that aspell is ran with.  By default the list is `[ "--run-together" ]`.

## Getting node-aspell

The easiest way to get node-aspell is with [npm](http://npmjs.org/):

    npm install aspell

Alternatively you can clone this git repository:

    git clone git://github.com/xavi-/node-aspell.git


## Developed by
* Xavi Ramirez

## License
This project is released under [The MIT License](http://www.opensource.org/licenses/mit-license.php).
