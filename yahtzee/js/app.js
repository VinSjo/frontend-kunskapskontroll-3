import { game } from "./setup.js";
game.init();

let intervalID = null;
document.addEventListener("keydown", ev => {
	if (ev.key !== " ") return;
	if (intervalID !== null) {
		clearInterval(intervalID);
		intervalID = null;
		game.dice.reset();
		return;
	}
	intervalID = setInterval(() => {
		game.dice.roll();
		game.dice.forEach(dice => {
			if (Math.random() < 0.1) {
				dice.disabled = !dice.disabled;
			}
		});
	}, 200);
});
