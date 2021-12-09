
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
}

let text = fs.readFileSync ("input.txt", "utf8"),
	grid = new Grid (text);

let sum = 0;

for (let j = 0; j < grid.height; j++)
{
	for (let i = 0; i < grid.width; i++)
	{
		let n = grid.getCell (j, i);
		
		if ((n < grid.getCell (j - 1, i)) && (n < grid.getCell (j + 1, i))
			&& (n < grid.getCell (j, i - 1)) && (n < grid.getCell (j, i + 1)))
			sum += n + 1;
	}
}

console.log (sum);
