export default class DieView {
	/**
	 * @param {SVGSVGElement} svgTemplate
	 */
	constructor(svgTemplate) {
		svgTemplate && this.setTemplate(svgTemplate);
	}
	/**
	 * @param {HTMLTemplateElement} dieTemplate
	 */
	setTemplate(dieTemplate) {
		if (!(dieTemplate instanceof HTMLTemplateElement)) return;
		const svg = dieTemplate.content.querySelector("svg");
		this.element = svg.cloneNode(true);
		this.dots = [...this.element.querySelectorAll("circle")];
	}
	/**
	 * @param {Number} value
	 */
	updateValue(value) {
		if (!this.element) return;
		this.element.dataset.value = value;
		this.element.setAttribute("title", value);
		const visibleDots = [];
		if (value % 2 !== 0) visibleDots.push(3);
		if (value > 1) visibleDots.push(1, 5);
		if (value > 3) visibleDots.push(0, 6);
		if (value === 6) visibleDots.push(2, 4);
		this.dots.forEach((dot, index) => {
			visibleDots.includes(index)
				? (dot.style.opacity = 1)
				: (dot.style.opacity = 0);
		});
	}

	async animatedUpdateValue(value, interval, duration) {
		if (!this.element) return;
		const randomOffset = max => {
			return Math.round(Math.random() * max * 2) - max;
		};
		this.animating = true;

		this.element.style.transition = `transform ${interval}ms linear`;
		let intervalID = setInterval(async () => {
			if (!this.animating) {
				this.element.style.transform = null;
				this.element.style.transition = null;
				this.updateValue(value);
				clearInterval(intervalID);
				return;
			}
			this.updateValue(Math.ceil(Math.random() * value));
			const x = randomOffset(4),
				y = randomOffset(4),
				deg = randomOffset(8);
			this.element.style.transform = `translate(${x}px,${y}px) rotate(${deg}deg)`;
		}, interval);

		this.animating = await new Promise(resolve =>
			setTimeout(() => resolve(false), duration)
		);
	}
}
