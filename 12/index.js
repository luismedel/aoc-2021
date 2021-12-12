
import * as fs from 'fs';

class MarkStack
{
	constructor (parent)
	{
		this.parent = parent;
		this.data = {};
	}
	
	contains (key)
	{
		if (this.data[key] !== undefined)
			return true;
		
		return this.parent !== undefined ? this.parent.contains (key) : false;
	}
	
	add (key) { this.data[key] = true; }
}

function findNextStep (key, stack, results)
{
	let caveInfo = stack.pop (),
		path = caveInfo.path,
		marks = caveInfo.marks,
		cave = caveInfo.cave;

	if (!cave.isBig && marks.contains (cave.name))
		return false;

	if (cave.name == "end")
	{
		results.push (path);
		return true;
	}

	marks.add (cave.name);

	for (let i = 0; i < cave.connections.length; i++)
	{
		let next = cave.connections[i];
		stack.push ({
			path:path + "-" + next.name,
			cave:next,
			marks:new MarkStack (marks)
		});
	}
}

function findPaths (graph)
{
	let stack = [{ path:"start", cave:graph["start"], marks:new MarkStack () }],
		visited = {},
		results = [];
	
	while (stack.length > 0)
		findNextStep ("start", stack, results);
	
	return results;
}

function makeGraph (pairs)
{
	let result = {};
	
	for (let i = 0; i < pairs.length; i++)
	{
		let from = pairs[i][0],
			to = pairs[i][1];

		result[from] = result[from] || { name:from, isBig:/^[A-Z]+$/.test (from), connections:[] };
		result[to] = result[to] || { name:to, isBig:/^[A-Z]+$/.test (to), connections:[] };

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

console.log (paths.length);
