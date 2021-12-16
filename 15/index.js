
import * as fs from 'fs';

const cellKey = (cell) => cell.row + "-" + cell.col;
function cell (row, col) { return { row:row, col:col }; }

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
	const ROWS = grid.length,
		  COLS = grid[0].length;

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

		return dist[current.row][current.col] + grid[next.row][next.col];
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
			minCell = null;

		for (const kv of stack)
		{
			let c = kv[1];
			if (dist[c.row][c.col] < min)
			{
				min = dist[c.row][c.col];
				minCell = c;
			}
		}

		stack.delete (cellKey (minCell));
		return minCell;
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
		console.log (current);
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

let path = findPath (grid, cell (0, 0), cell (grid.length - 1, grid[0].length - 1));

let sum = -grid[0][0];
path.forEach (c => { sum += grid[c.row][c.col]; grid[c.row][c.col] = "*"; });

for (let j = 0; j < grid.length; j++)
	console.log (grid[j].join (""));

console.log (sum);

//console.log (findPath (grid, cell (0, 0)));
