import Die from '../classes/Die.js';
import UI from './ui.js';

const DICE = UI.dice.map(element => new Die(element));

Object.defineProperties(DICE, {
	isAnimating: { value: false, writable: true },
	values: { get: () => DICE.map(die => die.value) },
	elements: { get: () => DICE.map(die => die.element) },
	unlocked: { get: () => DICE.filter(die => !die.isLocked) },
	reset: {
		value: () => {
			DICE.forEach(die => {
				die.isLocked = false;
				die.value = 1;
			});
		},
	},
	roll: { value: () => DICE.map(die => die.roll()) },
	animateRoll: {
		value: async (interval = 100, timeout = 500) => {
			const dice = DICE.unlocked;
			if (DICE.isAnimating || !dice.length) return DICE.values;
			const randomOffset = max => {
				return Math.round(Math.random() * max * 2) - max;
			};
			DICE.isAnimating = true;
			dice.forEach(die => {
				die.element.style.transition = `transform ${
					interval * 0.5
				}ms linear`;
			});
			let intervalID = setInterval(() => {
				dice.forEach(die => {
					const x = randomOffset(4),
						y = randomOffset(4),
						deg = randomOffset(8);
					die.element.style.transform = `translate(${x}px,${y}px) rotate(${deg}deg)`;
					die.roll();
				});
			}, interval);
			return await new Promise(resolve => {
				setTimeout(() => {
					clearInterval(intervalID);
					dice.forEach(die => {
						die.element.style.transform = null;
						die.element.style.transition = null;
					});
					DICE.isAnimating = false;
					resolve(DICE.roll());
				}, timeout);
			});
		},
	},
});

DICE.reset();

export default DICE;
