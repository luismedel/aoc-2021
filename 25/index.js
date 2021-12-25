
import * as fs from 'fs';

const clone = (grid) => grid.map (row => row.map (v => v));
const print = (grid) => console.log (grid.map (row => row.join ("")).join ("\n"));

function step (grid)
{
	const rows = grid.length,
		  cols = grid[0].length;

	let moves = 0;

	const loop = (src, cucumber) => {
		const result = clone (src);
		for (let j = 0; j < rows; j++)
		{
			const jnext = (cucumber == ">") ? j : ((j + 1) % rows);
			for (let i = 0; i < cols; i++)
			{
				const inext = (cucumber == ">") ? ((i + 1) % cols) : i;
				if (src[j][i] == cucumber && src[jnext][inext] == ".")
				{
					result[j][i] = ".";
					result[jnext][inext] = cucumber;
					moves++;
				}
			}
		}
		return result;
	};


	return [loop (loop (grid, ">"), "v"), moves];
}

let grid = fs.readFileSync ("input.txt", "utf8")
			 .split ("\n")
			 .map (line => line.split (""));

let steps = 0,
	moves;

do
{
	steps++;
	[grid, moves] = step (grid);
} while (moves > 0);

console.log (steps);
