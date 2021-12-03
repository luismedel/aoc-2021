
import * as fs from 'fs';

function getBitCount (values, pos)
{
	let result = 0;
	
	for (let i = 0; i < values.length; i++)
	{
		if (values[i][pos] == "1")
			result++;
	}
	
	return result;
}

function filterO2Values (values)
{
	let length = values[0].length,
		powerPos = length - 1,
		result = 0;

	for (let i = 0; i < length; i++)
	{
		if (values.length == 1)
			return parseInt (values[0], 2);
		
		let bit = getBitCount (values, i) >= values.length/2 ? "1" : "0";
		if (bit == "1")
			result += 1 << powerPos;
		powerPos--;

		values = values.filter (v => v[i] == bit);
	}
	
	return result;
}

function filterCO2Values (values)
{
	let length = values[0].length,
		powerPos = length - 1,
		result = 0;

	for (let i = 0; i < length; i++)
	{
		if (values.length == 1)
			return parseInt (values[0], 2);
		
		let bit = getBitCount (values, i) < values.length/2 ? "1" : "0";
		if (bit == "1")
			result += 1 << powerPos;
		powerPos--;

		values = values.filter (v => v[i] == bit);
	}
	
	return result;
}

try
{
	let text = fs.readFileSync ("input.txt", "utf8"),
		values = text.split ("\n").map (s => s.replace ("\r", ""));

	let o2 = filterO2Values (values),
		co2 = filterCO2Values (values);

	console.log(o2 * co2);
}
catch (err)
{
	console.error (err);
}
