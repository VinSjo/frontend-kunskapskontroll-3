import Die from "../modules/Die.js";

const dieTemplate = document.querySelector("template#dice");
const dieContainer = document.querySelector(".dice.container");

const DICE = [];

while (DICE.length < 5) {
	const die = new Die();
	die.view.setTemplate(dieTemplate);
	die.setValue(1);
	DICE.push(die);
}

Object.defineProperties(DICE, {
	values: { get: () => DICE.map(die => die.value) },
	animating: {
		get: () =>
			DICE.reduce((result, die) => die.view.animating || result, false),
	},
	elements: {
		get: () => DICE.map(die => die.view.element),
	},
	allLocked: {
		get: () => DICE.reduce((result, die) => result && die.locked, true),
	},
	reset: {
		value: () =>
			DICE.forEach(die => {
				die.setLocked(false);
				die.setValue(1);
			}),
	},
	roll: {
		value: async (animate, interval, duration) => {
			const pending = DICE.map(die =>
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

dieContainer.append(...DICE.elements);

export default DICE;
