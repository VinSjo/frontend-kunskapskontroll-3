const UI = {
	buttons: {
		roll: document.querySelector("button.roll"),
	},
	optionList: document.querySelector("ul.options"),
	scoreBoard: document.querySelector("table.score"),
	dice: {
		elements: [...document.querySelectorAll("svg.dice")],
		container: document.querySelector(".dice.container"),
	},
};

export default UI;
