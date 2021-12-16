
import * as fs from 'fs';

const TILES = 5;

const cellKey = (cell) => cell.row + "-" + cell.col;
function cell (row, col) { return { row:row, col:col }; }

function getCellValue (grid, cell)
{
	const ROWS = grid.length,
		  COLS = grid[0].length;

	const increment = ((cell.row / ROWS) | 0)
				    + ((cell.col / COLS) | 0);

	const result = grid[cell.row % ROWS][cell.col % COLS] + increment;
	
	return result < 10 ? result : (result-9);
}

function makeGrid (rows, cols, val) 
{
	let result = Array (rows);
	for (let j = 0; j < rows; j++)
	{
		let row = result[j] = Array (cols);
		for (let i = 0; i < cols; i++)
			row[i] = val instanceof Function? val () : val;
	}

	return result;
}

function findPath (grid, source, target)
{
	const ROWS = grid.length * TILES,
		  COLS = grid[0].length * TILES;

	let visited = makeGrid (ROWS, COLS, false),
		dist = makeGrid (ROWS, COLS, Number.MAX_SAFE_INTEGER),
		prev = makeGrid (ROWS, COLS, null);

	let stack = new Map ();

	function getDist (current, next)
	{
		if (next.row < 0 || next.row >= ROWS
		||  next.col < 0 || next.col >= COLS
		||  visited[next.row][next.col])
			return Number.MAX_SAFE_INTEGER;

		return dist[current.row][current.col] + getCellValue (grid, next);
	}

	function updateNeighbor (current, next)
	{
		let d = getDist (current, next);
		if (d < Number.MAX_SAFE_INTEGER && d < dist[next.row][next.col])
		{
			dist[next.row][next.col] = d;
			prev[next.row][next.col] = current;
		}
	}

	function nearestInStack ()
	{
		let min = Number.MAX_SAFE_INTEGER,
			minKV;

		for (const kv of stack)
		{
			const k = kv[0],
				  c = kv[1];

			if (dist[c.row][c.col] < min)
			{
				min = dist[c.row][c.col];
				minKV = kv;
			}
		}

		stack.delete (minKV[0]);
		return minKV[1];
	}
	
	function pushNeighbors (current)
	{
		let cells = [];

		if (current.col > 0 && !visited[current.row][current.col - 1])
			cells.push (cell (current.row, current.col - 1));

		if (current.col < COLS - 1 && !visited[current.row][current.col + 1])
			cells.push (cell (current.row, current.col + 1));

		if (current.row > 0 && !visited[current.row - 1][current.col])
			cells.push (cell (current.row - 1, current.col));

		if (current.row < ROWS - 1 && !visited[current.row + 1][current.col])
			cells.push (cell (current.row + 1, current.col));

		for (let i = 0; i < cells.length; i++)
		{
			let c = cells[i],
				k = cellKey (c);
				
			if (stack.has (k))
				continue;
			
			updateNeighbor (current, c);
			stack.set (k, c);
		}
	}

	dist[source.row][source.col] = 0;
	stack.set (cellKey (source), source);

	while (stack.size > 0)
	{
		let current = nearestInStack ();
		visited[current.row][current.col] = true;

		if (current.row == target.row && current.col == target.col)
		{
			let path = [],
				c = current;

			while (c != null)
			{
				path.push (c);
				c = prev[c.row][c.col];
			}
			
			return path;
		}

		pushNeighbors (current);
	}
	
	throw "error";
}
	
let grid = fs.readFileSync ("input.txt", "utf8")
		     .split ("\n").map (line => line.split ("")
										    .map (n => parseInt (n, 10)));

let grid2 = [];
for (let j = 0; j < 50; j++)
{
	let row = [];
	for (let i = 0; i < 50; i++)
		row.push (getCellValue (grid, cell (j, i)));
	grid2.push (row);
}

let path = findPath (grid, cell (0, 0), cell ((grid.length * TILES) - 1, (grid[0].length * TILES) - 1));

let sum = -grid[0][0];
path.forEach (c => sum += getCellValue (grid, c));

console.log (sum);
