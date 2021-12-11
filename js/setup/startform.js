import UI from './ui.js';
import { numberWord } from '../functions/helpers.js';

const STARTFORM = {
	onSubmit: null,
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
	onUpdate() {
		const playerCount = this.fieldsets.length;
		UI.buttons.form.submit.disabled = playerCount < 1;
		UI.buttons.form.addField.disabled = playerCount >= 4;
	},
	addFieldset() {
		const number = this.fieldsets.length + 1;
		const clone = UI.startForm.input.template.content.cloneNode(true);
		const fieldset = clone.querySelector('fieldset').cloneNode(true);

		const nameInput = fieldset.querySelector('input');
		const nameLabel = fieldset.querySelector('.name-label');

		const typeSelect = fieldset.querySelector('select');
		const typeLabel = fieldset.querySelector('.type-label');

		[fieldset, nameInput, typeSelect].forEach(element => {
			element.setAttribute(
				'id',
				element.getAttribute('id').replace(/[0-9]/g, number)
			);
		});

		nameLabel.setAttribute('for', nameInput.getAttribute('id'));
		typeLabel.setAttribute('for', typeSelect.getAttribute('id'));

		nameInput.value = `Player ${numberWord(number)}`;

		const deleteButton = fieldset.querySelector('button.delete-button');
		deleteButton.addEventListener('click', () => {
			fieldset.innerHTML = null;
			fieldset.remove();
			this.onUpdate();
		});

		nameInput.addEventListener('focus', () => nameInput.select);

		UI.startForm.input.container.append(fieldset);
	},
};

UI.buttons.form.addField.addEventListener('click', () => {
	STARTFORM.addFieldset();
	STARTFORM.onUpdate();
});

export default STARTFORM;
