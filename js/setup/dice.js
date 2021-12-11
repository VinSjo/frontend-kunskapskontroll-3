import Die from '../classes/Die.js';
import UI from './ui.js';

const DICE = UI.dice.elements.map(element => {
	const die = new Die(element);
	die.setValue(1);
	return die;
});

Object.defineProperties(DICE, {
	values: { get: () => DICE.map(die => die.value) },
	animating: {
		get: () => DICE.reduce((result, die) => die.animating || result, false),
	},
	elements: {
		get: () => DICE.map(die => die.element),
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
		value: async (animate = true) => {
			if (!animate) return DICE.map(die => die.roll());
			const pending = DICE.map(die => die.animatedRoll());
			const values = [];
			for await (const value of pending) {
				values.push(value);
			}
			return values;
		},
	},
});

UI.dice.container.append(...DICE.elements);

export default DICE;
