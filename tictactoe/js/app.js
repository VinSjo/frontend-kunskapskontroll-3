import Player from "./Player.js";
const playerNameList = document.querySelector(".player-list");

const symbolTemplates = {
	circle: document.querySelector("template#circle"),
	cross: document.querySelector("template#cross"),
};

const grid = {
	size: 3,
	cells: [],
	container: document.querySelector(".game-grid"),

	getRows(cellCallback = null) {
		const rows = [];
		for (let y = 0; y < this.size; y++) {
			const row = [];
			for (let x = 0; x < this.size; x++) {
				const cell = this.cells[y * this.size + x];
				row.push(cellCallback ? cellCallback(cell) : cell);
			}
			rows.push(row);
		}
		return rows;
	},
	getCols(cellCallback = null) {
		const cols = [];
		for (let x = 0; x < this.size; x++) {
			const col = [];
			for (let y = 0; y < this.size; y++) {
				const cell = this.cells[y * this.size + x];
				col.push(cellCallback ? cellCallback(cell) : cell);
			}
			cols.push(col);
		}
		return cols;
	},
	getDiagonals(cellCallback = null) {
		const diagonals = [[], []];
		for (
			let x = 0, y1 = 0, y2 = this.size - 1;
			x < this.size, y1 < this.size, y2 >= 0;
			x++, y1++, y2--
		) {
			const i1 = x * this.size + y1,
				i2 = x * this.size + y2;
			const cell1 = this.cells[i1],
				cell2 = this.cells[i2];
			if (!cellCallback) {
				diagonals[0].push(cell1);
				diagonals[1].push(cell2);
				continue;
			}
			diagonals[0].push(cellCallback(cell1));
			diagonals[1].push(cellCallback(cell2));
		}
		return diagonals;
	},
	get cellsLeft() {
		return this.cells.filter(cell => !cell.classList.contains("disabled"))
			.length;
	},
	initCells() {
		while (this.cells.length < Math.pow(this.size, 2)) {
			const cell = document.createElement("div");
			cell.classList.add("grid-cell");
			this.container.append(cell);
			this.cells.push(cell);
		}
	},
	addEventListeners(eventType, eventHandler) {
		this.cells.forEach(cell => {
			cell.addEventListener(eventType, eventHandler);
		});
	},
	gameOver() {
		this.cells.forEach(cell => {
			cell.classList.add("disabled");
		});
		while (this.cells.length) {
			this.cells.pop();
		}
	},
};

const players = {
	isPlaying: true,
	one: new Player(
		"Player One",
		"blue",
		"circle",
		symbolTemplates.circle,
		playerNameList
	),
	two: new Player(
		"Player Two",
		"red",
		"cross",
		symbolTemplates.cross,
		playerNameList
	),
	_currentPlayer: null,
	get current() {
		if (this._currentPlayer === null) this._currentPlayer = this.one;
		return this._currentPlayer;
	},
	next() {
		if (!this.isPlaying) return;
		const current = this.current;
		this._currentPlayer = current === this.one ? this.two : this.one;
		this.updateOutput();
	},
	updateOutput() {
		if (!this.isPlaying) return;
		this.current.output.classList.add("current");
		const notCurrent = this.current === this.one ? this.two : this.one;
		notCurrent.output.classList.remove("current");
	},
	gameOver() {
		this.one.output.classList.remove("current");
		this.two.output.classList.remove("current");
		this.isPlaying = false;
	},
};

function getWinner() {
	const cellCallback = cell => {
		const symbol = cell.querySelector("svg");
		const classList = symbol ? symbol.classList : null;
		if (!symbol || !classList) return null;
		return [...classList].reduce((result, current) => {
			return current === "circle" || current === "cross"
				? current
				: result;
		}, null);
	};

	const directionMatch = direction => {
		for (const line of direction) {
			const match = line.reduce((value, current) => {
				return value === current && value !== null ? value : null;
			});
			if (match) return match;
		}
		return false;
	};

	const getSymbolMatch = () => {
		const rowMatch = directionMatch(grid.getRows(cellCallback));
		if (rowMatch) return rowMatch;
		const colMatch = directionMatch(grid.getCols(cellCallback));
		if (colMatch) return colMatch;
		return directionMatch(grid.getDiagonals(cellCallback));
	};

	const winningSymbol = getSymbolMatch();
	if (!winningSymbol) return false;
	return winningSymbol === players.one.symbolName ? players.one : players.two;
}

grid.initCells();
players.updateOutput();

grid.addEventListeners("click", ev => {
	const cell = ev.target;
	if (cell.classList.contains("disabled")) return;
	cell.append(players.current.symbol);
	setTimeout(() => {
		cell.classList.add("disabled");
	}, 0);

	const winner = getWinner();
	if (grid.cellsLeft === 0 || winner) {
		if (winner) {
			console.log("Winner is: " + winner.name + " :)");
			winner.output.classList.add("winner");
			winner.output.textContent += " is the winner!!!";
		} else {
			console.log("No one wins :(");
		}
		grid.gameOver();
		players.gameOver();
		return;
	}
	players.next();
});
