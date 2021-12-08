
import * as fs from 'fs';

// Returns the bit map corresponding with the segments identifiers used in a number pattern
function getBitmap (pattern)
{
	const positions = "abcdefg".split ("");
	return pattern.split ("").reduce ((result, letter) => result + (1 << positions.indexOf (letter)), 0);
}

class Input
{
	constructor (patterns, output)
	{
		this.patterns = patterns.split (" ").map (getBitmap);
		this.output = output.split (" ").map (getBitmap);
	}
}

function permute (items)
{
	function permuteInternal (array, temp, result)
	{
		if (array.length == 0)
			result.push (temp);

		for (let i = 0; i < array.length; i++)
		{
			let curr = array.slice (),
				next = curr.splice (i, 1);

			permuteInternal (curr.slice (), temp.concat (next), result);
		}
	};
	
	let result = [];
	permuteInternal (items, [], result);

	return result;
}

// Generate all 7! segment permutations
let permutations = permute ("abcdefg".split (""));


// Generate the letter patterns from the previos permutations
// The default pattern would be "abcdefg".
//
//   0:      1:      2:      3:      4:
//  aaaa    ....    aaaa    aaaa    ....
// b    c  .    c  .    c  .    c  b    c
// b    c  .    c  .    c  .    c  b    c
//  ....    ....    dddd    dddd    dddd
// e    f  .    f  e    .  .    f  .    f
// e    f  .    f  e    .  .    f  .    f
//  gggg    ....    gggg    gggg    ....
// 
//   5:      6:      7:      8:      9:
//  aaaa    aaaa    aaaa    aaaa    aaaa
// b    .  b    .  .    c  b    c  b    c
// b    .  b    .  .    c  b    c  b    c
//  dddd    dddd    ....    dddd    dddd
// .    f  e    f  .    f  e    f  .    f
// .    f  e    f  .    f  e    f  .    f
//  gggg    gggg    ....    gggg    gggg
//
let patterns = permutations.map ((segments) => {
	return [
		[0, 1, 2, 4, 5, 6].map (n => segments[n]).join (""),	// number 0
		[2, 5].map (n => segments[n]).join (""),				// number 1
		[0, 2, 3, 4, 6].map (n => segments[n]).join (""),		// number 2
		[0, 2, 3, 5, 6].map (n => segments[n]).join (""),		// number 3
		[1, 2, 3, 5].map (n => segments[n]).join (""),			// number 4
		[0, 1, 3, 5, 6].map (n => segments[n]).join (""),		// number 5
		[0, 1, 3, 4, 5, 6].map (n => segments[n]).join (""),	// number 6
		[0, 2, 5].map (n => segments[n]).join (""),				// number 7
		[0, 1, 2, 3, 4, 5, 6].map (n => segments[n]).join (""),	// number 8
		[0, 1, 2, 3, 5, 6].map (n => segments[n]).join ("")		// number 9
	];
});

let bitmaps = patterns.map ((pat) => pat.map (p => getBitmap (p)));

// We're ready. Let's dance...
let text = fs.readFileSync ("input.txt", "utf8"),
	inputs = text.split ("\n")
				 .map (line => line.split ("|").map (s => s.trim ()))
				 .map (parts => new Input (parts[0], parts[1]));

let sum = 0;

// For each input, find the permutation wich matches with its patterns
// then, decode the number and add to the result
for (let i = 0; i < inputs.length; i++)
{
	let inp = inputs[i],
		pats = inputs[i].patterns;
	
	let patternIndex = -1;
	
	for (let j = 0; j < bitmaps.length; j++)
	{
		let bitmap = bitmaps[j];

		patternIndex = j;
		
		for (let k = 0; k < pats.length; k++)
		{
			if (bitmap.indexOf (pats[k]) == -1)
			{
				patternIndex = -1;
				break;
			}
		}
		
		if (patternIndex != -1)
			break;
	}

	// test
	if (patternIndex == -1)
		throw `Error at index ${i}`;

	let pat = bitmaps[patternIndex];
	
	sum += (pat.indexOf (inp.output[0]) * 1000)
			+ (pat.indexOf (inp.output[1]) * 100)
			+ (pat.indexOf (inp.output[2]) * 10)
			+ pat.indexOf (inp.output[3]);
}

console.log (sum);
