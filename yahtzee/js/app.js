import { createDice } from "./dice.js";

const diceContainer = document.querySelector(".dice.container");
const dice = createDice();

// let intervalID = setInterval(() => {
// 	diceContainer.innerHTML = null;
// 	dice.roll();
// 	diceContainer.append(...dice.icons);
// }, 500);
