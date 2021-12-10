import { YATZY, SCOREBOARD, UI } from "./yatzy.js";
import Player from "./modules/Player.js";
import ScoreCard from "./modules/ScoreCard.js";

YATZY.players.push(new Player("Player One"), new Player("Player Two"));

YATZY.onUpdate = () => {
	if (!YATZY.players.length) return;
	UI.optionList.innerHTML = null;
	const tmp = new ScoreCard();
	const score = tmp.getDiceScore(YATZY.dice.values);
	const player = YATZY.players.current;
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
