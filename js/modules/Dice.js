import Die from "./Die.js";

const dice = [];
while (dice.length < 5) dice.push(new Die());

Object.defineProperties(dice, {
	values: {
		get() {
			return dice.map(die => die.value);
		},
	},
	animating: {
		get() {
			return dice.reduce(
				(result, die) => die.view.animating || result,
				false
			);
		},
	},
	elements: {
		get() {
			return dice.map(die => die.view.element);
		},
	},
	allLocked: {
		get() {
			return dice.reduce((result, die) => result && die.locked, true);
		},
	},
	reset: {
		value: () =>
			dice.forEach(die => {
				die.setLocked(false);
				die.setValue(1);
			}),
	},
	roll: {
		value: async (animate, interval, duration) => {
			const pending = dice.map(die =>
				die.roll(animate, interval, duration)
			);
			const values = [];
			for await (const value of pending) {
				values.push(value);
			}
			return values;
		},
	},
});

export default dice;
