/*
This file is the entry-point to the program, which imports everything needed
and activates event-listeners that handles the game-flow
*/

import UI from './setup/ui.js';
import { GAME, DICE, START_FORM } from './setup/setup.js';
import ScoreTableCell from './classes/ScoreTableCell.js';
import Player from './classes/Player.js';
import AiPlayer from './classes/AiPlayer.js';
import Die from './classes/Die.js';

START_FORM.addFieldset();

//#region EVENT LISTENERS

UI.buttons.form.addField.addEventListener('click', () => {
	START_FORM.addFieldset();
});

UI.startForm.form.addEventListener('submit', ev => {
	ev.preventDefault();
	const rows = UI.scoreTable.querySelectorAll('tr');
	START_FORM.values.forEach(set => {
		const tableColumn = [];
		rows.forEach(row => {
			const sectionName = row.parentElement.classList[0];
			const rowName = row.classList[0];
			const td = document.createElement('td');
			td.classList.add(set.id);
			if (rowName === 'player-names') {
				td.textContent = set.name;
			}
			tableColumn.push(
				new ScoreTableCell(td, rowName, sectionName, set.id)
			);
			row.append(td);
		});
		const player =
			set.type === 'human'
				? new Player(set.id, set.name, tableColumn, DICE)
				: new AiPlayer(set.id, set.name, tableColumn, DICE);
		GAME.players.push(player);
	});

	UI.buttons.roll.addEventListener('click', async () => {
		if (GAME.currentPlayer.type !== 'human') return;
		await onRollClick();
	});
	document.addEventListener('keydown', ev => {
		if (ev.key !== ' ') return;
		UI.buttons.roll.dispatchEvent(new Event('click'));
	});
	START_FORM.closeAndRemove();
	updateCurrentPlayer();
	updateDiceState();
	resetDice();
});

DICE.forEach(die => {
	die.element.addEventListener('click', () => {
		if (die.element.classList.contains('disabled')) return;
		die.isLocked = !die.isLocked;
		const unlockedDice = DICE.filter(die => !die.unlocked).length;
		UI.buttons.roll.disabled =
			unlockedDice === 0 || GAME.currentPlayer.rollsLeft < 1;
	});
});

//#endregion

//#region FUNCTIONS

function resetDice() {
	DICE.forEach(die => {
		die.isLocked = false;
		die.value = 1;
	});
}

function updateRollsLeftText() {
	UI.rollsLeftText.textContent = `Rolls left: ${GAME.currentPlayer.rollsLeft}`;
}

/**
 * Called when player is changed
 *
 * async because AiPlayer.automateTurn is async in order to enable animations
 * and limit the speed
 * @see {@link AiPlayer.automateTurn}
 */
async function updateCurrentPlayer() {
	const player = GAME.currentPlayer;
	player.setCurrent();
	UI.currentPlayerText.textContent = `Current: ${player.name}`;
	if (player.type !== 'human') {
		await player.automateTurn(onRollClick, onCellSelect);
	}
}

/**
 * Update state of dice based on rollsLeft and if GAME.finished is true
 *
 * @see {@link Die.isLocked}
 * @see {@link GAME.finished}
 */
function updateDiceState() {
	const player = GAME.currentPlayer;
	const gameOver = GAME.finished;
	DICE.forEach(die => {
		if (gameOver || player.rollsLeft >= 3) {
			die.isLocked = false;
			die.element.classList.add('disabled');
			return;
		}
		die.element.classList.remove('disabled');
	});
}

/**
 * Function that runs when roll-button is clicked, or as a callback when
 * AiPlayer.automateTurn runs
 *
 * async in order to wait for Player.animatedRoll to complete
 *
 * @see {@link Player.animatedRoll}
 * @see {@link AiPlayer.automateTurn}
 */
async function onRollClick() {
	const unlockedDice = DICE.filter(die => !die.isLocked);
	if (GAME.finished || !unlockedDice.length) return;
	UI.buttons.roll.disabled = true;
	const player = GAME.currentPlayer;
	await player.animatedRoll(onCellSelect);
	if (player.rollsLeft >= 1) UI.buttons.roll.disabled = false;
	updateRollsLeftText();
	updateDiceState();
}

/**
 * Function that runs when player selects a cell in score-table
 *
 * @param {Player} player
 *
 * @see {@link Player}
 * @see {@link ScoreTableCell}
 * @see {@link UI.scoreTable}
 */
function onCellSelect(player) {
	player.rollsLeft = 3;
	GAME.nextPlayer();
	resetDice();
	if (GAME.finished) {
		UI.buttons.roll.disabled = true;
		GAME.players.sort((previous, current) => {
			const prevScore = previous.score.total;
			const currScore = current.score.total;
			return prevScore === currScore ? 0 : prevScore < currScore ? 1 : -1;
		});
		const winners = [];
		GAME.players.forEach((player, i) => {
			player.displaySum();
			player.displayTotal();
			if (i === 0 || player.score.total === GAME.players[0].score.total) {
				player.setWinner();
				winners.push(player.name);
			}
		});
		UI.currentPlayerText.textContent =
			(winners.length > 1 ? 'Winners: ' : 'Winner: ') +
			winners.join(', ');
		return;
	}
	UI.buttons.roll.disabled = false;
	updateCurrentPlayer();
	updateRollsLeftText();
}

//#endregion
