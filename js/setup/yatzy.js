const YATZY = {
	round: 1,
	rollsLeft: 3,
	players: [],
	playerIndex: 0,
	get currentPlayer() {
		return this.players[this.playerIndex];
	},
	nextPlayer() {
		this.playerIndex++;
		if (this.playerIndex >= this.players.length) {
			this.round++;
			this.playerIndex = 0;
		}
		this.rollsLeft = 3;
		this.update();
	},
	update: () => {},
};

export default YATZY;
