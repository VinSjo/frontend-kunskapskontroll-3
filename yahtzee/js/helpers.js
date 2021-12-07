function setElementAttributes(element, attributes = {}) {
	if (!(element instanceof Element)) return element;
	for (const [name, value] of Object.entries(attributes)) {
		element.setAttribute(name, `${value}`);
	}
	return element;
}

export { setElementAttributes };
