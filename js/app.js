import ScoreCard from "./modules/ScoreCard.js";
import { calculateDiceScore } from "./modules/Yatzy.js";
import { game, dice, buttons } from "./setup.js";

game.start();

const pointTable = document.querySelector("table.points");

function displayScore() {
	const score = calculateDiceScore(dice.values);
	for (const [name, section] of Object.entries(score)) {
		// console.log(`${name} section:`);
		for (const [key, value] of Object.entries(section)) {
			console.log(`${key}: `, value);
			const row = pointTable.querySelector(`*[data-value="${key}"]`);
			if (!row) {
				console.log(key, row);
				continue;
			}
			const output = row.querySelector(".output");
			output.textContent = `${value}`;
		}
	}
}

game.onUpdate = displayScore;

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
		dice.forEach(die => {
			if (Math.random() < 0.1) {
				die.disabled = !die.disabled;
			}
		});
	}, 750);
});
