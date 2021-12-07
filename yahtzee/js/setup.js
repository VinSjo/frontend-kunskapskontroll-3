import DiceArray from "./dice/DiceArray.js";

const game = {
	dice: new DiceArray(5),
	players: [],
	containers: {
		dice: document.querySelector(".dice.container"),
	},
	buttons: {
		roll: document.querySelector(".roll-button"),
	},
	init() {
		this.containers.dice.append(...this.dice.elements);
		this.buttons.roll.addEventListener("click", () => {
			if (this.dice.shuffling) return;
			this.buttons.roll.setAttribute("disabled", true);
			this.dice.shuffle(100, 500, () => {
				this.buttons.roll.removeAttribute("disabled");
			});
		});

		this.dice.forEach(dice => {
			dice.element.addEventListener("click", () => {
				if (this.dice.shuffling) return;
				dice.disabled = !dice.disabled;
				!this.dice.available.length
					? this.buttons.roll.setAttribute("disabled", true)
					: this.buttons.roll.removeAttribute("disabled");
			});
		});
	},
};

export { game };
