
import * as fs from 'fs';

const rinput = /^(o..?) x\=(\-?\d+)\.\.(\-?\d+),y\=(\-?\d+)\.\.(\-?\d+),z\=(\-?\d+)\.\.(\-?\d+)$/

function parseOp (input)
{
	const m = rinput.exec (input);
	return [m[1], parseFloat (m[2]), parseFloat (m[3]),
				  parseFloat (m[4]), parseFloat (m[5]),
				  parseFloat (m[6]), parseFloat (m[7])];
}

let ops = fs.readFileSync ("input.txt", "utf8")
			.split ("\n")
			.map (parseOp);

// Axes signs:
// x: -left  0 +right
// y: -down  0 +up
// z: -front 0 +back
class Cube
{
	constructor (xmin, xmax, ymin, ymax, zmin, zmax, value)
	{
		this.left = Math.min (xmin, xmax);
		this.right = Math.max (xmin, xmax);

		this.top = Math.max (ymin, ymax);
		this.bottom = Math.min (ymin, ymax);

		this.front = Math.min (zmin, zmax);
		this.back = Math.max (zmin, zmax);

		this.value = value;
	}
	
	get volume () { return (this.right - this.left + 1) * (this.top - this.bottom + 1) * (this.back - this.front + 1); }
	
	getIntersectionWith (other)
	{
		if (this.right < other.left || other.right < this.left
		||  this.top < other.bottom || other.top < this.bottom
		||  this.back < other.front || other.back < this.front)
			return null;

		return new Cube (
			Math.max (this.left, other.left),
			Math.min (this.right, other.right),
			Math.min (this.top, other.top),
			Math.max (this.bottom, other.bottom),
			Math.max (this.front, other.front),
			Math.min (this.back, other.back),
			this.value
		);
	}
}

let processed = [];

for (let i = 0; i < ops.length; i++)
{
	let rule = ops[i],
		intersections = [],
		c = new Cube (rule[1], rule[2], rule[3], rule[4], rule[5], rule[6], rule[0] == "on" ? 1 : -1);

	if (c.value == 1)
		intersections.push (c);
	
	// Find intersection with previous processed cubes
	for (let j = 0; j < processed.length; j++)
	{
		let intersect = processed[j].getIntersectionWith (c);
		if (intersect == null)
			continue;
		intersect.value *= -1; // dont' count double on intersections
		intersections.push (intersect);
	}
	
	for (let j = 0; j < intersections.length; j++)
		processed.push (intersections[j]);
}

console.log (processed.reduce ((prev, c) => prev + (c.volume * c.value), 0));