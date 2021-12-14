import UI from './ui.js';
import { firstCharToUpper, numberWord } from '../functions/helpers.js';
import Die from '../classes/Die.js';

const MAX_PLAYER_COUNT = 4;

const START_FORM = {
	get fieldsets() {
		return [...UI.startForm.input.container.querySelectorAll('fieldset')];
	},
	get values() {
		return this.fieldsets.map(fieldset => {
			return {
				id: fieldset.getAttribute('id'),
				name: fieldset.querySelector('input').value,
				type: fieldset.querySelector('select').value,
			};
		});
	},
	updateButtons() {
		const playerCount = this.fieldsets.length;
		UI.buttons.form.submit.disabled = playerCount < 1;
		UI.buttons.form.addField.disabled = playerCount >= MAX_PLAYER_COUNT;
	},
	addFieldset() {
		const number = this.fieldsets.length + 1;
		const clone = UI.startForm.input.template.content.cloneNode(true);
		const fieldset = clone.querySelector('fieldset').cloneNode(true);
		const nameInput = fieldset.querySelector('input');
		const typeSelect = fieldset.querySelector('select');

		[fieldset, nameInput, typeSelect].forEach(element => {
			element.setAttribute(
				'id',
				element.getAttribute('id').replace(/[0-9]/g, number)
			);
		});
		const tmpName = `Player ${firstCharToUpper(numberWord(number))}`;
		nameInput.value = tmpName;

		const deleteButton = fieldset.querySelector('button.delete-button');

		deleteButton.addEventListener('click', () => {
			fieldset.innerHTML = null;
			fieldset.remove();
			this.updateButtons();
		});

		nameInput.addEventListener('focus', nameInput.select);
		nameInput.addEventListener('click', nameInput.focus);
		nameInput.addEventListener('change', () => {
			if (nameInput.value.trim().length) return;
			nameInput.value = tmpName;
		});

		UI.startForm.input.container.append(fieldset);
		this.updateButtons();
		nameInput.focus();
	},
	closeAndRemove() {
		const onTransitionEnd = ev => {
			if (!ev.elapsedTime) return;
			UI.startForm.modal.removeEventListener(
				'transitionend',
				onTransitionEnd
			);
			UI.startForm.modal.innerHTML = null;
			UI.startForm.modal.remove();
			UI.main.classList.add('show');
		};
		UI.startForm.modal.addEventListener('transitionend', onTransitionEnd);
		UI.startForm.modal.classList.add('hidden');
	},
};

const PLAYERS = [];

Object.defineProperties(PLAYERS, {
	currentIndex: { value: 0, writable: true },
	currentPlayer: { get: () => PLAYERS[PLAYERS.currentIndex] },
	nextPlayer: {
		value: (onRoundChange = null) => {
			PLAYERS.currentIndex++;
			if (PLAYERS.currentIndex < PLAYERS.length) return;
			PLAYERS.currentIndex = 0;
			if (onRoundChange) return onRoundChange();
		},
	},
});

const GAME = {
	round: 1,
	get finished() {
		return this.round > 15;
	},
};

const DICE = UI.dice.map(element => new Die(element));

export { GAME, PLAYERS, DICE, START_FORM };
