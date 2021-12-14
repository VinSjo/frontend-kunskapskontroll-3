import UI from './setup/ui.js';
import { GAME, DICE, PLAYERS, START_FORM } from './setup/setup.js';
import PlayerScoreCell from './classes/PlayerScoreCell.js';
import Player from './classes/Player.js';

START_FORM.addFieldset();

function onRoundChange() {
	if (GAME.finished) return;
	GAME.round++;
}

function onCellSelect(player) {
	PLAYERS.nextPlayer(onRoundChange);
	DICE.reset();
	if (GAME.finished) {
		UI.buttons.roll.disabled = true;
		let winner = null;
		PLAYERS.forEach(player => {
			player.displaySum();
			player.displayTotal();
			if (!winner || player.total > winner.total) winner = player;
		});
		winner.setWinner();
		console.log('Winner: ' + winner.name);
		return;
	}
	PLAYERS.currentPlayer.setCurrent();
	UI.buttons.roll.disabled = false;
	player.rollsLeft = 3;
}

UI.buttons.form.addField.addEventListener('click', () => {
	START_FORM.addFieldset();
});

UI.startForm.form.addEventListener('submit', ev => {
	ev.preventDefault();
	const rows = UI.scoreTable.querySelectorAll('tr');
	START_FORM.data.forEach(player => {
		const tableColumn = [];
		rows.forEach(row => {
			const sectionName = row.parentElement.classList[0];
			const rowName = row.classList[0];
			const td = document.createElement('td');
			td.classList.add(player.id);
			if (rowName === 'player-names') {
				td.textContent = player.name;
			}
			tableColumn.push(
				new PlayerScoreCell(td, rowName, sectionName, player.id)
			);
			row.append(td);
		});
		PLAYERS.push(new Player(player.id, player.name, tableColumn, DICE));
	});

	UI.buttons.roll.addEventListener('click', async () => {
		if (GAME.finished) return;
		UI.buttons.roll.disabled = true;
		const player = PLAYERS.currentPlayer;
		await player.roll(onCellSelect);
		if (player.rollsLeft >= 1) UI.buttons.roll.disabled = false;
		console.log('rollsLeft: ' + player.rollsLeft);
	});

	START_FORM.closeAndRemove();
	PLAYERS.currentPlayer.setCurrent();
});

DICE.forEach(die => {
	die.element.addEventListener('click', () => {
		if (PLAYERS.currentPlayer.rollsLeft >= 3 && !die.isLocked) return;
		die.isLocked = !die.isLocked;
		UI.buttons.roll.disabled =
			DICE.unlocked.length === 0 && PLAYERS.currentPlayer.rollsLeft >= 1;
	});
});
