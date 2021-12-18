
function Point (x, y) { return {x:x, y:y}; }

class Rect
{
	constructor (x, y, w, h)
	{
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	contains (pt)
	{
		return !((pt.x < this.x)
			  || (pt.x > this.x + this.w)
			  || (pt.y > this.y)
			  || (pt.y < this.y - this.h));
	}
}

// I'm too tired (and lazy) to do proper maths
// Let's brute force a bit :-)


///function solve (S, area, xpoints)
///{
///	/* 
///	 * For each identified valid x point we test a vy:
///	 * - Each probe starting with a positive vy0 velocity will reach the starting Y after ((2*vy) + 1)
///	 * steps with negative vy.
///	 * - At this moment we have: vx (minored by steps), vy and steps.
///	 * - Given any vx and steps, theres only one vy we can test vy = steps-1 / 2  (derived from previous formula)
///	 *
///	 *
///	 * If vy0 is negative we're at the same scenario, but from step 0.
///	 *
///	 *  Then:
///	 * 		- If S.y < area.y:
///	 *			- We simulate forward with the proposed vy.
///	 * 		- If S.y > area.y:
///	 *			- We simulate backwards with the proposed vy.
///	 * 		- If S.y is inside area:
///	 *			- We have a candidate solution.
///	 */
///
///	let result = [];
///
///	for (let i = 0; i < xpoints.length; i++)
///	{
///		let x = xpoints[i][0],				
///			vx = xpoints[i][1],				
///			vx0 = xpoints[i][2],				// initial vx
///			stepsX = xpoints[i][3],				// steps when reached area
///			steps = 2*vy0 + 1,					// steps passed when the probe hits y=0 again
///			vy0 = ((steps - 1) / 2) | 0,		// initial vy we'll test
///			vy = -vy0;							// vy when the probe hits 0 again
///
///		let xpt = stepXPoint ([x, vx], steps - stepsX);
///		x = xpt[0];
///		vx = xpt[1];
///
///		// above area
///		if (y > area.y)
///		{
///			while (y > area.y)
///			{
///				x += vx;
///				vx = Math.max (0, --vx);
///				y += vy++;
///				
///				if (area.contains (point (x, y)))
///				{
///					result.push ([vx0, vy0]);
///					break;
///				}
///			}
///		}
///		// below area
///		else if (y < area.y-area.h)
///		{
///			while (y < area.y-area.h)
///			{
///				x += vx;
///				vx = Math.max (0, --vx);
///				y += vy++;
///				
///				if (area.contains (point (x, y)))
///				{
///					result.push ([vx0, vy0]);
///					break;
///				}
///			}
///		}
///		else
///			result.push ([vx0, vy0]);
///	}
///	
///	return result;
///}

function simulate (S, area, vx, vy)
{
	let p = new Point (S.x, S.y),
		steps = [new Point (S.x, S.y)];

	while (true)
	{
		if (vx != 0)
		{
			p.x += vx;
			vx -= (vx > 0) ? 1 : -1;
		}

		p.y += vy--;
		
		//console.log (p, vx, vy);
		steps.push (new Point (p.x, p.y));

		if (vx < 0 && p.x < area.x)
			return false;

		if (vx > 0 && p.x > area.x + area.w)
			return false;

		if (vy < 0 && p.y < area.y - area.h)
			return false;
		
		if (area.contains (p))
			return steps;
	}
}

function bruteForce (S, area, size)
{
	let result = [];
	
	for (let i = -size; i < size; i++)
	{
		for (let j = -size; j < size; j++)
		{
			if (simulate (S, area, i, j))
				result.push ([i, j]);
		}
	}
	
	return result;
}

let S = new Point (0, 0),
	area = new Rect (156, -69, 202-156, -69-(-110)); // target area: x=156..202, y=-110..-69
	// example
	//area = new Rect (20, -10, 10, 15); // target area: x=20..30, y=-10..-5

console.log (area);

let solutions = bruteForce (S, area, 8000);

console.log (solutions.length);
