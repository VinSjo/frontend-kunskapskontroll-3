import { YATZY, SCOREBOARD, UI } from "./setup/game.js";
import Player from "./classes/Player.js";

YATZY.players.push(new Player("Player One"), new Player("Player Two"));

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
