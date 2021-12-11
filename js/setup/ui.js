const UI = {
	main: document.querySelector('main'),
	scoreBoard: document.querySelector('.score-board'),
	buttons: {
		roll: document.querySelector('button.roll'),
		form: {
			addField: document.querySelector('button.add'),
			submit: document.querySelector('button.names-submit'),
		},
	},
	dice: {
		elements: [...document.querySelectorAll('.dice-icon')],
		container: document.querySelector('.dice-container'),
	},
	gameInfo: {
		container: document.querySelector('.game-info'),
		currentPlayer: document.querySelector('.game-info .current-player'),
		currentRound: document.querySelector('.game-info .current-round'),
		rollsLeft: document.querySelector('.game-info .rolls-left'),
		options: document.querySelector('.game-info .options'),
	},
	startForm: {
		modal: document.querySelector('.start-modal'),
		form: document.querySelector('.player-form'),
		input: {
			container: document.querySelector('.player-form .input-container'),
			template: document.querySelector('template#player-fieldset'),
		},
	},
};

export default UI;
