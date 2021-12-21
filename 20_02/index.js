
import * as fs from 'fs';

const charsToInts = (array) => array.map ((c) => c == "." ? 0 : 1);
const chunkToInt = (chunk) => parseInt (chunk.join (""), 2);

class InfiniteImage
{
	constructor ()
	{
		this.pixels = new Map ();

		this.minX = Number.MAX_SAFE_INTEGER;
		this.minY = Number.MAX_SAFE_INTEGER;
		this.maxX = Number.MIN_SAFE_INTEGER;
		this.maxY = Number.MIN_SAFE_INTEGER;
	}

	get left () { return this.minX; }
	get top () { return this.minY; }
	get width () { return this.maxX - this.minX + 1; }
	get height () { return this.maxY - this.minY + 1; }

	getChunk (x, y, voidValue=0)
	{
		return [this.getPixel (x - 1, y - 1, voidValue),
				this.getPixel (x,     y - 1, voidValue),
				this.getPixel (x + 1, y - 1, voidValue),

				this.getPixel (x - 1, y, voidValue),
				this.getPixel (x,     y, voidValue),
				this.getPixel (x + 1, y, voidValue),
				
				this.getPixel (x - 1, y + 1, voidValue),
				this.getPixel (x,     y + 1, voidValue),
				this.getPixel (x + 1, y + 1, voidValue)];
	}
	
	getPixels ()
	{
		let result = [],
			iter = this.pixels.values ();
		
		for (const px of this.pixels.values ())
			result.push (iter);
		
		return result;
	}

	getPixel (x, y, voidValue=0)
	{
		if (x < this.minX || x > this.maxX
		 || y < this.minY || y > this.maxY)
			return voidValue;

		return this.pixels.has (this._key (x, y)) ? 1 : 0;
	}

	setPixel (x, y)
	{
		this._updateBounds (x, y);
		this.pixels.set (this._key (x, y), { x:x, y:y });
	}
	
	toString ()
	{
		let result = [];

		for (let j = this.minY; j <= this.maxY; j++)
		{
			let row = [];
			for (let i = this.minX; i <= this.maxX; i++)
				row.push (this.getPixel (i, j) == 1 ? "#" : ".");

			result.push (row.join (""));
		}
		
		return result.join ("\n");
	}

	_updateBounds (x, y)
	{
		if (x < this.minX) this.minX = x;
		if (x > this.maxX) this.maxX = x;
		if (y < this.minY) this.minY = y;
		if (y > this.maxY) this.maxY = y;
	}

	_key (x, y) { return `${x},${y}`; }

	static applyFilter (img, filter, step, margin=2)
	{
		let result = new InfiniteImage (),
			voidValue = filter[0] == 0 ? 0 : filter[step % 2 ? 0 : 1], // test vs actual input
			left = img.left - margin,
			top = img.top - margin,
			right = img.left + img.width + margin,
			bottom = img.top + img.height + margin;

		for (let j = top; j < bottom; j++)
		{
			for (let i = left; i < right; i++)
			{
				let chunk = img.getChunk (i, j, voidValue),
					index = chunkToInt (chunk),
					px = filter[index];

				if (px == 1)
					result.setPixel (i, j);
			}
		}

		return result;
	}
}

let input = fs.readFileSync ("input.txt", "utf8")
			  .split ("\n");

let filter = charsToInts (input[0].split ("")),
	img = new InfiniteImage ();

for (let j = 2; j < input.length; j++)
{
	let pxs = charsToInts (input[j].split (""));
	for (let i = 0; i < pxs.length; i++)
	{
		if (pxs[i] == 1)
			img.setPixel (i, j - 2);
	}
}

for (let i = 0; i < 50; i++)
	img = InfiniteImage.applyFilter (img, filter, i);

console.log (img.getPixels ().length);