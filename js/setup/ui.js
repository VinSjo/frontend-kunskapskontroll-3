const UI = {
	main: document.querySelector('main'),
	scoreTable: document.querySelector('.score-table'),
	buttons: {
		roll: document.querySelector('button.roll'),
		form: {
			addField: document.querySelector('button.add'),
			submit: document.querySelector('button.names-submit'),
		},
	},
	dice: [...document.querySelectorAll('.dice-icon')],
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
