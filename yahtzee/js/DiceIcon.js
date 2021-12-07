import { setElementAttributes } from "./helpers.js";

export default class DiceIcon {
	constructor(size = 64) {
		const namespaceURI = "http://www.w3.org/2000/svg";

		const rectRadius = Math.round(size / 8);
		const dotRadius = Math.round(size / 10);

		this.element = document.createElementNS(namespaceURI, "svg");
		this.rect = document.createElementNS(namespaceURI, "rect");

		const dot = document.createElementNS(namespaceURI, "circle");

		setElementAttributes(this.element, {
			class: "icon dice",
			width: size,
			height: size,
			viewBox: `0 0 ${size} ${size}`,
			fill: "none",
		});
		setElementAttributes(this.rect, {
			width: size,
			height: size,
			rx: rectRadius,
		});
		setElementAttributes(dot, {
			r: dotRadius,
		});
		this.element.append(this.rect);
		this.dots = [];

		const min = rectRadius + dotRadius,
			mid = size / 2,
			max = size - min;
		for (let i = 0; i < 7; i++) {
			const x = i === 0 || i === 2 || i === 5 ? min : i === 3 ? mid : max;
			const y = i === 0 || i === 1 ? min : i === 3 ? mid : max;
			this.dots.push(
				setElementAttributes(dot.cloneNode(), { cx: x, cy: y })
			);
		}
		this.element.append(...this.dots);
	}

	get dotIndexes() {
		return {
			top: { left: 0, right: 1 },
			mid: { left: 2, mid: 3, right: 4 },
			bottom: { left: 5, right: 6 },
		};
	}

	displayValue(value) {
		this.element.setAttribute("value", `${value}`);
		const dotIndexes = this.dotIndexes;
		const showIndexes = [];
		if (value % 2 !== 0) {
			showIndexes.push(dotIndexes.mid.mid);
		}
		if (value > 1) {
			showIndexes.push(dotIndexes.bottom.left, dotIndexes.top.right);
		}
		if (value > 3) {
			showIndexes.push(dotIndexes.top.left, dotIndexes.bottom.right);
		}
		if (value === 6) {
			showIndexes.push(dotIndexes.mid.left, dotIndexes.mid.right);
		}
		this.dots.forEach((dot, i) => {
			if (showIndexes.includes(i)) return dot.classList.add("show");
			dot.classList.remove("show");
		});
	}
	show() {
		this.element.classList.add("show");
	}
	hide() {
		this.element.classList.remove("show");
	}
	disable() {
		this.element.classList.add("disabled");
	}
	enable() {
		this.element.classList.remove("disabled");
	}
}
