
import * as fs from 'fs';

const PKT_SUM = 0,
	  PKT_PROD = 1,
	  PKT_MIN = 2,
	  PKT_MAX = 3,
	  PKT_LIT = 4,
	  PKT_GT = 5,
	  PKT_LT = 6,
	  PKT_EQ = 7;

const NAMES = ["sum", "prod", "min", "max", "lit", "gt", "lt", "eq"];

//function debug (s) { console.log (s); }
function debug (s) { }

class BitSequence
{
	constructor (bytes)
	{
		this.bytes = bytes;

		this.byteoffset = 0;
		this.bitoffset = 7;
	}

	read (count)
	{
		if (this.atEndOfData)
		{
			debug ("WARN: No more data.");
			return 0;
		}

		let result = 0,
			b = this.bytes[this.byteoffset];

		for (let i = 0; i < count; i++)
		{
			result = (result << 1) | ((b & (1 << this.bitoffset)) >> this.bitoffset);
			if (--this.bitoffset < 0)
			{
				this.bitoffset = 7;
				this.byteoffset++;

				if (this.atEndOfData)
				{
					debug ("WARN: End of sequence reached.");
					return result;
				}
				
				b = this.bytes[this.byteoffset];
			}
		}
		
		return result;
	}
	
	peek (count)
	{
		let byteoffset = this.byteoffset,
			bitoffset = this.bitoffset,
			result = read (count);

		this.byteoffset = byteoffset;
		this.bitoffset = bitoffset;
	}
	
	get atEndOfData () { return this.byteoffset >= this.bytes.length; }
	get position () { return (this.byteoffset * 8) + (7 - this.bitoffset); }
}

class Packet
{
	constructor (version, type, seq)
	{
		this.version = version;
		this.type = type;
		
		if (seq)
			this.parse (seq);
	}

	parse (seq) {}
	
	eval () {}

	static parsePacket (seq)
	{
		if (seq.atEndOfData)
			return null;

		let version = seq.read (3),
			type = seq.read (3);

		if (seq.atEndOfData)
			return null;

		debug ("PACKET: version = " + version);
		debug ("PACKET: type = " + NAMES[type]);
		
		switch (type)
		{
			case PKT_LIT: return new LiteralPacket (version, seq);
			default:
			{
				// let's simplify the expression
				let result = new OperatorPacket (version, type, seq);
				while (result.subpackets && result.subpackets.length == 1)
					result = result.subpackets[0];
				
				return result;
			}
		}
	}
}

class OperatorPacket
	extends Packet
{
	constructor (version, type, seq)
	{
		super (version, type, seq);
	}

	parse (seq)
	{
		this.subpackets = [];
		
		if (seq.read (1) == 0)
		{
			let length = seq.read (15),
				pos = seq.position;

			debug ("OP: bit size = " + length);

			while (seq.position - pos < length)
				this.subpackets.push (Packet.parsePacket (seq));
		}
		else
		{
			let count = seq.read (11);

			debug ("PACKET: packet count = " + count);

			for (let i = 0; i < count; i++)
				this.subpackets.push (Packet.parsePacket (seq));
		}
	}

	eval ()
	{
		function min (pp)
		{
			let v = pp[0].eval ();
			for (let i = 1; i < pp.length; i++)
			{
				let test = pp[i].eval ();
				if (test < v)
					v = test;
			}
			
			return v;
		}
		
		function max (pp)
		{
			let v = pp[0].eval ();
			for (let i = 1; i < pp.length; i++)
			{
				let test = pp[i].eval ();
				if (test > v)
					v = test;
			}
			
			return v;
		}
		
		if (this.subpackets.length == 0)
			throw "Empty operator";
		else if (this.subpackets.length == 1)
			return this.subpackets[0].eval ();
		
		switch (this.type)
		{
			case PKT_SUM:	return this.subpackets.reduce ((res,p) => res + p.eval (), 0n);
			case PKT_PROD:	return this.subpackets.reduce ((res,p) => res * p.eval (), 1n);
			case PKT_GT:	return this.subpackets[0].eval () > this.subpackets[1].eval () ? 1n : 0n;
			case PKT_LT:	return this.subpackets[0].eval () < this.subpackets[1].eval () ? 1n : 0n;
			case PKT_EQ:	return this.subpackets[0].eval () == this.subpackets[1].eval () ? 1n : 0n;
			case PKT_MIN:	return min (this.subpackets);
			case PKT_MAX:	return max (this.subpackets);
			default: throw `Unkown operator ${this.type}`;
		}
	}
	
	print (pad)
	{
		pad = pad || "";
		console.log (pad + NAMES[this.type] + "{");
		this.subpackets.forEach (p => p.print (pad + "  "));
		console.log (pad + "}");
	}
}

class LiteralPacket
	extends Packet
{
	constructor (version, seq)
	{
		super (version, PKT_LIT, seq);
	}

	parse (seq)
	{
		this.value = 0n;

		let cont;
		do
		{
			cont = seq.read (1);
			let part = seq.read (4);
			this.value = (this.value << 4n) + BigInt (part);
		}
		while (cont == 1);
		
		debug ("LIT: " + this.value);
	}

	eval () { return this.value; }
	
	print (pad) { console.log (pad + this.value); }
}

function decodePacket (bytes)
{
	let seq = new BitSequence (bytes);
	return Packet.parsePacket (seq);
}

let data = fs.readFileSync ("input.txt", "utf8");
//data = "9C0141080250320F1802104A08";
let bytes = data.match (/.{1,2}/g).map (h => parseInt (h, 16));
decodePacket (bytes).print ();
console.log (decodePacket (bytes).eval ());
