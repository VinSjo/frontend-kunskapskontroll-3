import { setElementAttributes } from "../helpers.js";

export default class DiceIcon {
	constructor() {
		const size = 64;
		const namespaceURI = "http://www.w3.org/2000/svg";
		const strokeWidth = 2;
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

		this.element = setElementAttributes(
			document.createElementNS(namespaceURI, "svg"),
			attributes.svg
		);
		this.rect = setElementAttributes(
			document.createElementNS(namespaceURI, "rect"),
			attributes.rect
		);
		const dot = setElementAttributes(
			document.createElementNS(namespaceURI, "circle"),
			attributes.dot
		);
		this.element.append(this.rect);

		const min = attributes.rect.rx + attributes.dot.r,
			mid = size / 2,
			max = size - min;

		const dotPositions = [
			{ cx: min, cy: min },
			{ cx: max, cy: min },
			{ cx: min, cy: mid },
			{ cx: mid, cy: mid },
			{ cx: max, cy: mid },
			{ cx: min, cy: max },
			{ cx: max, cy: max },
		];

		this.dots = dotPositions.map(position =>
			setElementAttributes(dot.cloneNode(), position)
		);
		this.element.append(...this.dots);
	}
}
