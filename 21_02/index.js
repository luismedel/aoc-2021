
import * as fs from 'fs';

const rinput = /^Player (\d+) starting position\: (\d+)$/

let players = fs.readFileSync ("input.txt", "utf8")
				.split ("\n")
				.map (s => { let m = rinput.exec (s); return parseInt (m[2], 10); });

const newScores = (players) => new Array (players.length).fill (0);
const key = (p1pos, p1score, p2pos, p2score, is1turn) => `${p1pos}, ${p1score}, ${p2pos}, ${p2score}, ${is1turn}`;

const rolls = [];
for (let i = 1; i < 4; i++)
	for (let j = 1; j < 4; j++)
		for (let k = 1; k < 4; k++)
			rolls.push (i + j + k);

const memo = {};

function play (p1pos, p1score, p2pos, p2score, is1turn)
{
	const k = key (...arguments);

	if (memo[k]) return memo[k];
	if (p1score >= 21) return memo[k] = [1, 0];
	if (p2score >= 21) return memo[k] = [0, 1];

	const wins = [0, 0];

	for (let i = 0; i < rolls.length; i++)
	{
		const d = rolls[i];

		let next;

		if (is1turn)
		{
			const cell = ((p1pos + d - 1) % 10) + 1,
				  score = p1score + BigInt (cell);

			next = play (cell, score, p2pos, p2score, !is1turn);
		}
		else
		{
			const cell = ((p2pos + d - 1) % 10) + 1,
				  score = p2score + BigInt (cell);

			next = play (p1pos, p1score, cell, score, !is1turn);
		}

		wins[0] += next[0];
		wins[1] += next[1];
	}

	return memo[k] = wins;
};

let wins = play (players[0], 0n, players[1], 0n, true);

console.log (wins[0]);
console.log (wins[1]);
