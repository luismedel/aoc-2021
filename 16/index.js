
import * as fs from 'fs';

const PKT_LIT = 4;

function debug (s) { console.log (s); }
//function debug (s) { }

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

	static parsePacket (seq)
	{
		if (seq.atEndOfData)
			return null;

		let version = seq.read (3),
			type = seq.read (3);

		debug ("PACKET: version = " + version);
		debug ("PACKET: type = " + type);
		
		switch (type)
		{
			case PKT_LIT: return new LiteralPacket (version, seq);
			default: return new OperatorPacket (version, type, seq);
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
			{
				let p = Packet.parsePacket (seq);
				if (p == null)
				{
					debug ("OP: No more data");
					break;
				}
				
				this.subpackets.push (p);
			}
		}
		else
		{
			let count = seq.read (11);

			debug ("PACKET: packet count = " + count);

			for (let i = 0; i < count; i++)
			{
				let p = Packet.parsePacket (seq);
				if (p == null)
				{
					debug ("OP: No more data");
					break;
				}

				this.subpackets.push (p);
			}
		}
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
		this.value = 0;
		
		let cont;
		do
		{
			cont = seq.read (1);
			let part = seq.read (4);
			this.value = (this.value << 4) + part;
		}
		while (cont == 1);
		
		debug ("LIT: " + this.value);
	}
}

function decodePackets (bytes)
{
	let seq = new BitSequence (bytes);

	let packets = [];
	while (!seq.atEndOfData)
	{
		let p = Packet.parsePacket (seq);
		if (p == null)
			break;
		
		packets.push (p);
	}
	
	return packets;
}

function countVersionNumbers (packet)
{
	let sum = packet.version;
	if (packet.type != PKT_LIT)
	{
		for (let i = 0; i < packet.subpackets.length; i++)
			sum += countVersionNumbers (packet.subpackets[i]);
	}
	
	return sum;
}
	
let data = fs.readFileSync ("input.txt", "utf8");
//data = "C0015000016115A2E0802F182340";
let bytes = data.match (/.{1,2}/g).map (h => parseInt (h, 16));

let packets = decodePackets (bytes);

let sum = 0;
for (let i = 0; i < packets.length; i++)
	sum += countVersionNumbers (packets[i]);

console.log (sum);