
import * as fs from 'fs';

class MarkStack
{
	constructor (parent)
	{
		this.parent = parent;
		this.data = {};
	}

	count (key) { return (this.data[key] || 0) + (this.parent !== undefined ? this.parent.count (key) : 0); }
	
	add (key)
	{
		this.data[key] = (this.data[key] || 0) + 1;
		return this.count (key);
	}
}

function findNextStep (stack, results)
{
	let caveInfo = stack.pop (),
		path = caveInfo.path,
		cave = caveInfo.cave,
		marks = caveInfo.marks,
		revisitedCave = caveInfo.revisitedCave;

	if (cave.name == "end")
	{
		results.push (path);
		return true;
	}

	if (!cave.isBig)
	{
		let visits = marks.add (cave.name);

		if (visits > 1)
		{
			if (!cave.canRevisit || revisitedCave !== undefined)
				return false;

			revisitedCave = cave.name;
		}
	}

	for (let i = 0; i < cave.connections.length; i++)
	{
		let next = cave.connections[i];
		if (next.name == "start")
			continue;

		stack.push ({
			path:path + "," + next.name,
			cave:next,
			marks:new MarkStack (marks),
			revisitedCave: revisitedCave
		});
	}
}

function findPaths (graph)
{
	let stack = [{ path:"start", cave:graph["start"], marks:new MarkStack () }],
		visited = {},
		results = [];
	
	while (stack.length > 0)
		findNextStep (stack, results);
	
	return results;
}

function makeGraph (pairs)
{
	let result = {};
	
	for (let i = 0; i < pairs.length; i++)
	{
		let from = pairs[i][0],
			to = pairs[i][1];

		result[from] = result[from] || { name:from, canRevisit:from != "start" && from != "end", isBig:/^[A-Z]+$/.test (from), connections:[] };
		result[to] = result[to] || { name:to, canRevisit:to != "start" && to != "end", isBig:/^[A-Z]+$/.test (to), connections:[] };

		result[from].connections.push (result[to]);
		result[to].connections.push (result[from]);
	}
	
	return result;
}

let text = fs.readFileSync ("input.txt", "utf8"),
	pairs = text.split ("\n")
			    .map (line => line.split ("-"));

let graph = makeGraph (pairs),
	paths = findPaths (graph);

console.log (paths);
console.log (paths.length);
