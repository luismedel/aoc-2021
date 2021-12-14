
import * as fs from 'fs';

const pair = (pattern) => ({ text:pattern, prev:null, next:null });

function expand (list, patterns)
{
	let result = [],
		n = list.next;

	while (n != null)
	{
		let t = n.text,
			subst = patterns[t];

		if (subst !== undefined)
		{
			// Replace with two new nodes
			let left = pair (t.charAt(0) + subst),
				right = pair (subst + t.charAt(1));
			
			left.prev = n.prev;
			left.next = right;
			right.prev = left;
			right.next = n.next;
			n.prev.next = left;
			if (n.next)
				n.next.prev = right;
		}
		
		n = n.next;
	}

	return result.join ("");
}

// NNCBAB would be: N(head), NN, NC, CB, BA, AB
// To reconstruct the pattern we use the head and the second char of each pair.
function makeList (pattern)
{
	let result = pair (pattern.charAt (0)),
		n = result;
	for (let i = 0; i < pattern.length - 1; i++)
	{
		let t = pattern.charAt (i) + pattern.charAt (i + 1),
			next = pair (t);
			
		next.prev = n;
		n.next = next;
		n = n.next;
	}
	
	return result;
}

function countChars (list)
{
	let result = {};
	
	function add (c) { result[c] = (result[c] || 0) + 1; }
	
	add (list.text.charAt (0));
	
	let n = list.next;
	while (n != null)
	{
		add (n.text.charAt (1));
		n = n.next;
	}
	
	return result;
}

let lines = fs.readFileSync ("input.txt", "utf8")
			  .split ("\n"),
	template = lines[0],
	patterns = lines.slice (2).map (pat => pat.split (" -> "))
							  .reduce ((map, parts) => { map[parts[0]] = parts[1]; return map; }, {});

let list = makeList (template);
for (let i = 0; i < 10; i++)
	expand (list, patterns);

let counts = Object.entries (countChars (list));
counts.sort ((a,b) => b[1] - a[1]);

console.log (counts);
console.log (counts[0][1] - counts[counts.length - 1][1]);
