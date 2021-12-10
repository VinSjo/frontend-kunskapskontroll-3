import DICE from "./dice.js";
import SCOREBOARD from "./scoreboard.js";
import UI from "./ui.js";
import PLAYERS from "./players.js";
import ScoreCard from "../classes/ScoreCard.js";

const YATZY = {
	players: PLAYERS,
	dice: DICE,
	start() {
		if (!this.players.length) return;
		console.log(`Current Player: ${this.players.current.name}`);
		console.log("Bamboozled... this isn't playable yet!");
	},
	nextRound() {
		this.players.setNext();
		console.log(`Current Player: ${this.players.current.name}`);
	},
	setup() {
		SCOREBOARD.players = this.players;
		SCOREBOARD.init();

		this.dice.forEach(die => {
			die.element.addEventListener("click", () => {
				if (die.animating) return;
				die.setLocked(!die.locked);
				this.dice.allLocked
					? (UI.buttons.roll.disabled = true)
					: (UI.buttons.roll.disabled = false);
			});
		});

		UI.buttons.roll.addEventListener("click", async () => {
			if (this.dice.animating) return;
			UI.buttons.roll.disabled = true;
			await this.dice.roll(true);
			UI.buttons.roll.disabled = false;
			this.onRollEnd();
		});
	},
	onRollEnd() {
		if (!this.players.length) return;
		UI.optionList.innerHTML = null;
		const tmp = new ScoreCard();
		const score = tmp.getDiceScore(this.dice.values);
		const player = this.players.current;
		for (const [sectionKey, section] of Object.entries(score)) {
			for (const key of Object.keys(section)) {
				const value = section[key].value;
				const name = section[key].name;
				player.score[sectionKey][key].value = value;
				const output = `${name}: ${value} points`;
				console.log(output);
				// if (value !== 0) {
				// 	const option = document.createElement("li");
				// 	option.textContent = output;
				// 	UI.optionList.append(option);
				// }
			}
		}
		SCOREBOARD.update();
	},
};

export { YATZY, SCOREBOARD, UI };
