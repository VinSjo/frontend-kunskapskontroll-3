/**
 * @param {Number[]} values
 * @returns {Number[]}
 */
function getOccurences(values) {
	return values.reduce(
		(result, current) => {
			const index = current - 1;
			result[index] !== undefined && result[index]++;
			return result;
		},
		[0, 0, 0, 0, 0, 0]
	);
}

/**
 *
 * @param {Array} values
 * @param {Array} reference
 * @returns {Boolean}
 */
function includesAll(values, reference) {
	return values.reduce(
		(result, current) => result && reference.includes(current),
		true
	);
}

/**
 * @param {Number[]} values
 * @returns {Object}
 */
function calculatePoints(values) {
	const occurences = getOccurences(values);
	const sections = {
		upper: occurences.reduce((result, count, index) => {
			const number = index + 1;
			result[`${number}`] = number * count;
			return result;
		}, new Object()),
		lower: {
			pair: 0,
			twoPair: 0,
			threeOfKind: 0,
			fourOfKind: 0,
			fullHouse: 0,
			yatzy: 0,
			smallStraight: includesAll([1, 2, 3, 4, 5], values) ? 15 : 0,
			largeStraight: includesAll([2, 3, 4, 5, 6], values) ? 20 : 0,
			chance: values.reduce((sum, current) => sum + current, 0),
		},
	};

	const pairs = occurences.reduce((result, count, index) => {
		if (count >= 2) result.push(index + 1);
		return result;
	}, []);
	if (pairs.length === 1) sections.lower.pair = pairs[0] * 2;
	if (pairs.length < 2) return sections;

	sections.lower.pair = Math.max(...pairs) * 2;
	sections.lower.twoPair = (pairs[0] + pairs[1]) * 2;

	pairs.forEach(number => {
		const count = occurences[number - 1];
		if (count >= 3) {
			sections.lower.threeOfKind = number * 3;
			const base = pairs.filter(pair => number !== pair);
			if (base.length) {
				sections.lower.fullHouse =
					Math.max(...base) * 2 + sections.lower.threeOfKind;
			}
		}
		if (count >= 4) sections.lower.fourOfKind = number * 4;
		if (count === 5) sections.lower.yatzy = 50;
	});
	return sections;
}

export { getOccurences, calculatePoints };
