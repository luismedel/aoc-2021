
import * as fs from 'fs';

function pointKey (pt) { return pt[0] + "-" + pt[1]; }

function fold (points, axis, value)
{
	let map = {};

	// Non changing points
	for (let i = 0; i < points.length; i++)
	{
		let pt = points[i],
			n = [pt[0], pt[1]];
			
		if (pt[axis] > value)
			n[axis] = ((n[axis] - value) * -1) + value;

		map[pointKey (n)] = n;
	}

	return Object.values (map);
}


let lines = fs.readFileSync ("input.txt", "utf8")
			  .split ("\n"),
	points = [],
	folds  = [];

let i = 0,
	cont = true;

while (true)
{
	let line = lines[i++].trim ();
	if (line.length == 0)
		break;

	points.push (line.split (",").map (n => parseInt (n, 10)));
}

while (i < lines.length)
{
	let line = lines[i++].trim (),
		m = /^fold along (.)=(\d+)$/.exec (line);
	folds.push ([m[1], parseInt (m[2], 10)]);
}

console.log (points.length);
console.log (fold (points, folds[0][0] == "x" ? 0 : 1, folds[0][1]).length);
