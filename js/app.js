import { YATZY, DICE, BUTTONS } from "./setup/yatzy.js";

YATZY.start();

let intervalID = null;
document.addEventListener("keydown", ev => {
	if (ev.key !== " ") return;
	ev.preventDefault();
	if (intervalID !== null) {
		clearInterval(intervalID);
		intervalID = null;
		DICE.reset();
		return;
	}
	intervalID = setInterval(() => {
		BUTTONS.roll.dispatchEvent(new Event("click"));
		DICE.forEach(die => {
			if (Math.random() < 0.1) {
				die.disabled = !die.disabled;
			}
		});
	}, 750);
});
