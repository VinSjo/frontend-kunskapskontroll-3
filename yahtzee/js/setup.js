import DiceCollection from "./DiceCollection.js";

// const diceContainer = document.querySelector(".dice.container");
// const rollButton = document.querySelector(".roll-button");
// const dice = new DiceCollection(5);
// diceContainer.append(...dice.element);

// rollButton.addEventListener("click", () => {
// 	rollButton.setAttribute("disabled", true);
// 	dice.shuffle(100, 1000, null, () => {
// 		rollButton.removeAttribute("disabled");
// 	});
// });

const game = {
	dice: new DiceCollection(5),
	players: [],
	containers: {
		dice: document.querySelector(".dice.container"),
	},
	buttons: {
		roll: document.querySelector(".roll-button"),
	},
	roll() {
		this.dice.roll();
		this.dice.update();
	},
	init() {
		this.containers.dice.append(...this.dice.elements);

		this.buttons.roll.addEventListener("click", () => {
			this.buttons.roll.setAttribute("disabled", true);
			this.dice.shuffle(100, 1000, () =>
				this.buttons.roll.removeAttribute("disabled")
			);
		});

		this.dice.forEach(die => {
			die.icon.element.addEventListener("click", () => {
				die.disabled ? die.enable() : die.disable();
			});
		});

		this.dice.roll();
	},
};

export { game };
