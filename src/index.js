import "./styles.css";

import THREE, { OrbitControls } from "./three";
import CANNON from "cannon";
import { DiceManager, DiceD6 } from "threejs-dice/lib/dice";
import GLTFLoader from "three-gltf-loader";

// standard global variables
var container,
	scene,
	camera,
	renderer,
	controls,
	world,
	diceValues,
	dice = [];

let bell;
let currentObject2 = null;
let dice1 = [];
let dice2 = [];
let dice3 = [];
let dice4 = [];
let leftTopOn = false;
let rightTopOn = true;
let leftBottomOn = false;
let rightBottomOn = false;
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
let backgroundMusic = document.getElementById("music");
let looose = document.getElementById("looose");
let clap = document.getElementById("clap");
let bellSound = document.getElementById("bell");
let scoreLoader = new THREE.FontLoader();
let textMesh;

scoreLoader.load(
	"https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
	function (scoreFont) {
		let endText = new THREE.TextGeometry(localStorage.getItem("score"), {
			font: scoreFont,
			size: 4,
			height: 0.5,
			curveSegments: 0.12,
			bevelThickness: 0.02,
			bevelSize: 0.1,
			bevelEnabled: true
		});
		var scoreMaterial = new THREE.MeshPhongMaterial({
			color: 0x000000
		});

		textMesh = new THREE.Mesh(endText, scoreMaterial);
		textMesh.position.set(20, 4, -10);
		scene.add(textMesh);
	}
);

init();

function fruitAdd(turn, color, fruitCount) {
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

function deleteDict(dict1, dict2) {
	let newDict = dict1;
	for (let i = 0; i < 4; i++) {
		newDict[Object.keys(newDict)[i]] =
			dict1[Object.keys(dict1)[i]] - dict2[Object.keys(dict2)[i]];
	}
	return newDict;
}

function addDict(dict1, dict2) {
	let newDict = dict1;
	for (let i = 0; i < 4; i++) {
		newDict[Object.keys(newDict)[i]] =
			dict1[Object.keys(dict1)[i]] + dict2[Object.keys(dict2)[i]];
	}
	return newDict;
}

// FUNCTIONS
function init() {
	backgroundMusic.play();
	// SCENE
	scene = new THREE.Scene();

	// CAMERA
	var SCREEN_WIDTH = window.innerWidth,
		SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45,
		ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
		NEAR = 0.01,
		FAR = 20000;
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(0, 30, 40);
	// RENDERER
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	container = document.getElementById("ThreeJS");
	container.appendChild(renderer.domElement);
	// EVENTS
	// CONTROLS
	controls = new OrbitControls(camera, renderer.domElement);
	var initializeDomEvents = require("threex-domevents");
	var THREEs = require("three");
	var THREEx = {};
	initializeDomEvents(THREEs, THREEx);
	var domEvents = new THREEx.DomEvents(camera, renderer.domElement);

	let ambient = new THREE.AmbientLight("#ffffff", 0.3);
	scene.add(ambient);

	let directionalLight = new THREE.DirectionalLight("#ffffff", 0.5);
	directionalLight.position.x = -1000;
	directionalLight.position.y = 1000;
	directionalLight.position.z = 1000;
	scene.add(directionalLight);

	let light = new THREE.SpotLight(0xefdfd5, 1.3);
	light.position.y = 100;
	light.target.position.set(0, 0, 0);
	light.castShadow = true;
	light.shadow.camera.near = 50;
	light.shadow.camera.far = 110;
	light.shadow.mapSize.width = 1024;
	light.shadow.mapSize.height = 1024;
	scene.add(light);

	// FLOOR

	const floortexture = new THREE.TextureLoader().load(
		"https://i.ibb.co/TtGrzgY/floor.jpg",
		render
	);
	var floorMaterial = new THREE.MeshBasicMaterial({
		//color: "#5c4937",
		side: THREE.DoubleSide,
		map: floortexture
	});

	var floorGeometry = new THREE.PlaneGeometry(80, 80, 10, 10);
	var floor = new THREE.Mesh(floorGeometry, floorMaterial);
	floor.receiveShadow = true;
	floor.rotation.x = Math.PI / 2;
	scene.add(floor);
	// SKYBOX/FOG
	var skyBoxGeometry = new THREE.CubeGeometry(10000, 10000, 10000);
	var skyBoxMaterial = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		side: THREE.BackSide
	});
	var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
	scene.add(skyBox);
	scene.fog = new THREE.FogExp2(0x808080, 0.00025);

	////////////
	// CUSTOM //
	////////////
	world = new CANNON.World();

	world.gravity.set(0, -9.82 * 20, 0);
	world.broadphase = new CANNON.NaiveBroadphase();
	world.solver.iterations = 16;

	DiceManager.setWorld(world);

	//Floor

	let floorBody = new CANNON.Body({
		mass: 0,
		shape: new CANNON.Plane(),
		material: DiceManager.floorBodyMaterial
	});
	floorBody.quaternion.setFromAxisAngle(
		new CANNON.Vec3(1, 0, 0),
		-Math.PI / 2
	);
	world.add(floorBody);

	//GLTFLoad
	var Gloader = new GLTFLoader();
	Gloader.crossOrigin = true;
	Gloader.load(
		"https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/models/gltf/AnimatedMorphSphere/glTF/AnimatedMorphSphere.gltf",
		//"bell/bell.gltf",
		function (data) {
			bell = data.scene;
			bell.scale.set(2, 2, 2);
			bell.position.set(0, 0, 0);
			scene.add(bell);
			domEvents.addEventListener(
				bell,
				"click",
				function (event) {
					console.log("is five is", isFive());
					bellClicked();
				},
				false
			);
			//, onProgress, onError );
		}
	);

	//audio

	//Walls

	function diceThrowToggler() {
		if (leftTopOn) {
			leftTopOn = false;
			rightTopOn = true;
			return leftTopDiceThrow();
		}
		if (rightTopOn) {
			rightTopOn = false;
			rightBottomOn = true;
			return rightTopDiceThrow();
		}
		if (rightBottomOn) {
			rightBottomOn = false;
			leftBottomOn = true;
			return rightBottomDiceThrow();
		}
		if (leftBottomOn) {
			leftBottomOn = false;
			leftTopOn = true;
			return leftBottomDiceThrow();
		}
	}

	function rightTopDiceThrow() {
		if (dice1) {
			for (var i = 0; i < dice1.length; i++) {
				scene.remove(scene.getObjectById(dice1[i]));
			}
		}
		dice = [];
		dice1 = [];
		diceValues = [];
		var fruitCount = Math.floor(Math.random() * 5) + 1;
		var color = colors[Math.floor(Math.random() * colors.length)];
		fruitAdd(currentTurn2, color, fruitCount);
		//console.log("current turn is", currentTurn2);
		deleteDict(fruitObject, lastTurn2);
		console.log("fruitObject now is", fruitObject);
		addDict(fruitObject, currentTurn2);
		lastTurn2 = currentTurn2;
		currentTurn2 = { watermelon: 0, grape: 0, orange: 0, strawberry: 0 };
		for (var j = 0; j < fruitCount; j++) {
			var die = new DiceD6({ size: 1.5, backColor: color });
			currentObject2 = die.getObject();
			scene.add(currentObject2);
			dice1.push(currentObject2.id);
			dice.push(die);
		}

		for (i = 0; i < dice.length; i++) {
			let yRand = Math.random() * 20;
			dice[i].getObject().position.x = 15 - (i % 3) * 1.5;
			dice[i].getObject().position.y = 2 + Math.floor(i / 3) * 1.5;
			dice[i].getObject().position.z = -15 + (i % 3) * 1.5;
			dice[i].getObject().quaternion.x =
				((Math.random() * 90 - 45) * Math.PI) / 180;
			dice[i].getObject().quaternion.z =
				((Math.random() * 90 - 45) * Math.PI) / 180;
			dice[i].updateBodyFromMesh();
			let rand = Math.random() * 5;
			dice[i]
				.getObject()
				.body.velocity.set(-25 + rand, 40 + yRand, 15 + rand);
			dice[i]
				.getObject()
				.body.angularVelocity.set(
					20 * Math.random() - 10,
					20 * Math.random() - 10,
					20 * Math.random() - 10
				);

			diceValues.push({ dice: dice[i], value: i + 1 });
		}

		DiceManager.prepareValues(diceValues);
		if (isFive()) {
			setTimeout(() => {
				bellSound.play();
			}, 1500);
			setTimeout(() => {
				window.location.reload();
			}, 1900);
		}
	}

	function rightBottomDiceThrow() {
		if (dice2) {
			for (var i = 0; i < dice2.length; i++) {
				scene.remove(scene.getObjectById(dice2[i]));

				for (var j = scene.children.length - 1; j >= 0; j--) {}
			}
		}
		dice = [];
		dice2 = [];
		var diceValues = [];
		var fruitCount = Math.floor(Math.random() * 5) + 1;
		var color = colors[Math.floor(Math.random() * colors.length)];
		fruitAdd(currentTurn3, color, fruitCount);
		//console.log("current turn is", currentTurn3);
		deleteDict(fruitObject, lastTurn3);
		console.log("fruitObject now is", fruitObject);
		addDict(fruitObject, currentTurn3);
		lastTurn3 = currentTurn3;
		currentTurn3 = { watermelon: 0, grape: 0, orange: 0, strawberry: 0 };
		for (j = 0; j < fruitCount; j++) {
			var die = new DiceD6({ size: 1.5, backColor: color });
			const currentObject = die.getObject();
			scene.add(currentObject);
			dice2.push(currentObject.id);
			dice.push(die);
		}

		for (i = 0; i < dice.length; i++) {
			let yRand = Math.random() * 20;
			dice[i].getObject().position.x = 15 - (i % 3) * 1.5;
			dice[i].getObject().position.y = 2 + Math.floor(i / 3) * 1.5;
			dice[i].getObject().position.z = 15 + (i % 3) * 1.5;
			dice[i].getObject().quaternion.x =
				((Math.random() * 90 - 45) * Math.PI) / 180;
			dice[i].getObject().quaternion.z =
				((Math.random() * 90 - 45) * Math.PI) / 180;
			dice[i].updateBodyFromMesh();
			let rand = Math.random() * 5;
			dice[i]
				.getObject()
				.body.velocity.set(-25 + rand, 40 + yRand, -15 + rand);
			dice[i]
				.getObject()
				.body.angularVelocity.set(
					20 * Math.random() - 10,
					20 * Math.random() - 10,
					20 * Math.random() - 10
				);

			diceValues.push({ dice: dice[i], value: i + 1 });
		}

		DiceManager.prepareValues(diceValues);
		if (isFive()) {
			setTimeout(() => {
				bellSound.play();
			}, 1500);
			setTimeout(() => {
				window.location.reload();
			}, 1900);
		}
	}

	function leftTopDiceThrow() {
		if (dice3) {
			for (var i = 0; i < dice3.length; i++) {
				scene.remove(scene.getObjectById(dice3[i]));

				for (var j = scene.children.length - 1; j >= 0; j--) {}
			}
		}
		dice = [];
		dice3 = [];
		var diceValues = [];
		var fruitCount = Math.floor(Math.random() * 5) + 1;
		var color = colors[Math.floor(Math.random() * colors.length)];
		fruitAdd(currentTurn1, color, fruitCount);
		//console.log("current turn is", currentTurn1);
		deleteDict(fruitObject, lastTurn1);
		console.log("fruitObject now is", fruitObject);
		addDict(fruitObject, currentTurn1);
		lastTurn1 = currentTurn1;
		currentTurn1 = { watermelon: 0, grape: 0, orange: 0, strawberry: 0 };
		for (j = 0; j < fruitCount; j++) {
			var die = new DiceD6({ size: 1.5, backColor: color });
			var currentObject = die.getObject();
			scene.add(currentObject);
			dice3.push(currentObject.id);
			dice.push(die);
		}

		for (i = 0; i < fruitCount; i++) {
			let yRand = Math.random() * 20;
			dice[i].getObject().position.x = -15 - (i % 3) * 1.5;
			dice[i].getObject().position.y = 2 + Math.floor(i / 3) * 1.5;
			dice[i].getObject().position.z = -15 + (i % 3) * 1.5;
			dice[i].getObject().quaternion.x =
				((Math.random() * 90 - 45) * Math.PI) / 180;
			dice[i].getObject().quaternion.z =
				((Math.random() * 90 - 45) * Math.PI) / 180;
			dice[i].updateBodyFromMesh();
			let rand = Math.random() * 5;
			dice[i]
				.getObject()
				.body.velocity.set(25 + rand, 40 + yRand, 15 + rand);
			dice[i]
				.getObject()
				.body.angularVelocity.set(
					20 * Math.random() - 10,
					20 * Math.random() - 10,
					20 * Math.random() - 10
				);

			diceValues.push({ dice: dice[i], value: i + 1 });
		}

		DiceManager.prepareValues(diceValues);
		if (isFive()) {
			setTimeout(() => {
				bellSound.play();
			}, 1500);
			setTimeout(() => {
				window.location.reload();
			}, 1900);
		}
	}

	function leftBottomDiceThrow() {
		if (dice4) {
			for (var i = 0; i < dice4.length; i++) {
				scene.remove(scene.getObjectById(dice4[i]));

				for (var j = scene.children.length - 1; j >= 0; j--) {}
			}
		}
		dice = [];
		var diceValues = [];
		var fruitCount = Math.floor(Math.random() * 5) + 1;
		var color = colors[Math.floor(Math.random() * colors.length)];
		fruitAdd(currentTurn4, color, fruitCount);
		//console.log("current turn is", currentTurn4);
		deleteDict(fruitObject, lastTurn4);
		console.log("fruitObject now is", fruitObject);
		addDict(fruitObject, currentTurn4);
		lastTurn4 = currentTurn4;
		currentTurn4 = { watermelon: 0, grape: 0, orange: 0, strawberry: 0 };
		for (j = 0; j < fruitCount; j++) {
			var die = new DiceD6({ size: 1.5, backColor: color });
			var currentObject = die.getObject();
			scene.add(currentObject);
			dice4.push(currentObject.id);
			dice.push(die);
		}

		for (i = 0; i < dice.length; i++) {
			let yRand = Math.random() * 20;
			dice[i].getObject().position.x = -15 + (i % 3) * 1.5;
			dice[i].getObject().position.y = 2 + Math.floor(i / 3) * 1.5;
			dice[i].getObject().position.z = 15 + (i % 3) * 1.5;
			dice[i].getObject().quaternion.x =
				((Math.random() * 90 - 45) * Math.PI) / 180;
			dice[i].getObject().quaternion.z =
				((Math.random() * 90 - 45) * Math.PI) / 180;
			dice[i].updateBodyFromMesh();
			let rand = Math.random() * 5;
			dice[i]
				.getObject()
				.body.velocity.set(25 + rand, 40 + yRand, -15 + rand);
			dice[i]
				.getObject()
				.body.angularVelocity.set(
					20 * Math.random() - 10,
					20 * Math.random() - 10,
					20 * Math.random() - 10
				);

			diceValues.push({ dice: dice[i], value: i + 1 });
		}

		DiceManager.prepareValues(diceValues);
		if (isFive()) {
			setTimeout(() => {
				bellSound.play();
			}, 1500);
			setTimeout(() => {
				window.location.reload();
			}, 1900);
		}
	}

	function isFive() {
		for (let i = 0; i < 4; i++) {
			if (fruitObject[Object.keys(fruitObject)[i]] === 5) {
				return true;
			}
		}
		return false;
	}

	function bellClicked() {
		scene.remove(textMesh);
		scoreLoader = new THREE.FontLoader();
		scoreLoader.load(
			"https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
			function (scoreFont) {
				let endText = new THREE.TextGeometry(
					localStorage.getItem("score"),
					{
						font: scoreFont,
						size: 4,
						height: 0.5,
						curveSegments: 0.12,
						bevelThickness: 0.02,
						bevelSize: 0.1,
						bevelEnabled: true
					}
				);
				var scoreMaterial = new THREE.MeshPhongMaterial({
					color: 0x000000
				});

				textMesh = new THREE.Mesh(endText, scoreMaterial);
				textMesh.position.set(20, 4, -10);
				scene.add(textMesh);
			}
		);

		if (isFive()) {
			const fontLoader = new THREE.FontLoader();
			fontLoader.load(
				"https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
				function (font) {
					let endText = new THREE.TextGeometry("WIN!", {
						font: font,
						size: 2,
						height: 0.5,
						curveSegments: 0.12,
						bevelThickness: 0.02,
						bevelSize: 0.05,
						bevelEnabled: true
					});

					var textMaterial = new THREE.MeshPhongMaterial({
						color: 0xff0000
					});
					var textMesh = new THREE.Mesh(endText, textMaterial);
					textMesh.position.set(-2.7, 2.3, 0);
					scene.add(textMesh);
				}
			);

			clap.play();
			clap = document.getElementById("clap");
			console.log("bell is rang");
			let newscore = parseInt(localStorage.getItem("score"), 10);
			console.log("newscore is ", newscore);
			newscore = newscore + 50;
			console.log("altered newscore is ", newscore);
			localStorage.setItem("score", newscore);

			
			setTimeout(() => {
				window.location.reload();
			}, 3000);
		} else {
			looose.play();
			let newscore = parseInt(localStorage.getItem("score"), 10);
			console.log("newscore is ", newscore);
			newscore = newscore - 10;
			console.log("altered newscore is ", newscore);
			localStorage.setItem("score", newscore);
		}
	}

	document
		.querySelector("#ThreeJS")
		.addEventListener("click", diceThrowToggler);

	// setInterval(randomDiceThrow, 3000);
	// randomDiceThrow();

	requestAnimationFrame(animate);
	// 	async function playVideo(){
	// 		try{
	// 		await backgroundMusic.play();
	// 	}
	// 	catch(err){
	// 		console.log("can't load music");
	// 	}
	// }
}

function animate() {
	updatePhysics();
	render();
	update();

	requestAnimationFrame(animate);
}

function updatePhysics() {
	world.step(1.0 / 60.0);

	for (var i in dice) {
		dice[i].updateMeshFromBody();
	}
}

function update() {
	controls.update();
}

function render() {
	renderer.render(scene, camera);
}
