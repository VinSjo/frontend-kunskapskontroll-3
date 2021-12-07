import { createDice } from "./dice.js";
const $diceContainer = document.querySelector(".dice.container");
const $rollButton = document.querySelector(".roll-button");

const dice = createDice();

$diceContainer.append(...dice.icons);

dice.roll();
dice.update();

let rollInterval = null;
$rollButton.addEventListener("click", () => {
	if (rollInterval !== null) return;
	$rollButton.setAttribute("disabled", true);
	rollInterval = setInterval(() => {
		dice.roll();
		dice.update();
	}, 1000 / 10);
	setTimeout(() => {
		clearInterval(rollInterval);
		rollInterval = null;
		$rollButton.removeAttribute("disabled");
	}, 1000);
});
