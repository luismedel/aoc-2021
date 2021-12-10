
import * as fs from 'fs';

class Node
{
	constructor (type)
	{
		this.type = type;
		this.children = null;
	}
	
	addChild (child)
	{
		if (this.children == null)
			this.children = [];
		
		this.children.push (child);
	}

	get childCount () { return this.children == null ? 0 : this.children.length; }
}

function parseLine (line)
{
	const closingChars = { "(": ")", "{": "}", "[": "]", "<": ">" };

	let chars = line.split (""),
		offset = 1,
		next = chars[0];

	let resultChars = [];

	try
	{
		let root = new Node ("");
		while (!isEOL ())
			root.addChild (parse ());
	}
	catch (ex)
	{
		// Ignore syntax errors
		if (ex.chr !== undefined)
			return { type:"syntaxError", offendingChar:ex.chr, offset:ex.offset };
		else
			throw ex;
	}

	return { type:"incomplete", missingChars:resultChars };
	
	function parse ()
	{
		if (isOpeningChar ())
		{
			let result = new Node (read ());
			while (isOpeningChar ())
				result.addChild (parse ());

			if (matchClosingChar (result.type))
				return result;
			
			if (isEOL ())
			{
				let chr = closingChars[result.type];
				resultChars.push (chr);
				return result;
			}
		}
		
		throw { offset:offset, chr:read () };
	}
	
	function matchClosingChar (opening)
	{
		if (next != closingChars[opening])
			return false;

		read ();
		return true;
	}
	
	function isOpeningChar () { return closingChars[next] !== undefined; }
	function isClosingChar () { return next == ")" || next == "]" || next == "}" || next == ">"; }	
	function isEOL () { return next == "\0"; }
	
	function read ()
	{
		let result = next;
		next = offset < chars.length ? chars[offset++] : "\0";
		return result;
	}
}

const scores = {
	")": 1,
	"]": 2,
	"}": 3,
	">": 4,
};

let text = fs.readFileSync ("input.txt", "utf8"),
	lines = text.split ("\n");

let linesScores = [];

for (let i = 0; i < lines.length; i++)
{
	let res = parseLine (lines[i]);
	if (res.type == "syntaxError")
		continue;
	else
	{
		let sum = 0;
		for (let j = 0; j < res.missingChars.length; j++)
		{
			sum *= 5;
			sum += scores[res.missingChars[j]];
		}
		
		linesScores.push (sum);
	}
}

linesScores.sort ((a,b) => a-b);
console.log (linesScores[(linesScores.length/2 | 0)]);
