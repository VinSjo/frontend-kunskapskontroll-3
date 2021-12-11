import ScoreCard from '../classes/ScoreCard.js';
import UI from './ui.js';

const SCOREBOARD = {
	players: [],
	update(displayTotal = false) {
		if (!this.players.length) return;
		const rows = UI.scoreBoard.querySelectorAll('tr');

		rows.forEach(row => {
			if (!row.querySelectorAll('td').length) return;

			this.players.forEach(player => {
				const cell = row.querySelector(
					`td[data-player="${player.id}"]`
				);
				if (!cell) return;
				if (row.classList.contains('upper-sum')) {
					return (cell.textContent = player.score.upperSum);
				}
				if (row.classList.contains('bonus')) {
					return (cell.textContent = player.score.bonus);
				}
				if (row.classList.contains('total')) {
					return (cell.textContent = displayTotal
						? player.score.total
						: null);
				}
				const section = row.parentElement.classList.contains('upper')
					? 'upper'
					: 'lower';
				const key = row.getAttribute('data-key');

				cell.textContent = player.score[section][key].value;
			});
		});
	},
	init() {
		if (!this.players.length) return;

		const playerNameRow = UI.scoreBoard.querySelector('thead.players tr');

		this.players.forEach(player => {
			const th = document.createElement('th');
			th.textContent = player.name;
			th.setAttribute('scope', 'col');
			playerNameRow.append(th);
		});
		const createPlayerCells = (textContent = '0') => {
			return this.players.map(player => {
				const td = document.createElement('td');
				td.textContent = textContent;
				td.dataset.player = player.id;
				return td;
			});
		};

		const tmp = new ScoreCard();

		for (const [sectionKey, section] of Object.entries(tmp)) {
			const sectionElement = UI.scoreBoard.querySelector(
				`tbody.${sectionKey}`
			);

			for (const key of Object.keys(section)) {
				if (key === 'bonus') continue;
				const row = document.createElement('tr');
				row.dataset.key = key;
				const nameCell = document.createElement('th');
				nameCell.setAttribute('scope', 'row');
				nameCell.textContent = section[key].name;
				row.append(nameCell);
				row.append(...createPlayerCells());
				sectionElement.append(row);
			}
		}

		const midSection = UI.scoreBoard.querySelector('tbody.sum');

		midSection.querySelector('tr.upper-sum').append(...createPlayerCells());
		midSection.querySelector('tr.bonus').append(...createPlayerCells());

		const total = UI.scoreBoard.querySelector('tr.total');
		total.append(...createPlayerCells(''));

		UI.scoreBoard.classList.add('show');
	},
};

export default SCOREBOARD;
