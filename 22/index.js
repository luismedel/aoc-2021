
import * as fs from 'fs';

const rinput = /^(o..?) x\=(\-?\d+)\.\.(\-?\d+),y\=(\-?\d+)\.\.(\-?\d+),z\=(\-?\d+)\.\.(\-?\d+)$/

function parseOp (input)
{
	const m = rinput.exec (input);
	return [m[1], parseFloat (m[2]), parseFloat (m[3]),
									 parseFloat (m[4]), parseFloat (m[5]),
									 parseFloat (m[6]), parseFloat (m[7])];
}

let ops = fs.readFileSync ("input.txt", "utf8")
			.split ("\n")
			.map (parseOp);

function applyRule (space, rule)
{
	const activate = (rule[0] == "on");

	const startX = rule[1] < rule[2] ? rule[1] : rule[2],
		  endX   = rule[1] < rule[2] ? rule[2] : rule[1],
		  
		  startY = rule[3] < rule[4] ? rule[3] : rule[4],
		  endY   = rule[3] < rule[4] ? rule[4] : rule[3],
		  
		  startZ = rule[5] < rule[6] ? rule[5] : rule[6],
		  endZ   = rule[5] < rule[6] ? rule[6] : rule[5];

	for (let x = startX; x <= endX; x++)
	{
		if (x < -50 || x > 50)
			continue;
		
		for (let y = startY; y <= endY; y++)
		{
			if (y < -50 || y > 50)
				continue;

			for (let z = startZ; z <= endZ; z++)
			{
				if (z < -50 || z > 50)
					continue;

				const k = `${x},${y},${z}`;
				if (activate)
					space.set (k, 1);
				else
					space.delete (k);
			}
		}
	}
}

let space = new Map ();

for (let i = 0; i < ops.length; i++)
	applyRule (space, ops[i]);

let count = 0;
for (let v of space.values ())
	count += v;
	
console.log (count);