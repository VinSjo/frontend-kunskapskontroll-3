import { game, dice, buttons } from "./setup.js";
import { calculatePoints } from "./yatzy.js";

game.start();

const pointTable = document.querySelector("table.points");
game.onUpdate = () => {
	const values = dice.values;
	const sections = calculatePoints(values);
	for (const [name, section] of Object.entries(sections)) {
		// console.log(`${name} section:`);
		for (const [key, value] of Object.entries(section)) {
			// console.log(`${key}: `, value);
			const row = pointTable.querySelector(`*[data-value="${key}"]`);
			if (!row) {
				console.log(key, row);
				continue;
			}
			const output = row.querySelector(".output");
			output.textContent = `${value}`;
		}
	}
};

// let intervalID = null;
// let diceValue = 1;

// document.addEventListener("keydown", ev => {
// 	if (ev.key !== " ") return;
// 	ev.preventDefault();
// 	if (intervalID !== null) {
// 		clearInterval(intervalID);
// 		intervalID = null;
// 		dice.reset();
// 		return;
// 	}
// 	intervalID = setInterval(() => {
// 		dice.forEach(die => {
// 			die.value = diceValue;
// 		});
// 		diceValue++;
// 		if (diceValue > 6) {
// 			diceValue = 1;
// 		}
// 	}, 1000);
// });

let intervalID = null;
document.addEventListener("keydown", ev => {
	if (ev.key !== " ") return;
	ev.preventDefault();
	if (intervalID !== null) {
		clearInterval(intervalID);
		intervalID = null;
		dice.reset();
		return;
	}
	intervalID = setInterval(() => {
		buttons.roll.dispatchEvent(new Event("click"));
		dice.forEach(dice => {
			if (Math.random() < 0.1) {
				dice.disabled = !dice.disabled;
			}
		});
	}, 750);
});
