import ScoreCard from "./ScoreCard.js";

export default class Player {
	/**
	 * @param {String} name
	 */
	constructor(name) {
		const id = Math.round(
			Math.random() * (Math.random() * 1000 + Date.now() * 1000)
		).toString();
		this.id = id.substr(0, 5);
		this.name = name;
		this.score = new ScoreCard();
	}
}
