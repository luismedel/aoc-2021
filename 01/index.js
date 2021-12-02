
import * as fs from 'fs';

try
{
	let text = fs.readFileSync ("input.txt", "utf8");

	var prev = null,
		count = 0;

	text.split ("\n").forEach (function (t) {
		var n = parseInt (t, 10);
		if (prev != null && n > prev)
			count++;
		prev = n;
	});

	console.log(count);
}
catch (err)
{
	console.error (err);
}
