const assert = require("assert");
const aspell = require("../aspell.js");

const tests = [
	{
		name: "Typo test",
		executable: "./typo-output.sh",
		expected: [
			{
				type: "comment",
				line: "@(#) International Ispell Version 3.1.20 (but really Aspell 0.60.8)"
			},
			{
				type: "misspelling",
				word: "misstake",
				position: 0,
				alternatives: [
					"mistake",   "misstate",
					"miss",      "take",
					"miss-take", "mistaken",
					"mistakes",  "misspoke",
					"misstep",   "mistake's",
					"mistook",   "stake"
				]
			}
		],
	},
	{
		name: "No typos test",
		executable: "./no-typos-output.sh",
		expected: [
			{
				type: "comment",
				line: "@(#) International Ispell Version 3.1.20 (but really Aspell 0.60.8)"
			},
			{ type: "ok" },
			{ type: "ok" },
			{ type: "ok" },
			{ type: "ok" },
			{ type: "line-break" },
			{ type: "ok" },
			{ type: "ok" },
			{ type: "line-break" }
		]
	},
	{
		name: "Run-together word test (ex: webdesign)",
		executable: "./run-together-output.sh",
		expected: [
			{
				type: "comment",
				line: "@(#) International Ispell Version 3.1.20 (but really Aspell 0.60.8)"
			},
			{ type: "ok", "run-together": true },
			{ type: "line-break" }
		]
	},
	{
		name: "Unknown symbols",
		executable: "./unknown-output.sh",
		expected: [
			{ type: "unknown" },
			{ type: "unknown" },
			{ type: "unknown" },
			{ type: "unknown" },
			{ type: "unknown" }
		]
	}
];

for(const test of tests) {
	const actual = [];

	aspell.executable = __dirname + "/" + test.executable;
	aspell("input text doesn't matter")
		.on("result", result => actual.push(result))
		.on("error", error => console.error(error))
		.on("end", () => {
			assert.deepEqual(actual, test.expected);
			console.log(`"${test.name}" passed ✅`);
		});
}
