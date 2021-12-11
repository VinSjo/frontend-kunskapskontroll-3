export default class Die {
	constructor(element) {
		this.element = element;
		this.dots = [...element.querySelectorAll('.dice-dot')];
		this.value = 1;
		this.locked = false;
		this.animating = false;
	}
	get newValue() {
		return Math.ceil(Math.random() * 6);
	}
	setValue(value) {
		if (this.locked) return;
		if (typeof value !== 'number' || Number.isNaN(value)) return;
		if (value % 1 !== 0) value = Math.round(value);
		if (value < 1 || value > 6) value = Math.max(Math.min(value, 6), 1);
		this.value = value;
		this.updateView();
	}
	setLocked(locked) {
		this.locked = !!locked;
		if (!this.element) return;
		if (this.locked) {
			this.element.classList.add('locked');
			this.element.setAttribute('title', 'Unlock Dice');
			return;
		}
		this.element.classList.remove('locked');
		this.element.setAttribute('title', 'Lock Dice');
	}

	roll() {
		if (this.locked) return this.value;
		this.setValue(Math.ceil(Math.random() * 6));
		return this.value;
	}

	async animatedRoll(interval = 100, duration = 500) {
		if (this.locked || !this.element) return this.value;
		const randomOffset = max => {
			return Math.round(Math.random() * max * 2) - max;
		};
		this.animating = true;
		this.element.style.transition = `transform ${interval * 0.5}ms linear`;
		let intervalID = setInterval(async () => {
			const x = randomOffset(4),
				y = randomOffset(4),
				deg = randomOffset(8);
			this.element.style.transform = `translate(${x}px,${y}px) rotate(${deg}deg)`;
			this.roll();
		}, interval);

		return await new Promise(resolve =>
			setTimeout(() => {
				clearInterval(intervalID);
				this.element.style.transform = null;
				this.element.style.transition = null;
				this.animating = false;
				resolve(this.roll());
			}, duration)
		);
	}

	updateView() {
		if (!this.element) return;
		this.element.dataset.value = this.value;
		const visibleDots = [];
		if (this.value % 2 !== 0) visibleDots.push(3);
		if (this.value > 1) visibleDots.push(1, 5);
		if (this.value > 3) visibleDots.push(0, 6);
		if (this.value === 6) visibleDots.push(2, 4);
		this.dots.forEach((dot, index) => {
			visibleDots.includes(index)
				? (dot.style.opacity = 1)
				: (dot.style.opacity = 0);
		});
	}
}
