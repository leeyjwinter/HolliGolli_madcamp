import { DiceManager, DiceD6 } from "threejs-dice/lib/dice";
import THREE, { OrbitControls } from "./three";
import { scene } from "./index.js";
let currentObject2 = null;
let dice1 = [];
let dice2 = [];
let dice3 = [];
let dice4 = [];
let diceValues = [];
let dice = [];
var colors = ["#ff0000", "#00ff00", "#0000ff", "#000000"];
let fruitObject = { watermelon: 0, grape: 0, orange: 0, strawberry: 0 };
let currentTurn1 = { watermelon: 0, grape: 0, orange: 0, strawberry: 0 };
let currentTurn2 = { watermelon: 0, grape: 0, orange: 0, strawberry: 0 };
let currentTurn3 = { watermelon: 0, grape: 0, orange: 0, strawberry: 0 };
let currentTurn4 = { watermelon: 0, grape: 0, orange: 0, strawberry: 0 };
let lastTurn1 = { watermelon: 0, grape: 0, orange: 0, strawberry: 0 };
let lastTurn2 = { watermelon: 0, grape: 0, orange: 0, strawberry: 0 };
let lastTurn3 = { watermelon: 0, grape: 0, orange: 0, strawberry: 0 };
let lastTurn4 = { watermelon: 0, grape: 0, orange: 0, strawberry: 0 };

export function fruitAdd(turn, color, fruitCount) {
	if (color === "#ff0000") {
		turn["strawberry"] += fruitCount;
	} else if (color === "#00ff00") {
		turn["watermelon"] += fruitCount;
	} else if (color === "#0000ff") {
		turn["grape"] += fruitCount;
	} else if (color === "#000000") {
		turn["orange"] += fruitCount;
	}
}

export function deleteDict(dict1, dict2) {
	let newDict = dict1;
	for (let i = 0; i < 4; i++) {
		newDict[Object.keys(newDict)[i]] =
			dict1[Object.keys(dict1)[i]] - dict2[Object.keys(dict2)[i]];
	}
	return newDict;
}

export function addDict(dict1, dict2) {
	let newDict = dict1;
	for (let i = 0; i < 4; i++) {
		newDict[Object.keys(newDict)[i]] =
			dict1[Object.keys(dict1)[i]] + dict2[Object.keys(dict2)[i]];
	}
	return newDict;
}
