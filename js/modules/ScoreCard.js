import { scoreCardTemplate, calculateDiceScore } from "./Yatzy.js";

export default class ScoreCard {
	constructor() {
		this.sections = scoreCardTemplate();
	}
	get sum() {
		const reducer = (sum, val) =>
			typeof val === "number" ? sum + val : sum;
		const upper = Object.values(this.sections.upper).reduce(reducer, 0);
		const bonus = upper >= 63 ? 50 : 0;
		const lower = Object.values(this.sections.lower).reduce(reducer, 0);
		return upper + bonus + lower;
	}

	get available() {
		const available = { upper: [], lower: [] };
		Object.entries(this.sections.upper).forEach(([key, value]) => {
			value === 0 && available.upper.push(key);
		});
		Object.entries(this.sections.lower).forEach(([key, value]) => {
			value === 0 && available.lower.push(key);
		});
		return available;
	}
	/**
	 * @param {Number[]} values
	 */
	calculateDiceScore(values, onlyAvailable = true) {
		const points = calculateDiceScore(values);
		if (onlyAvailable) {
			const available = this.available;
			for (const [section, values] of Object.entries(points)) {
				for (const key of Object.keys(values)) {
					if (available[section].includes(key)) continue;
					delete points[section][key];
				}
			}
		}
		return points;
	}
}
