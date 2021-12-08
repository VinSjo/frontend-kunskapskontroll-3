import { DiceArray } from "./modules/Dice.js";
const players = [];
const containers = {
	dice: document.querySelector(".dice.container"),
};
const buttons = {
	roll: document.querySelector(".roll-button"),
};
const dice = new DiceArray(5);

const game = {
	onUpdate: null,
	start() {
		containers.dice.append(...dice.elements);
		buttons.roll.addEventListener("click", ev => {
			if (dice.animating) return;
			buttons.roll.disabled = true;
			dice.animatedRoll(100, 500, () => {
				buttons.roll.disabled = false;
				this.onUpdate && this.onUpdate(ev);
			});
		});
		dice.forEach(die => {
			die.addEventListener("click", () => {
				if (die.animating) return;
				die.disabled = !die.disabled;
				dice.fullyDisabled
					? (buttons.roll.disabled = true)
					: (buttons.roll.disabled = false);
			});
		});
	},
};

export { game, dice, players, containers, buttons };
