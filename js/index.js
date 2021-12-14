import UI from './setup/ui.js';
import { GAME, DICE, PLAYERS, START_FORM } from './setup/setup.js';
import ScoreTableCell from './classes/ScoreTableCell.js';
import Player from './classes/Player.js';
import AiPlayer from './classes/AiPlayer.js';

START_FORM.addFieldset();

function resetDice() {
	DICE.forEach(die => {
		die.isLocked = false;
		die.value = 1;
	});
}

function updateRollsLeftText() {
	UI.rollsLeftText.textContent = `Rolls left: ${PLAYERS.currentPlayer.rollsLeft}`;
}

async function updateCurrentPlayer() {
	const player = PLAYERS.currentPlayer;
	player.setCurrent();
	UI.currentPlayerText.textContent = `Current player: ${player.name}`;
	if (player.type !== 'human') {
		await player.automateTurn(UI.buttons.roll);
	}
}

function updateDiceState() {
	const player = PLAYERS.currentPlayer;
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

function onRoundChange() {
	if (GAME.finished) return;
	GAME.round++;
}
/**
 * @param {Player} player
 */
function onCellSelect(player) {
	player.rollsLeft = 3;
	PLAYERS.nextPlayer(onRoundChange);
	resetDice();
	if (GAME.finished) {
		UI.buttons.roll.disabled = true;
		let winner = null;
		PLAYERS.forEach(player => {
			player.displaySum();
			player.displayTotal();
			if (!winner || player.total > winner.total) winner = player;
		});
		winner.setWinner();
		UI.currentPlayerText.textContent = `Winner: ${winner.name}`;
		UI.rollsLeftText.textContent = null;
		return;
	}
	UI.buttons.roll.disabled = false;
	updateCurrentPlayer();
	updateRollsLeftText();
	if (PLAYERS.currentPlayer.type !== 'human') {
		UI.buttons.roll.dispatchEvent(new Event('click'));
	}
}

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
		PLAYERS.push(player);
	});

	UI.buttons.roll.addEventListener('click', async () => {
		const unlockedDice = DICE.filter(die => !die.isLocked);
		if (GAME.finished || !unlockedDice) return;
		UI.buttons.roll.disabled = true;
		const player = PLAYERS.currentPlayer;
		await player.animatedRoll(onCellSelect);
		if (player.rollsLeft >= 1) UI.buttons.roll.disabled = false;
		updateRollsLeftText();
		updateDiceState();
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
			unlockedDice === 0 || PLAYERS.currentPlayer.rollsLeft < 1;
	});
});
