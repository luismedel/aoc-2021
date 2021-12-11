
import * as fs from 'fs';

const W = 10,
	  H = 10;

function increment (grid, row, col)
{
	if (row < 0 || col < 0 || row >= H || col >= W) return -1;
	return ++grid[row][col];
}

function step (grid)
{
	let stack = [],
		flashed = {};
		
	for (let j = 0; j < H; j++)
	{
		let row = grid[j];

		for (let i = 0; i < W; i++)
		{
			if (++row[i] > 9)
				stack.push ([j, i]);
		}
	}
	
	while (stack.length > 0)
	{
		let pos = stack.pop (),
			j = pos[0], i = pos[1],
			cell = grid[j][i];
		
		if (flashed[j + "-" + i] !== undefined)
			continue;
		flashed[j + "-" + i] = pos;

		if (increment (grid, j - 1, i - 1) > 9)	stack.push ([j - 1, i - 1])
		if (increment (grid, j - 1, i) > 9) 		stack.push ([j - 1, i])
		if (increment (grid, j - 1, i + 1) > 9)	stack.push ([j - 1, i + 1])
		if (increment (grid, j, i - 1) > 9)		stack.push ([j, i - 1])
		if (increment (grid, j, i + 1) > 9)		stack.push ([j, i + 1])
		if (increment (grid, j + 1, i - 1) > 9)	stack.push ([j + 1, i - 1])
		if (increment (grid, j + 1, i) > 9)		stack.push ([j + 1, i])
		if (increment (grid, j + 1, i + 1) > 9)	stack.push ([j + 1, i + 1])
	}

	let flashCount = 0;

	for (let k in flashed)
	{
		let pos = flashed[k],
			j = pos[0], i = pos[1],
			cell = grid[j][i];
		
		grid[j][i] = 0;
		flashCount++;
	}

	return flashCount;
}

function print (grid)
{
	console.log (grid.map (row => row.join ("")).join ("\n"));
}

let text = fs.readFileSync ("input.txt", "utf8");

let grid = text.split ("\n")
			   .map (line => line.split ("")
								 .map (n => parseInt (n, 10)));

let i = 0;
while (true)
{
	i++;
	
	if (step (grid) == W*H)
	{
		console.log (i);
		break;
	}
}
