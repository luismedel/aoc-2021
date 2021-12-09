
import * as fs from 'fs';

class Grid
{
	constructor (input)
	{
		this.data = input.split ("\n")
						.map (line => line.split ("").map (n => parseInt (n, 10))),
		this.width = this.data[0].length;
		this.height = this.data.length;
	}
	
	getCell (row, col)
	{
		return (row < 0 || col < 0 || row >= this.width || col >= this.height) ? Number.MAX_SAFE_INTEGER
			: this.data[row][col];
		
	}

	expandBasin (row, col, ignore)
	{
		if (ignore[`${row}-${col}`])
			return 0;
		ignore[`${row}-${col}`] = true;
		
		if (this.getCell (row, col) > 8)
			return 0;

		let result = 1,
			stack = [[row - 1, col],
					 [row + 1, col],
					 [row, col - 1],
					 [row, col + 1]];

		while (stack.length > 0)
		{
			let pos = stack.pop (),
				r = pos[0], c = pos[1];

			if (ignore[`${r}-${c}`])
				continue;
			ignore[`${r}-${c}`] = true;

			if (this.getCell (r, c) > 8)
				continue;

			result++;

			stack.push ([r - 1, c]);
			stack.push ([r + 1, c]);
			stack.push ([r, c - 1]);
			stack.push ([r, c + 1]);
		}

		return result;
	}
}

let text = fs.readFileSync ("input.txt", "utf8"),
	grid = new Grid (text);

let basins = [],
	ignore = {};

for (let j = 0; j < grid.height; j++)
{
	for (let i = 0; i < grid.width; i++)
	{
		let size = grid.expandBasin (j, i, ignore);
		if (size == 0)
			continue;
		
		basins.push (size);
	}
}

basins.sort ((a, b) => b - a);

console.log (basins[0] * basins[1] * basins[2]);