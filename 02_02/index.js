
import * as fs from 'fs';

let text = fs.readFileSync ("input.txt", "utf8"),
	commands = text.split ("\n").map (t => t.split (" ", 2));

let x = 0,
	y = 0,
	aim = 0;

commands.forEach (function (cmd) {
	let amount = parseInt (cmd[1], 10);
	
	switch (cmd[0])
	{
		case "forward": { x += amount; y += aim * amount; break };
		case "up": aim -= amount; break;
		case "down": aim += amount; break;
		default: throw `Unsupported command ${cmd[0]}`;
	}
});

console.log(x * y);
