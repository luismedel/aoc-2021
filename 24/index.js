/*

The input program uses z as a 26-base number, acting as a stack.

w <-- input
x <-- top of stack || 0

switch (step)
	0:	x + 13
	1:	x + 11
	2:	x + 15
	3:	pop & x - 6
	4:	x + 15
	5:	pop & x - 8
	6:	pop & x - 4
	7:	x + 15
	8:	x + 10
	9:	x + 11
	10:	pop & x - 11
	11:	pop & x + 0
	12:	pop & x - 8
	13:	pop & x - 7

Only when x != w:

y <-- w

switch (step);
	0:	y + 3
	1:	y + 12
	2:	y + 9
	3:	y + 12  <-- this should never happen
	4:	y + 2
	5:	y + 1   <-- this should never happen
	6:	y + 1   <-- this should never happen
	7:	y + 13
	8:	y + 1
	9:	y + 6
	10:	y + 2   <-- this should never happen
	11:	y + 11  <-- this should never happen
	12:	y + 10  <-- this should never happen
	13:	y + 3   <-- this should never happen
push y

We can deduce that:
- In step 3  we pop the top of the stack pushed in step 2
- In step 5  we pop the top of the stack pushed in step 4
- In step 6  we pop the top of the stack pushed in step 1
- In step 10 we pop the top of the stack pushed in step 9
- In step 11 we pop the top of the stack pushed in step 8
- In step 12 we pop the top of the stack pushed in step 7
- In step 13 we pop the top of the stack pushed in step 0

So, having in mind that each 'w' can only be 1..9:
- Input for step 2 must be 1 <= w+9-6 <= 9 --> 1 <= w+3 <= 9 --> w = 1..6
	- And input for step 3 must be 4..9
- Input for step 4 must be w = 7..9
	- And input for step 5 must be 1..3
- Input for step 1 must be w = 1
	- And input for step 6 must be 9
- Input for step 9 must be w = 6..9
	- And input for step 10 must be 1..4
- Input for step 8 must be w = 1..8
	- And input for step 11 must be 2..9
- Input for step 7 must be w = 1..4
	- And input for step 12 must be 6..9
- Input for step 0 must be w = 5..9
	- And input for step 13 must be 1..5

SOLUTION TO PART 1: 91699394894995

--------------------------------------

On a previous attempt, I tried to bruteforce the solution using a sort of branching algorithm:

- I start with 9 vms, each with an input consisting in only 1 number (from 1 to 9)
- In each iteration:
	- Each vm process the program until it needs another input.
	- I group all vms by their regs.z value, saving only the vm with the higest input value, in the hope that regs.z will repeat for some inputs, and so reducing the solution space.
	- I append 9 new inputs, cloning the selected vms in the previous step.

Sadly, the value of regs.z didn't repeat enough, crashing the program efore the 11th iteration :-(

9
81
729
6561
7290
65610
72900
73710
663390
5970510
(crash)
*/

import * as fs from 'fs';

const instructions = {
	"inp": (vm, a)    => vm.regs[a] = vm.getInput (),
	"add": (vm, a, b) => vm.regs[a] += vm.getValue (b),
	"mul": (vm, a, b) => vm.regs[a] *= vm.getValue (b),
	"div": (vm, a, b) => vm.regs[a] = Math.floor (vm.regs[a] / vm.getValue (b)),
	"mod": (vm, a, b) => vm.regs[a] %= vm.getValue (b),
	"eql": (vm, a, b) => vm.regs[a] = vm.regs[a] == vm.getValue (b) ? 1 : 0,
};

class VM
{
	constructor (program, input)
	{
		this.regs = { w:0, x:0, y:0, z:0 };

		this.program = program;
		this.pc = 0;

		this.input = input || [];
		this.ic = 0;
		this.lastInput = null;
	}

	getValue (b)
	{
		return this.regs[b] === undefined ? parseInt (b, 10) : this.regs[b];
	}
	
	getInput ()
	{
		const result = this.input[this.ic++];
		this.lastInput = result;
		return result;
	}

	putInput (v)
	{
		this.input.push (v);
	}

	run ()
	{
		let steps = 0;

		while (this.pc < this.program.length)
		{
			const instr = this.program[this.pc++];
			if (instr.op == "inp" && this.ic >= this.input.length)
			{
				this.pc--;
				break;
			}

			instructions[instr.op] (this, instr.left, instr.right);
			steps++;
		}

		return steps > 0;
	}

	get key ()
	{
		//return `${this.pc} ${this.ic} ${this.regs.x} ${this.regs.y} ${this.regs.z} ${this.regs.w}`;
		//return `${this.pc} ${this.ic} ${this.regs.z}`;
		return this.regs.z;
	}
}

function parseOp (op)
{
	const m = /^(...) (x|y|z|w)(?: (.+)?)?$/.exec (op);
	return { op:m[1], left:m[2], right:m[3] };
}

function cloneVM (vm)
{
	const result = new VM (vm.program, vm.input.slice ());

	result.pc = vm.pc;
	result.ic = vm.ic;
	result.regs.w = vm.regs.w;
	result.regs.x = vm.regs.x;
	result.regs.y = vm.regs.y;
	result.regs.z = vm.regs.z;
	
	return result;
}

function nextOp (op, pc, program)
{
	while (++pc < program.length)
	{
		if (program[pc].op == op)
			return pc;
	}
	
	return -1;
}

const program = fs.readFileSync ("input.txt", "utf8")
				  .split ("\n")
				  .map (parseOp);

/*
let steps = 0,
	stack = [];

for (let i = 1; i <= 9; i++)
	stack.push (new VM (program, [i]));

while (steps++ < 14)
{
	console.log (stack.length);
	
	const memo = {};
	stack.forEach ((vm) => {
		vm.run ();

		const k = vm.key,
			  prev = memo[k];

		if (prev !== undefined)
		{
			if (vm.lastInput > prev.lastInput)
				memo[k] = vm;
		}
		else
			memo[k] = vm;
	});

	stack = [];
	Object.values (memo).forEach (vm => {
		for (let i = 1; i <= 9; i++)
		{
			let clone = cloneVM (vm);
			clone.putInput (i);
			stack.push (clone);
		}
	});
}

let max = -1;
for (let i = 0; i < stack.length; i++)
{
	const vm = stack[i];
	if (vm.regs.z != 0)
		continue;

	const n = parseInt (vm.input.join (""), 10);
	if (n > max)
		max = n;
}

console.log (stack.map ((vm) => vm.regs.z));
console.log (max);
*/
