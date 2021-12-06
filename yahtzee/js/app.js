import { DiceCollection } from "./Dice.js";
const diceTemplate = document.querySelector("template#dice");
const diceIcons = Array.from(
	diceTemplate.content.cloneNode(true).querySelectorAll(".icon.dice")
);
const diceContainer = document.querySelector(".dice.container");

const dice = new DiceCollection(5, 6);

dice.display = function () {
	const icons = this.values.map(value => {
		return diceIcons.reduce((previous, current) => {
			return parseInt(current.getAttribute("value")) === value
				? current.cloneNode(true)
				: previous;
		}, null);
	});
	diceContainer.innerHTML = "";
	icons.forEach(icon => {
		if (!icon) return;
		diceContainer.append(icon);
	});
};

let intervalID = setInterval(() => {
	dice.rollAll();
	dice.display();
}, 500);
