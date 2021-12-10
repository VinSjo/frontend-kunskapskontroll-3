import { YATZY, SCOREBOARD, UI } from "./yatzy.js";
import ScoreCard from "./modules/ScoreCard.js";

YATZY.onUpdate = () => {
	UI.optionList.innerHTML = null;
	const tmp = new ScoreCard();
	const score = tmp.getDiceScore(YATZY.dice.values);
	const player = YATZY.currentPlayer;
	for (const [sectionKey, section] of Object.entries(score)) {
		for (const key of Object.keys(section)) {
			const value = section[key].value;
			const name = section[key].name;
			player.score[sectionKey][key].value = value;
			const output = `${name}: ${value} points`;
			console.log(output);
			if (value !== 0) {
				const option = document.createElement("li");
				option.textContent = output;
				UI.optionList.append(option);
			}
		}
	}
	SCOREBOARD.update();
};

YATZY.setup();

YATZY.start();

YATZY.nextRound();

let intervalID = null;
document.addEventListener("keydown", ev => {
	if (ev.key !== " ") return;
	ev.preventDefault();
	if (intervalID !== null) {
		clearInterval(intervalID);
		intervalID = null;
		YATZY.dice.reset();
		return;
	}
	intervalID = setInterval(() => {
		UI.buttons.roll.dispatchEvent(new Event("click"));
		YATZY.dice.forEach(die => {
			if (Math.random() < 0.1) {
				die.disabled = !die.disabled;
			}
		});
	}, 750);
});
