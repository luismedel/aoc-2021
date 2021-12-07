
import * as fs from 'fs';

class Crabs
{
	constructor (items)
	{
		this.min = Number.MAX_SAFE_INTEGER;
		this.max = Number.MIN_SAFE_INTEGER;
		
		for (let i = 0; i < items.length; i++)
		{
			let n = items[i];
			if (n < this.min) this.min = n;
			if (n > this.max) this.max = n;
		}

		this.items = items.slice (0);
	}
	
	getTotalDistanceTo (pos)
	{
		let result = 0;
		for (let i = 0; i < this.items.length; i++)
			result += Math.abs (this.items[i] - pos);
		
		return result;
	}
}

let text = fs.readFileSync ("input.txt", "utf8"),
	positions = text.split (",").map (n => parseInt (n, 10));

let crabs= new Crabs (positions);

let min = Number.MAX_SAFE_INTEGER;
for (let i = crabs.min; i < crabs.max + 1; i++)
{
	let tmp = crabs.getTotalDistanceTo (i);
	if (tmp < min)
		min = tmp;
}

console.log (min);
