import { ScoreCardTemplate } from "../modules/ScoreCard.js";

const scoreBoardContainer = document.querySelector(".score.container");
const scoreBoardTable = document.querySelector("table.score");
/**
 * @property {HTMLTableElement} table
 * @property {Player[]} players,
 */
const SCOREBOARD = {
	table: scoreBoardTable,
	container: scoreBoardContainer,
	players: [],
	show() {
		this.container.classList.add("show");
	},
	hide() {
		this.container.classList.remove("show");
	},
	update() {
		if (!this.players.length) return;
		const rows = this.table.querySelectorAll("tr");
		rows.forEach(row => {
			if (!row.querySelectorAll("td").length) return;
			this.players.forEach(player => {
				const cell = row.querySelector(
					`td[data-player="${player.id}"]`
				);
				if (!cell) return;
				if (row.classList.contains("upper-sum")) {
					return (cell.textContent = player.score.upperSum);
				}
				if (row.classList.contains("bonus")) {
					return (cell.textContent = player.score.bonus);
				}
				if (row.classList.contains("total")) {
					return (cell.textContent = player.total);
				}
				const key = row.getAttribute("data-key");
				cell.textContent = player.score[key];
			});
		});
	},
	init() {
		if (!this.players.length) return;
		const playerNameRow = this.table.querySelector("thead.players tr");
		this.players.forEach(player => {
			const th = document.createElement("th");
			th.textContent = player.name;
			th.setAttribute("scope", "col");
			playerNameRow.append(th);
		});
		const createPlayerCells = () => {
			return this.players.map(player => {
				const td = document.createElement("td");
				td.textContent = `0`;
				td.dataset.player = player.id;
				return td;
			});
		};

		const tmp = new ScoreCardTemplate();

		for (const [sectionKey, section] of Object.entries(tmp)) {
			const sectionElement = this.table.querySelector(
				`tbody.${sectionKey}`
			);

			for (const key of Object.keys(section)) {
				if (key === "bonus") continue;
				const row = document.createElement("tr");
				row.dataset.key = key;
				const nameCell = document.createElement("th");
				nameCell.setAttribute("class", "name");
				nameCell.setAttribute("scope", "row");
				nameCell.textContent = section[key].name;
				row.append(nameCell);
				row.append(...createPlayerCells());
				sectionElement.append(row);
			}
		}
		const midSection = this.table.querySelector("tbody.sum");

		midSection.querySelector("tr.upper-sum").append(...createPlayerCells());
		midSection.querySelector("tr.bonus").append(...createPlayerCells());

		const total = this.table.querySelector("tr.total");
		total.append(...createPlayerCells());
	},
};

export default SCOREBOARD;
