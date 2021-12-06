export default class Player {
	constructor(name, color, symbolName, symbolTemplate, playerNameList) {
		this.name = name;
		this.color = color;
		this.symbolName = symbolName;

		this._symbol = {
			template: symbolTemplate,
			get clone() {
				return this.template.content.cloneNode(true);
			},
		};

		this.output = document.createElement("li");
		this.output.classList.add("player");
		this.output.textContent = this.name;
		playerNameList.append(this.output);
	}

	get symbol() {
		const symbol = this._symbol.clone;
		symbol.querySelector("path").setAttribute("fill", this.color);
		return symbol;
	}
}
