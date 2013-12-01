var spawn = require("child_process").spawn;
var EventEmitter = require("events").EventEmitter;

const ok = { type: "ok" };
const unknown = { type: "unknown" };
const runTogether = { type: "ok", "run-together": true };
const lineBreak = { type: "line-break" };

function parseLine(line) {
	if(line.length <= 0) { return lineBreak; }

	var ctrl = line.charAt(0);

	if(ctrl == "@") { return { type: "comment", line: line }; }
	if(ctrl == "*") { return ok; }
	if(ctrl == "-") { return runTogether; }
	if(ctrl != "&" && ctrl != "#") { return unknown; }

	var parts = line.split(/:?,?\s/g);
	return {
		type: "misspelling",
		word: parts[1],
		position: (ctrl == "#" ? parts[2] : parts[3]) | 0,
		alternatives: parts.slice(4)
	};
}

function aspell(text) {
	var proc = spawn("aspell", [ "-a" ].concat(aspell.args || []));
	var emitter = new EventEmitter();

	var buffer = "";
	proc.stderr.on("data", function(chunk) {
		emitter.emit("error", chunk);
	});
	proc.stdout.on("data", function(chunk) {
		var lines = (buffer + chunk).split(/\r?\n/);
		buffer = lines.pop();

		lines.forEach(function(line) {
			var result = parseLine(line);
			if(!result) { return; }

			emitter.emit("result", result);
		});
	});
	proc.stdout.on("end", function() {
		emitter.emit("end");
	});
	proc.stdin.end(text);

	return emitter;
}
aspell.args = [ "--run-together" ];

module.exports = aspell;