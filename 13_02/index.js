
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

function print (points)
{
	let grid = [];
	
	function put (row, col)
	{
		if (grid[row] === undefined)
			grid[row] = [];
		grid[row][col] = "*";
		
		for (let i = 0; i < grid[row].length; i++)
		{
			if (grid[row][i] === undefined)
				grid[row][i] = " ";
		}
	}
	
	for (let i = 0; i < points.length; i++)
		put (points[i][1], points[i][0]);
	
	for (let j = 0; j < grid.length; j++)
	{
		if (grid[j] === undefined)
			console.log ("");
		else
			console.log (grid[j].join (""));
	}
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

for (let i = 0; i < folds.length; i++)
	points = fold (points, folds[i][0] == "x" ? 0 : 1, folds[i][1]);

print (points);