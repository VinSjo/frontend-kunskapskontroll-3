import DICE from "./setup/dice.js";
import SCOREBOARD from "./setup/scoreboard.js";
import UI from "./setup/ui.js";
import PLAYERS from "./setup/players.js";

const YATZY = {
	players: PLAYERS,
	dice: DICE,
	onUpdate: 0,
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
			die.view.element.addEventListener("click", () => {
				if (die.view.animating) return;
				die.setLocked(!die.locked);
				this.dice.allLocked
					? (UI.buttons.roll.disabled = true)
					: (UI.buttons.roll.disabled = false);
			});
		});

		UI.buttons.roll.addEventListener("click", async ev => {
			if (this.dice.animating) return;
			UI.buttons.roll.disabled = true;

			await this.dice.roll(true, 100, 500);

			UI.buttons.roll.disabled = false;
			this.onUpdate && this.onUpdate(ev);
		});

		UI.scoreBoard.buttons.show.addEventListener("click", () => {
			SCOREBOARD.show();
		});
		UI.scoreBoard.buttons.hide.addEventListener("click", () => {
			SCOREBOARD.hide();
		});
	},
};

export { YATZY, SCOREBOARD, UI };
