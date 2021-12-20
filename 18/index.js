
import * as fs from 'fs';

//const debug = console.log;
const debug = () => {};
const pair2s = (pair) => isNumber (pair) ? pair : `[${pair.left},${pair.right}] (depth:${pair.depth})`;

const isNumber = (n) => !(n instanceof Pair);

class Expression
{
	constructor (root)
	{
		this.root = root;
		this.serialize ();
	}
	
	getMagnitude () { return this.root.getMagnitude (); }
	
	serialize ()
	{
		let offset = 0,
			chars = [];

		function push (s)
		{
			chars.push (s);
			offset += s.toString ().length;
		}

		function serializePair (pair, parent, depth)
		{
			pair.parent = parent;
			pair.depth = depth;
			
			push ("[");
			pair.stringOffset[0] = offset;
			if (isNumber (pair.left))
				push (pair.left);
			else
				serializePair (pair.left, pair, depth + 1);
			push (",");
			pair.stringOffset[1] = offset;
			if (isNumber (pair.right))
				push (pair.right);
			else
				serializePair (pair.right, pair, depth + 1);
			push ("]");
		}

		serializePair (this.root, null, 0);
		this.string = chars.join ("");

		return this.string;
	}
	
	findPairForOffset (offset)
	{
		let stack = [this.root];
		
		while (stack.length > 0)
		{
			let n = stack.pop ();
			if (n.stringOffset[0] == offset
			 || n.stringOffset[1] == offset)
				return n;
			
			if (n.left && !isNumber (n.left))
				stack.push (n.left);
			
			if (n.left && !isNumber (n.right))
				stack.push (n.right);
		}
		
		return null;
	}

	findNearestNumber (pair, direction)
	{
		if (direction > 0)
		{
			let offset = pair.stringOffset[1] + 1;

			while (this.string.charAt (offset) != "]")
				offset++;
			
			while (offset < this.string.length)
			{
				let c = this.string.charAt (offset);
				if (c >= '0' && c <= '9')
					return this.findPairForOffset (offset);
				offset++;
			}
		}
		else
		{
			let offset = pair.stringOffset[0];

			while (this.string.charAt (offset) != "[")
				offset--;

			while (offset > 0)
			{
				let c = this.string.charAt (offset);
				if (c >= '0' && c <= '9')
				{
					while (c >= '0' && c <= '9')
						c = this.string.charAt (--offset);

					return this.findPairForOffset (++offset);
				}

				offset--;
			}
		}
	}
	
	explode (pair)
	{
		function add (other, value, props) { if (!other) return; if (isNumber (other[props[0]])) other[props[0]] += value; else other[props[1]] += value; }

		let left = this.findNearestNumber (pair, -1),
			right = this.findNearestNumber (pair, 1);

		//let left = this.findNearestNumber2 (pair, "left"),
		//	right = this.findNearestNumber2 (pair, "right");

		debug ("    explode", pair2s (pair));
		debug ("    	-->", pair2s (left), pair2s (right));

		add (left, pair.left, ["right", "left"]);
		add (right, pair.right, ["left", "right"]);

		debug ("    	-->", pair2s (left), pair2s (right));

		if (pair.parent.left == pair)
			pair.parent.left = 0;
		else
			pair.parent.right = 0;

		this.serialize ();
		debug (this.string);
	}
	
	split (pair)
	{
		const splitValue = (v) => new Pair (Math.floor (v / 2), Math.ceil (v / 2), pair.depth + 1);

		debug ("    split", pair2s (pair));
		
		if (isNumber (pair.left) && pair.left > 9)
		{
			pair.left = splitValue (pair.left);
			debug ("    	-->", pair2s (pair.left));
		}
		else
		//if (isNumber (pair.right) && pair.right > 9)
		{
			pair.right = splitValue (pair.right);
			debug ("    	-->", pair2s (pair.right));
		}

		this.serialize ();
		debug (this.string);
	}
	
	_findPairs (pair, fn, solutions)
	{
		if (!isNumber (pair))
		{
			this._findPairs (pair.left, fn, solutions);
			this._findPairs (pair.right, fn, solutions);
		}

		if (fn (pair) === true)
			solutions.push (pair);
	}

	findPair (fn)
	{
		let pairs = [];
		this._findPairs (this.root, fn, pairs);
		return pairs[0];
	}

	reduce ()
	{
		let exploding = this.findPair ((pair) => pair.depth >= 4 && isNumber (pair.left) && isNumber (pair.right));
		if (exploding)
		{
			this.explode (exploding);
			return true;
		}
		
		let split = this.findPair ((pair) => (isNumber (pair.left) && pair.left > 9) || (isNumber (pair.right) && pair.right > 9));
		if (split)
		{
			this.split (split);
			return true;
		}

		return false;
	}

	fullReduce ()
	{
		while (this.reduce ())
			;
	}
	
	static add (left, right)
	{
		return new Expression (new Pair (left.root, right.root));
	}

	static parse (input)
	{
		return new Expression (Expression._parsePair (input, 0)[0]);
	}

	static _parsePair (input, offset, depth=0)
	{
		const expect = (c) => { if (input.charAt (offset++) != c) throw `Syntax error at pos ${offset}. Expected '${c}'. Found '${input.charAt (offset-1)}'`; };

		const numberOrPair = () => {
			let c = input.charAt (offset++),
				buf = [];

			while (c >= '0' && c <= '9')
			{
				buf.push (c);
				c = input.charAt (offset++);
			}
			
			--offset;
			
			if (buf.length > 0)
				return parseInt (buf.join (""), 10);

			let res = Expression._parsePair (input, offset, depth+1);
			offset = res[1];
			return res[0];
		};

		let left, right;

		expect ("[");
		left = numberOrPair ();
		expect (",");
		right = numberOrPair ();
		expect ("]");
		
		return [new Pair (left, right, depth), offset];
	}
}

class Pair
{
	static _id = 1;
	
	constructor (left ,right, depth=0)
	{
		this.id = Pair._id++;
		
		this.left = left;
		this.right = right;
		this.depth = depth;

		this.parent = null;
		if (!isNumber (left))  left.parent = this;
		if (!isNumber (right)) right.parent = this;

		this.stringOffset = [-1, -1]; // where do left and right starts in the serialized string
	}

	getMagnitude ()
	{
		let left = isNumber (this.left) ? this.left : this.left.getMagnitude (),
			right = isNumber (this.right) ? this.right : this.right.getMagnitude ();
		
		return 3*left + 2*right;
	}
}

let exprs = fs.readFileSync ("input.txt", "utf8")
			  .split ("\n")
			  .map ((line) => Expression.parse (line));

let expr = exprs[0];

for (let i = 1; i < exprs.length; i++)
{
	let next = exprs[i];

	console.log ("  " + expr.string);
	console.log ("+ " + next.string);
	expr = Expression.add (expr, next);
	expr.fullReduce ();
	console.log ("= " + expr.string);
	console.log ("");
}

console.log ("Result: " + expr.string);
console.log ("Magnitude: " + expr.getMagnitude ());
