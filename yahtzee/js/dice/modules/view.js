import { setElementAttributes } from "../../helpers.js";

export default class DiceView {
	constructor() {
		const size = 64;
		const strokeWidth = 2;
		const namespaceURI = "http://www.w3.org/2000/svg";
		const attributes = {
			svg: {
				class: "icon dice",
				width: size,
				height: size,
				viewBox: `0 0 ${size} ${size}`,
				fill: "none",
			},
			rect: {
				x: strokeWidth,
				y: strokeWidth,
				width: size - 2 * strokeWidth,
				height: size - 2 * strokeWidth,
				"stroke-width": strokeWidth,
				rx: 8,
			},
			dot: {
				r: 6.5,
			},
		};
		const positions = {
			min: attributes.rect.rx + attributes.dot.r,
			mid: size / 2,
			max: size - (attributes.rect.rx + attributes.dot.r),
			get dots() {
				return [
					{ cx: this.min, cy: this.min },
					{ cx: this.max, cy: this.min },
					{ cx: this.min, cy: this.mid },
					{ cx: this.mid, cy: this.mid },
					{ cx: this.max, cy: this.mid },
					{ cx: this.min, cy: this.max },
					{ cx: this.max, cy: this.max },
				];
			},
		};
		const svg = document.createElementNS(namespaceURI, "svg");
		const rect = document.createElementNS(namespaceURI, "rect");
		const dot = document.createElementNS(namespaceURI, "circle");
		setElementAttributes(svg, attributes.svg);
		setElementAttributes(rect, attributes.rect);
		setElementAttributes(dot, attributes.dot);
		svg.append(rect);

		const dots = positions.dots.map(position =>
			setElementAttributes(dot.cloneNode(), position)
		);
		svg.append(...dots);
		this.element = svg;
		this.dots = dots;
	}
	get value() {
		return parseInt(this.element.getAttribute("value"));
	}
	set value(value) {
		if (typeof value !== "number" || Number.isNaN(value)) return;
		this.element.setAttribute("value", `${value}`);
		this.element.classList.add("show");
		const dotIndexes = [];
		if (value % 2 !== 0) dotIndexes.push(3);
		if (value > 1) dotIndexes.push(1, 5);
		if (value > 3) dotIndexes.push(0, 6);
		if (value === 6) dotIndexes.push(2, 4);
		this.dots.forEach((dot, i) => {
			dotIndexes.includes(i)
				? dot.classList.add("show")
				: dot.classList.remove("show");
		});
	}
}
