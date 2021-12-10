import DICE from "./dice.js";
import SCOREBOARD from "./scoreboard.js";
import Player from "../modules/Player.js";
import ScoreCard from "../modules/ScoreCard.js";

SCOREBOARD.players = [new Player("Player 1"), new Player("Player 2")];

const PLAYERS = [...SCOREBOARD.players];

const BUTTONS = {
	roll: document.querySelector("button.roll"),
	score: {
		show: document.querySelector("button.score.show"),
		hide: document.querySelector("button.score.hide"),
	},
};

const YATZY = {};

function updateTest() {
	const tmp = new ScoreCard();
	const score = tmp.getDiceScore(DICE.values);
	const player = PLAYERS[0];
	for (const [sectionKey, section] of Object.entries(score)) {
		for (const key of Object.keys(section)) {
			player.score[sectionKey][key].value = section[key].value;
			console.log(`${key}: ${section[key].value}`);
		}
	}
	SCOREBOARD.update();
}

function setup() {
	SCOREBOARD.init();

	BUTTONS.roll.addEventListener("click", async ev => {
		if (DICE.animating) return;
		BUTTONS.roll.disabled = true;

		await DICE.roll(true, 50, 500);

		BUTTONS.roll.disabled = false;
		YATZY.onUpdate && YATZY.onUpdate(ev);
	});

	DICE.forEach(die => {
		die.view.element.addEventListener("click", () => {
			if (die.view.animating) return;
			die.setLocked(!die.locked);
			DICE.allLocked
				? (BUTTONS.roll.disabled = true)
				: (BUTTONS.roll.disabled = false);
		});
	});

	BUTTONS.score.show.addEventListener("click", () => {
		SCOREBOARD.show();
	});
	BUTTONS.score.hide.addEventListener("click", () => {
		SCOREBOARD.hide();
	});
}

YATZY.onUpdate = updateTest;
YATZY.start = setup;

export { YATZY, DICE, PLAYERS, BUTTONS };
