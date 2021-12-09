
import * as fs from 'fs';

class Grid
{
	constructor (width, height)
	{
		this.width = width;
		this.height = height;
		this.data = new Array (width * height).fill (0);
	}
}

function drawVLine (grid, x, y1, y2)
{
	let start = y1 < y2 ? y1 : y2,
		end = y1 < y2 ? y2 : y1;
	
	for (let i = start; i < end+1; i++)
		grid.data[grid.width*i + x]++;
}

function drawHLine (grid, y, x1, x2)
{
	let start = x1 < x2 ? x1 : x2,
		end = x1 < x2 ? x2 : x1;
	
	for (let i = start; i < end+1; i++)
		grid.data[grid.width*y + i]++;
}

function drawLine (grid, x1, y1, x2, y2)
{
	let steps = Math.abs (x2 - x1) + 1;
	
	let x = x1,
		deltaX = x1 < x2 ? 1 : -1;

	let y = y1,
		deltaY = y1 < y2 ? 1 : -1;
	
	for (let i = 0; i < steps; i++)
	{
		grid.data[grid.width*y + x]++;
		x += deltaX;
		y += deltaY;
	}
}

function parseLine (text)
{
	return text.split (" -> ")
	           .map (part => part.split (",")
			                     .map (n => parseInt (n, 10)));
}

let text = fs.readFileSync ("input.txt", "utf8"),
	lines = text.split ("\n").map (line => parseLine (line));

let w = 0, h = 0;

for (let i = 0; i < lines.length; i++)
{
	var line = lines[i];
	
	if (line[0][0] > w)
		w = line[0][0];

	if (line[0][1] > h)
		h = line[0][1];

	if (line[1][0] > w)
		w = line[1][0];

	if (line[1][1] > h)
		h = line[1][1];
}

let grid = new Grid (w + 1, h + 1);

for (let i = 0; i < lines.length; i++)
{
	let line = lines[i],
		p1 = line[0],
		p2 = line[1];

	if (p1[0] == p2[0])
		drawVLine (grid, p1[0], p1[1], p2[1]);
	else if (p1[1] == p2[1])
		drawHLine (grid, p1[1], p1[0], p2[0]);
	else
		drawLine (grid, p1[0], p1[1], p2[0], p2[1]);
}

let count = grid.data.reduce ((a,b) => a += (b > 1 ? 1 : 0), 0);
console.log (`Count: ${count}`);
