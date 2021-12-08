function unique_id() {
	return uniqid();
}

function uniqid(prefix = "", random = true) {
	const sec = Date.now() * 1000 + Math.random() * 1000;
	const id = sec.toString(16).replace(/\./g, "").padEnd(14, "0");
	return `${prefix}${id}${
		random ? `.${Math.trunc(Math.random() * 100000000)}` : ""
	}`;
}
/**
 * @param {Number} interval
 * @param {Number} timeOut
 * @param {Function} onInterval
 * @param {Function} onTimeOut
 * @returns {void}
 */
function timedInterval(
	onInterval,
	interval = 100,
	timeOut = 500,
	onTimeOut = null
) {
	let intervalID = setInterval(onInterval, interval);
	setTimeout(() => {
		clearInterval(intervalID);
		if (onTimeOut) onTimeOut();
	}, timeOut);
}

export { timedInterval };
