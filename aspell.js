var spawn = require("child_process").spawn;
var EventEmitter = require("events").EventEmitter;

const ok = { type: "ok" };
const unknown = { type: "unknown" };
const runTogether = { type: "ok", "run-together": true };

function parseLine(line) {
	if(line.length <= 0) { return null; }

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

module.exports = function aspell(text) {
	var aspell = spawn("aspell", [ "-a", "--run-together" ]);
	var emitter = new EventEmitter();

	var buffer = "";
	aspell.stderr.on("data", function(chunk) {
		emitter.emit("error", chunk);
	});
	aspell.stdout.on("data", function(chunk) {
		var lines = (buffer + chunk).split(/\r?\n/);
		buffer = lines.pop();

		lines.forEach(function(line) {
			var result = parseLine(line);
			if(!result) { return; }

			emitter.emit("result", result);
		});
	});
	aspell.stdout.on("end", function() {
		emitter.emit("done");
	});
	aspell.stdin.end(text);

	return emitter;
};