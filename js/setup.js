import dice from "./modules/Dice.js";
const dieTemplate = document.querySelector("template#dice");
dice.forEach(die => {
	die.view.setTemplate(dieTemplate.content.querySelector("svg"));
	die.setValue(1);
});

const players = [];
const containers = {
	dice: document.querySelector(".dice.container"),
};
const buttons = {
	roll: document.querySelector(".roll-button"),
};

const game = {
	onUpdate: null,
	start() {
		containers.dice.append(...dice.elements);
		buttons.roll.addEventListener("click", async ev => {
			if (dice.animating) return;
			buttons.roll.disabled = true;

			await dice.roll(true, 50, 500);

			buttons.roll.disabled = false;
			this.onUpdate && this.onUpdate(ev);
		});
		dice.forEach(die => {
			die.view.element.addEventListener("click", () => {
				if (die.view.animating) return;
				die.setLocked(!die.locked);
				dice.allLocked
					? (buttons.roll.disabled = true)
					: (buttons.roll.disabled = false);
			});
		});
	},
};

export { game, dice, players, containers, buttons };
