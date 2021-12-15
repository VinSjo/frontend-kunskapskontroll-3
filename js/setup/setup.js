import UI from './ui.js';
import { firstCharToUpper, numberWord } from '../functions/helpers.js';
import Die from '../classes/Die.js';
import Player from '../classes/Player.js';
import AiPlayer from '../classes/AiPlayer.js';

//#region START_FORM

/**
 * START_FORM contains methods and properties to handle player input in the
 * form that starts the game and other elements related to it
 * @see {@link UI.startForm}
 * @see {@link UI.buttons.form}
 */
const START_FORM = {
	maxPlayerCount: 5,
	/**
	 * @property {HTMLFieldSetElement[]} fieldsets - gets current fieldsets in form
	 */
	get fieldsets() {
		return [...UI.startForm.input.container.querySelectorAll('fieldset')];
	},
	/**
	 * @property {Object} values - gets current values in current form fieldsets
	 */
	get values() {
		return this.fieldsets.map(fieldset => {
			return {
				id: fieldset.getAttribute('id'),
				name: fieldset.querySelector('input').value,
				type: fieldset.querySelector('select').value,
			};
		});
	},
	/**
	 * @method {void} updateButtons - updates disabled attribute of the form
	 * buttons based on current amount of fieldsets in form
	 * @see {@link UI.buttons.form}
	 */
	updateButtons() {
		const playerCount = this.fieldsets.length;
		UI.buttons.form.submit.disabled = playerCount < 1;
		UI.buttons.form.addField.disabled = playerCount >= this.maxPlayerCount;
	},
	/**
	 * @method {void} addFieldset - clones a fieldset from a fieldset-template and
	 * adds it to form
	 * @see {@link UI.startForm.input.template}
	 */
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
	/**
	 * @method {void} closeAndRemove - "closes" modal by adding className
	 * "closed" to it which activates a css-transition, then removes it and
	 * shows the document's main-element by adding className "show"
	 *
	 * @see {@link UI.startForm.modal}
	 * @see {@link UI.main}
	 */
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
		UI.startForm.modal.classList.add('closed');
	},
};
//#endregion

/**
 * PLAYERS holds all Players in the game
 * @see {@link Player}
 * @see {@link AiPlayer}
 */
const PLAYERS = [];

/*
Defines some custom properties on PLAYER to make tracking and updating of 
current player easier
*/
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

/**
 * Holds the current game round and players
 * @see {@link Player}
 * @see {@link AiPlayer}
 */
const GAME = {
	players: [],
	playerIndex: 0,
	round: 1,
	get currentPlayer() {
		return this.players[this.playerIndex];
	},
	get finished() {
		return this.round > 15;
	},
	nextPlayer() {
		if (this.finished) return;
		this.playerIndex++;
		if (this.playerIndex < this.players.length) return;
		this.playerIndex = 0;
		this.round++;
	},
};

/**
 * Array that holds all Die-objects,
 * which includes their corresponding SVG-elements,
 * that is used in the game.
 * @see {@link Die}
 */
const DICE = UI.dice.map(element => new Die(element));

export { GAME, DICE, START_FORM };
