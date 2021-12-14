const UI = {
	main: document.querySelector('main'),
	scoreTable: document.querySelector('.score-table'),
	dice: [...document.querySelectorAll('.dice-icon')],
	rollsLeftText: document.querySelector('.rolls-left'),
	currentPlayerText: document.querySelector('.current-player'),
	startForm: {
		modal: document.querySelector('.start-modal'),
		form: document.querySelector('.player-form'),
		input: {
			container: document.querySelector('.player-form .input-container'),
			template: document.querySelector('template#player-fieldset'),
		},
	},
	buttons: {
		roll: document.querySelector('button.roll'),
		form: {
			addField: document.querySelector('button.add'),
			submit: document.querySelector('button.names-submit'),
		},
	},
};

export default UI;
