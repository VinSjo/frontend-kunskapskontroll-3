const PLAYERS = [];

Object.defineProperties(PLAYERS, {
	currentIndex: { value: 0, writable: true },
	current: { get: () => PLAYERS[PLAYERS.currentIndex] },
	setNext: {
		value: () => {
			PLAYERS.currentIndex++;
			if (PLAYERS.currentIndex >= PLAYERS.length) {
				PLAYERS.currentIndex = 0;
			}
		},
	},
});

export default PLAYERS;
