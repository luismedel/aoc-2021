
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

	var chars = line.split (""),
		next = chars[0],
		offset = 1;

	if (!isOpeningChar ())
		return read ();

	try
	{
		let root = parse (read ());
	}
	catch (ex)
	{
		if (ex.chr !== undefined)
			return ex.chr;
		else
			throw ex;
	}

	return "";

	function parse ()
	{
		if (isOpeningChar ())
		{
			let result = new Node (read ());

			while (isOpeningChar ())
				result.addChild (parse ());

			if (matchClosingChar (result.type))
				return result;
		}

		throw { offset:offset, chr:read () };
	}
	
	function matchClosingChar (opening)
	{
		if ((opening == "(" && next == ")")
		 || (opening == "[" && next == "]")
		 || (opening == "{" && next == "}")
		 || (opening == "<" && next == ">"))
		 {
			 read ();
			 return true;
		 }
		 
		 return false;
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
	")": 3,
	"]": 57,
	"}": 1197,
	">": 25137,
};

let text = fs.readFileSync ("input.txt", "utf8"),
	lines = text.split ("\n");

let sum = 0;

for (let i = 0; i < lines.length; i++)
{
	let chr = parseLine (lines[i]);
	sum += scores[chr] || 0;
}

console.log (sum);