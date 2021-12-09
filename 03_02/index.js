
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

function filterValues (values, filterFunc)
{
	let length = values[0].length,
		powerPos = length - 1,
		result = 0;

	for (let i = 0; i < length; i++)
	{
		if (values.length == 1)
			return parseInt (values[0], 2);
		
		let count = getBitCount (values, i),
			bit = filterFunc (count, values.length/2) ? "1" : "0";
		if (bit == "1")
			result += 1 << powerPos;
		powerPos--;

		values = values.filter (v => v[i] == bit);
	}
	
	return result;
}

const filterO2Values = (values)  => filterValues (values, (count, length) => count >= length);
const filterCO2Values = (values) => filterValues (values, (count, length) => count < length);

let text = fs.readFileSync ("input.txt", "utf8"),
	values = text.split ("\n").map (s => s.replace ("\r", ""));

console.log(filterO2Values (values) * filterCO2Values (values));
