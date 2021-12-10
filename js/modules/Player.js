import ScoreCard from "./ScoreCard.js";

export default class Player {
	/**
	 * @param {String} name
	 */
	constructor(name) {
		this.id = Math.round(
			Math.random() * (Math.random() * 1000 + Date.now() * 1000)
		)
			.toString()
			.substr(0, 5);
		this.name = name;
		this.score = new ScoreCard();
	}
}
