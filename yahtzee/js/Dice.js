import { setElementAttributes } from "./helpers.js";

function createDiceIcon(size = 64) {
	const namespaceURI = "http://www.w3.org/2000/svg";

	const svg = document.createElementNS(namespaceURI, "svg");
	const rect = document.createElementNS(namespaceURI, "rect");
	const dot = document.createElementNS(namespaceURI, "circle");

	const rectRadius = Math.round(size / 8);
	const dotRadius = Math.round(size / 10);

	setElementAttributes(svg, {
		class: "icon dice",
		width: size,
		height: size,
		viewBox: `0 0 ${size} ${size}`,
		fill: "none",
	});

	setElementAttributes(rect, {
		width: size,
		height: size,
		rx: rectRadius,
	});

	setElementAttributes(dot, {
		cx: size / 2,
		cy: size / 2,
		r: dotRadius,
	});

	svg.append(rect);

	const min = rectRadius + dotRadius,
		mid = size / 2,
		max = size - min;

	const dots = [];

	for (let i = 0; i < 7; i++) {
		const clone = dot.cloneNode();
		if (i !== 0) {
			setElementAttributes(clone, {
				cx: i % 2 !== 0 ? min : max,
				cy: i === 1 || i === 4 ? max : i === 2 || i === 3 ? min : mid,
			});
		}
		dots.push(clone);
	}
	svg.append(...dots);

	return {
		get element() {
			return svg;
		},
		update(value) {
			if (typeof value !== "number" || Number.isNaN(value)) return;
			if (value < 1 || value > 6) {
				svg.setAttribute("value", "0");
				rect.classList.remove("show");
				dots.forEach(dot => dot.classList.remove("show"));
				return;
			}
			svg.setAttribute("value", `${value}`);
			rect.classList.add("show");
			const show = [
				value % 2 !== 0,
				value > 1,
				value > 1,
				value > 3,
				value > 3,
				value === 6,
				value === 6,
			];
			dots.forEach((dot, index) => {
				show[index]
					? dot.classList.add("show")
					: dot.classList.remove("show");
			});
		},
	};
}

function createDice(diceCount = 5) {
	const dice = {
		count: diceCount,
		_values: [],
		_locked: [],
		_icons: [],
		get values() {
			return this._values.concat(this._locked);
		},
		get icons() {
			return this._icons.map(icon => icon.element);
		},
		roll() {
			for (let i = 0; i < this.count - this._locked.length; i++) {
				this._values[i] = Math.ceil(Math.random() * 6);
			}
			return this.values;
		},
		update() {
			const values = this.values;
			this._icons.forEach((icon, i) => {
				const value = values[i] || 0;
				icon.update(value);
			});
		},
		reset() {
			this._values = [];
			this._locked = [];
		},
		lock(index) {
			if (index >= this._values.length) return;
			this._locked.push(this._values.splice(index, 1));
		},
	};
	while (dice._icons.length < diceCount) dice._icons.push(createDiceIcon());
	return dice;
}

export { createDice, createDiceIcon };
