
import * as fs from 'fs';

class Board
{
	constructor (text)
	{
		this.winner = false;
		this.lastWinningNumber = -1;

		this.values = text.split ("\n")
						  .map (line => line.trim ().split (/\s+/).map (v => parseInt (v, 10)));
		
		this.rowScores = [0, 0, 0, 0, 0];
		this.colScores = [0, 0, 0, 0, 0];
	}
	
	markNumber (number)
	{
		let result = false;
		
		for (let j = 0; j < 5; j++)
		{
			let row = this.values[j],
				markedCol = -1;
				
			for (let i = 0; i < 5; i++)
			{
				if (row[i] != number)
					continue;

				row[i] = "*";
				result = true;
				this.lastWinningNumber = number;
				this.winner = this.winner || (++this.rowScores[j] == 5);
				this.winner = this.winner || (++this.colScores[i] == 5);
			}
		}

		return result;
	}

	get score ()
	{
		let result = 0;
		
		for (let j = 0; j < 5; j++)
		{
			let row = this.values[j];

			for (let i = 0; i < 5; i++)
				result += row[i] == "*" ? 0 : row[i];
		}

		return result * this.lastWinningNumber;
	}
}

function parseBoards (input, startIndex)
{
	let result = [];
	
	let i = startIndex;
	
	while (i < input.length)
	{
		let line = input[i++].trim ();
		
		if (line.length == 0)
			continue;
		
		let boardInput = line;
		for (let j = 0; j < 4; j++)
			boardInput += "\n" + input[i++];
		
		result.push (new Board (boardInput));
	}
	
	return result;
}

function findWinner (boards, numbers)
{
	for (let i = 0; i < numbers.length; i++)
	{
		let n = numbers[i];

		for (let j = 0; j < boards.length; j++)
		{
			if (!boards[j].markNumber (n))
				continue;
			
			if (boards[j].winner)
				return j;
		}
	}
}

try
{
	let text = fs.readFileSync ("input.txt", "utf8"),
		lines = text.split ("\n");

	let numbers = lines[0].split (",").map (n => parseInt (n, 10)),
		boards = parseBoards (lines, 1);
		
	let winnerIndex = findWinner (boards, numbers);
/*
	for (let i = 0; i < boards.length; i++)
	{
		if (!boards[i].winner)
			continue;
		
		console.log (`Index: ${i}`);
		console.log (boards[i].values);
	}
*/
	console.log (`Index: ${winnerIndex}`);
	console.log (`Winning number: ${boards[winnerIndex].lastWinningNumber}`);
	console.log (`Board score: ${boards[winnerIndex].score}`);
	console.log (boards[winnerIndex].values);
}
catch (err)
{
	console.error (err);
}
