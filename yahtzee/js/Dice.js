import { setElementAttributes } from "./helpers.js";

function diceIcon(value, size = 64) {
	const namespaceURI = "http://www.w3.org/2000/svg";

	const svg = document.createElementNS(namespaceURI, "svg");
	const rect = document.createElementNS(namespaceURI, "rect");
	const dot = document.createElementNS(namespaceURI, "circle");

	const rectRadius = Math.round(size / 8);
	const dotRadius = Math.round(size / 10);

	setElementAttributes(svg, {
		class: "icon dice",
		value: value,
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

	const cPos = (x, y) => ({ cx: x, cy: y });
	const dots = [],
		min = rectRadius + dotRadius,
		mid = size / 2,
		max = size - min;
	value % 2 !== 0 && dots.push(cPos(mid, mid));
	value > 1 && dots.push(cPos(min, max), cPos(max, min));
	value > 3 && dots.push(cPos(min, min), cPos(max, max));
	value === 6 && dots.push(cPos(min, mid), cPos(max, mid));
	svg.append(
		...dots.map(position => setElementAttributes(dot.cloneNode(), position))
	);
	return svg;
}

function createDice(diceCount = 5) {
	return {
		sides: 6,
		count: diceCount,
		_values: [],
		_locked: [],
		get values() {
			return this._values.concat(this._locked);
		},
		get icons() {
			return this.values.map(value => diceIcon(value));
		},
		roll() {
			for (let i = 0; i < this.count - this._locked.length; i++) {
				this._values[i] = Math.ceil(Math.random() * this.sides);
			}
			return this.values;
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
}

export { createDice, diceIcon };
