
import * as fs from 'fs';

class Input
{
	constructor (patterns, output)
	{
		this.patterns = patterns.split (" ");
		this.output = output.split (" ");
	}
}

let text = fs.readFileSync ("input.txt", "utf8"),
	inputs = text.split ("\n")
				 .map (line => line.split ("|").map (s => s.trim ()))
				 .map (parts => new Input (parts[0], parts[1]));

let count = 0;
for (let i = 0; i < inputs.length; i++)
{
	let input = inputs[i];

	for (let j = 0; j < input.output.length; j++)
	{
		let len = input.output[j].length;
		if (len == 2 || len == 4 ||len == 3 || len == 7)
			count++;
	}
}

console.log (count);
