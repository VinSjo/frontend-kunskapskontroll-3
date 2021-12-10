const UI = {
	buttons: {
		roll: document.querySelector("button.roll"),
	},
	optionList: document.querySelector("ul.options"),
	scoreBoard: {
		table: document.querySelector("table.score"),
		container: document.querySelector(".score.container"),
		buttons: {
			show: document.querySelector("button.score.show"),
			hide: document.querySelector("button.score.hide"),
		},
	},
	dice: {
		template: document.querySelector("template#dice"),
		container: document.querySelector(".dice.container"),
	},
};

export default UI;
