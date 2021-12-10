import {
	getOccurrences,
	getPairs,
	getThreeOfKind,
	getFourOfKind,
	getFullHouse,
	getStraight,
	getYatzy,
} from "./calculations.js";

class ScoreCardTemplate {
	constructor() {
		const rowObject = (name, value = 0) => ({ name: name, value: value });

		const upper = {
			1: rowObject("one"),
			2: rowObject("two"),
			3: rowObject("three"),
			4: rowObject("four"),
			5: rowObject("five"),
			6: rowObject("six"),
		};
		const lower = {
			bonus: rowObject("bonus"),
			pair: rowObject("one pair"),
			twoPair: rowObject("two pair"),
			threeOfKind: rowObject("three of a kind"),
			fourOfKind: rowObject("four of a kind"),
			smallStraight: rowObject("small straight"),
			largeStraight: rowObject("large straight"),
			fullHouse: rowObject("full house"),
			chance: rowObject("chance"),
			yatzy: rowObject("yatzy"),
		};
		Object.defineProperties(this, {
			upper: { value: upper, enumerable: true },
			lower: { value: lower, enumerable: true },
			values: {
				get: function () {
					const output = {};
					for (const [sectionKey, section] of Object.entries(this)) {
						output[sectionKey] = [];
						for (const key of Object.keys(section)) {
							output[sectionKey] = section[key].value;
						}
					}
					return output;
				},
			},
		});
	}
}

class ScoreCard extends ScoreCardTemplate {
	constructor() {
		super();
	}
	get upperSum() {
		return this.reduceSection("upper");
	}
	get lowerSum() {
		return this.reduceSection("lower");
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
			(sum, { value }) => (typeof value === "number" ? sum + value : sum),
			0
		);
	}
	getDiceScore(diceValues, onlyAvailable = true) {
		const score = new ScoreCardTemplate();

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
export { ScoreCardTemplate };
