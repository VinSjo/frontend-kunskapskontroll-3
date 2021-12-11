function numberWord(number) {
	const words = [
		'one',
		'two',
		'three',
		'four',
		'five',
		'six',
		'seven',
		'eight',
		'nine',
	];
	const index = (number < 1 ? 1 : number > 9 ? 9 : number) - 1;
	return words[index];
}
export { numberWord };
