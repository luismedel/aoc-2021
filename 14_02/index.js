
import * as fs from 'fs';

const pair = (pattern) => ({ pattern:pattern, prev:null, next:null });

const memoize = (pair, iter, count) => memo[pair + iter] = count;
const get = (pair, iter) => memo[pair + iter];

function countChars (pairs, patterns, iterations)
{
	function add (map, key, value) { map[key] = (map[key] || 0) + (value || 1); }
	
	let pairCount = {};
	for (let i = 0; i < pairs.length; i++)
		add (pairCount, pairs[i]);

	for (let iter = 0; iter < iterations; iter++)
	{
		let next = {};

		Object.entries (pairCount).forEach (p => {
			let pair = p[0],
				count = p[1];
			
			let c = patterns[pair],
				left = pair.charAt (0) + c,
				right = c + pair.charAt (1);

			add (next, left, count);
			add (next, right, count);
		});
		
		pairCount = next;
	}

	let charCounts  = {};
	add (charCounts, pairs[0].charAt (0));
	Object.keys (pairCount).forEach (k => {
		add (charCounts, k.charAt (1), pairCount[k]);
	});
	
	return charCounts;
}

let lines = fs.readFileSync ("input.txt", "utf8")
			  .split ("\n"),
	template = lines[0],
	patterns = lines.slice (2).map (pat => pat.split (" -> "))
							  .reduce ((map, pat) => { map[pat[0]] = pat[1]; return map; }, {});

let pairs = [];
for (let i = 0; i < template.length - 1; i++)
	pairs.push (template.charAt (i) + template.charAt (i + 1));

let charCounts = countChars (pairs, patterns, 40),
	counts = Object.entries (charCounts);

counts.sort ((a,b) => b[1]-a[1]);

console.log (counts);
console.log (counts[0][1] - counts[counts.length - 1][1]);
