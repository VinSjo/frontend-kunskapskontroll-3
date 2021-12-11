import ScoreCard from './ScoreCard.js';

export default class Player {
	/**
	 * @param {String} name
	 * @param {String} id
	 */
	constructor(name, id) {
		this.id = id
			? id
			: `player-${Math.random().toString().replace('.', '')}`;
		this.name = name;
		this.score = new ScoreCard();
	}
}
