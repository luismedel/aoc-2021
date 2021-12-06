
import * as fs from 'fs';

class Population
{
	constructor ()
	{
		this.days = { 0:0, 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0 };
	}
	
	addFish (daysUntilSpawn) { this.days[daysUntilSpawn]++; }
	addFishes (daysUntilSpawn, count) { this.days[daysUntilSpawn] += count; }

	spawn ()
	{
		var days = this.days,
			spawned = 0,
			nextPopulation = new Population ();

		nextPopulation.addFishes (8, this.days[0]);
		nextPopulation.addFishes (6, this.days[0]);

		for (let i = 1; i < 9; i++)
			nextPopulation.addFishes (i - 1, this.days[i]);

		return nextPopulation;
	}
	
	get count ()
	{
		let result = 0;
		for (let i = 0; i < 9; i++)
			result += this.days[i];

		return result;
	}
}

let text = fs.readFileSync ("input.txt", "utf8"),
	days = text.split (",").map (n => parseInt (n, 10));

let population = new Population ();
days.forEach (d => population.addFish (d));

for (let i = 0; i < 80; i++)
	population = population.spawn ();

console.log (`Count: ${population.count}`);