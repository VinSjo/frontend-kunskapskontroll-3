import {
	getOccurrences,
	getPairs,
	getThreeOfKind,
	getFourOfKind,
	getFullHouse,
	getStraight,
	getYatzy,
} from '../functions/calculations.js';

class ScoreCard {
	static get maxScore() {
		const score = new ScoreCard();
		for (const key of Object.keys(score.upper)) {
			const number = parseInt(key);
			score.upper[key].value = number * 5;
		}
		score.lower.bonus.value = 50;
		score.lower.pair.value = 6 * 2;
		score.lower.twoPair.value = 6 * 2 + 5 * 2;
		score.lower.threeOfKind.value = 6 * 3;
		score.lower.fourOfKind.value = 4 * 6;
		score.lower.fullHouse.value = 5 * 2 + 6 * 3;
		score.lower.smallStraight.value = 15;
		score.lower.largeStraight.value = 20;
		score.lower.chance.value = 6 * 5;
		score.lower.yatzy.value = 50;
		return score;
	}

	constructor() {
		const newRow = (name, value = 0) => ({
			name: name,
			value: value,
		});
		const upper = {
			1: newRow('one'),
			2: newRow('two'),
			3: newRow('three'),
			4: newRow('four'),
			5: newRow('five'),
			6: newRow('six'),
		};
		const lower = {
			bonus: newRow('bonus'),
			pair: newRow('one pair'),
			twoPair: newRow('two pair'),
			threeOfKind: newRow('three of a kind'),
			fourOfKind: newRow('four of a kind'),
			smallStraight: newRow('small straight'),
			largeStraight: newRow('large straight'),
			fullHouse: newRow('full house'),
			chance: newRow('chance'),
			yatzy: newRow('yatzy'),
		};
		Object.defineProperties(this, {
			upper: { value: upper, enumerable: true },
			lower: { value: lower, enumerable: true },
		});
	}
	get upperSum() {
		return this.reduceSection('upper');
	}
	get lowerSum() {
		return this.reduceSection('lower');
	}
	get bonus() {
		return this.upperSum >= 63 ? 50 : 0;
	}
	get total() {
		return this.upperSum + this.lowerSum + this.bonus;
	}
	get available() {
		const output = {};
		for (const [sectionKey, section] of Object.entries(this)) {
			output[sectionKey] = [];
			for (const key of Object.keys(section)) {
				if (section[key].value !== 0) continue;
				output[sectionKey].push(key);
			}
		}
		return output;
	}
	reduceSection(sectionName) {
		return Object.values(this[sectionName]).reduce(
			(sum, { value }) => (typeof value === 'number' ? sum + value : sum),
			0
		);
	}
	getDiceScore(diceValues, onlyAvailable = true) {
		const score = new ScoreCard();
		const occurrences = getOccurrences(diceValues);
		for (const key of Object.keys(score.upper)) {
			const number = parseInt(key);
			const index = number - 1;
			score.upper[key].value = occurrences[index] * number;
		}

		score.lower.chance.value = diceValues.reduce(
			(sum, value) => sum + value,
			0
		);
		score.lower.smallStraight.value = getStraight(diceValues, 1);
		score.lower.largeStraight.value = getStraight(diceValues, 2);

		const pairs = getPairs(occurrences);

		if (pairs.length > 0) {
			score.lower.pair.value = Math.max(...pairs);
			score.lower.threeOfKind.value = getThreeOfKind(occurrences);
			if (pairs.length > 1) {
				score.lower.twoPair.value = (pairs[0] + pairs[1]) * 2;
				score.lower.pair.value = Math.max(...pairs);
				score.lower.fullHouse.value = getFullHouse(occurrences);
			}
			score.lower.fourOfKind.value = getFourOfKind(occurrences);
			score.lower.yatzy.value = getYatzy(occurrences);
		}

		if (onlyAvailable) {
			const available = this.available;
			for (const [section, values] of Object.entries(score)) {
				for (const key of Object.keys(values)) {
					if (available[section].includes(key)) continue;
					delete score[section][key];
				}
			}
		}
		return score;
	}
}
export default ScoreCard;
