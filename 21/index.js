
import * as fs from 'fs';

const rinput = /^Player (\d+) starting position\: (\d+)$/

let players = fs.readFileSync ("input.txt", "utf8")
				.split ("\n")
				.map (s => { let m = rinput.exec (s); return [parseInt (m[2], 10), 0]; });

let dice = { value: 0, rolls:0 };

function roll (dice, times=1)
{
	let result = 0;
	for (let i = 0; i < times; i++)
	{
		dice.value++;
		if (dice.value > 100)
			dice.value = 1;
		dice.rolls++;
		result += dice.value;
	}
	return result;
}

let playing = true;

while (playing)
{
	for (let i = 0; i < players.length; i++)
	{
		let d = roll (dice, 3),
			cell = ((players[i][0] + d - 1) % 10) + 1,
			score = players[i][1] + cell;

		players[i][0] = cell;
		players[i][1] = score;
		
		console.log (i, d, players[i]);
		
		if (score >= 1000)
		{
			playing = false;
			break;
		}
	}
}


for (let i = 0; i < players.length; i++)
	console.log (i+1, players[i][1], players[i][1] * dice.rolls);
