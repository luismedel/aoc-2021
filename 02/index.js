
import * as fs from 'fs';

try
{
	let text = fs.readFileSync ("input.txt", "utf8"),
		commands = text.split ("\n").map (t => t.split (" ", 2));

	let x = 0,
		y = 0;

	commands.forEach (function (cmd) {
		
		let amount = parseInt (cmd[1], 10);
		
		switch (cmd[0])
		{
			case "forward": x += amount; break;
			case "up": y -= amount; break;
			case "down": y += amount; break;
			default: throw `Unsupported command ${cmd[0]}`;
		}
	});
	
	console.log(x * y);
}
catch (err)
{
	console.error (err);
}
