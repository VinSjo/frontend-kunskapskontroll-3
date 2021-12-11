import UI from './setup/ui.js';
import STARTFORM from './setup/startform.js';
import DICE from './setup/dice.js';
import SCOREBOARD from './setup/scoreboard.js';
import YATZY from './setup/yatzy.js';

import Player from './classes/Player.js';
import ScoreCard from './classes/ScoreCard.js';

STARTFORM.addFieldset();
STARTFORM.onUpdate();

UI.startForm.form.addEventListener('submit', ev => {
	ev.preventDefault();

	const players = STARTFORM.values.map(data => {
		const player = new Player(data.name, data.id);
		player.score = ScoreCard.maxScore;
		player.type = data.type;
		return player;
	});

	YATZY.players.push(...players);

	SCOREBOARD.players = YATZY.players;

	SCOREBOARD.init();

	YATZY.update = () => {
		const player = YATZY.currentPlayer;
		const tmp = new ScoreCard();
		const score = tmp.getDiceScore(DICE.values);
		const maxScore = ScoreCard.maxScore;

		UI.gameInfo.currentRound.textContent = `Round: ${YATZY.round}`;
		UI.gameInfo.currentPlayer.textContent = `Player: ${player.name}`;
		UI.gameInfo.rollsLeft.textContent = `Rolls left: ${YATZY.rollsLeft}`;
		UI.gameInfo.options.innerHTML = null;

		for (const [sectionKey, section] of Object.entries(score)) {
			for (const key of Object.keys(section)) {
				const value = section[key].value;
				const name = section[key].name;
				const maxValue = maxScore[sectionKey][key].value;
				player.score[sectionKey][key].value = value;
				const output = `${name}: ${value} points ( max: ${maxValue})`;
				console.log(output);
				if (value !== 0) {
					const option = document.createElement('li');
					option.textContent = output;
					UI.gameInfo.options.append(option);
				}
			}
		}
		SCOREBOARD.update();
	};

	DICE.forEach(die => {
		die.element.addEventListener('click', () => {
			if (die.animating) return;
			die.setLocked(!die.locked);
			DICE.allLocked
				? (UI.buttons.roll.disabled = true)
				: (UI.buttons.roll.disabled = false);
		});
	});

	UI.buttons.roll.addEventListener('click', async () => {
		if (DICE.animating) return;
		UI.buttons.roll.disabled = true;
		await DICE.roll(true);
		UI.buttons.roll.disabled = false;
		YATZY.rollsLeft--;
		if (YATZY.rollsLeft < 1) {
			YATZY.nextPlayer();
		}
		UI.buttons.roll.disabled = YATZY.rollsLeft < 1;
		YATZY.update();
	});

	const onTransitionEnd = ev => {
		if (!ev.elapsedTime) return;
		UI.startForm.modal.removeEventListener(
			'transitionend',
			onTransitionEnd
		);
		YATZY.update();
		UI.startForm.modal.remove();
		UI.startForm.modal = null;
		UI.main.classList.add('show');
	};

	UI.startForm.modal.addEventListener('transitionend', onTransitionEnd);
	UI.startForm.modal.classList.add('hide');
});

// let intervalID = null;
// document.addEventListener('keydown', ev => {
// 	if (ev.key !== ' ') return;
// 	ev.preventDefault();
// 	if (intervalID !== null) {
// 		clearInterval(intervalID);
// 		intervalID = null;
// 		YATZY.dice.reset();
// 		return;
// 	}
// 	intervalID = setInterval(() => {
// 		UI.buttons.roll.dispatchEvent(new Event('click'));
// 		YATZY.dice.forEach(die => {
// 			if (Math.random() < 0.1) {
// 				die.setLocked(!die.locked);
// 			}
// 		});
// 	}, 750);
// });
