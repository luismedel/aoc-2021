
import * as fs from 'fs';

let text = fs.readFileSync ("input.txt", "utf8"),
	values = text.split ("\n").map (s => s.replace ("\r", ""));

let gamma = 0,
	epsilon = 0;

let length = values[0].length,
	powerPos = length - 1;

for (let i = 0; i < length; i++)
{
	let count = 0;
	
	values.forEach (function (v) {
		if (v[length - powerPos - 1] == "1")
			count++;
	});
	
	if (count > values.length / 2)
		gamma += 1 << powerPos;
	else
		epsilon += 1 << powerPos;
	
	powerPos--;
}

console.log(gamma * epsilon);
