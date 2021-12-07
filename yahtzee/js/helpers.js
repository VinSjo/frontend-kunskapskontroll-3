function setElementAttributes(element, attributes = {}) {
	if (!(element instanceof Element)) return element;
	for (const [name, value] of Object.entries(attributes)) {
		element.setAttribute(name, `${value}`);
	}
	return element;
}

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

export { setElementAttributes };
