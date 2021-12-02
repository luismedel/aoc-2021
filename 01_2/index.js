
import * as fs from 'fs';

try
{
	let text = fs.readFileSync ("input.txt", "utf8"),
		items = text.split ("\n").map (t => parseInt (t, 10));

	let prev = null,
		count = 0;

	for (let i = 0; i < items.length - 2; i++)
	{
		var w = items[i] + items[i + 1] + items[i + 2];
		if (prev != null && w > prev)
			count++;
		prev = w;
	}

	console.log(count);
}
catch (err)
{
	console.error (err);
}
