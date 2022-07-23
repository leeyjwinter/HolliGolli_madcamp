import * as THREE from "three";

// import Stats from 'three/examples/jsm/libs/stats.module.js';

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// let stats;
let camera, scene, renderer;

let group;
let group2;
let group3;
let group4;
let group1On = true; //right top
let group2On = false; //right bottom
let group3On = false; //left bottom
let group4On = false; //left top

init();
if (group1On) {
  animate();
  console.log("group1 animated");
}
if (group2On) {
  animate2();
  console.log("group2 animated");
}
if (group3On) {
  animate3();
  console.log("group3 animated");
}
if (group4On) {
  animate4();
  console.log("group4 animated");
}

function init() {
  const container = document.createElement("div");
  document.body.appendChild(container);

  // scene

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xcce0ff, 5, 100);

  // camera

  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );

  // We use this particular camera position in order to expose a bug that can sometimes happen presumably
  // due to lack of precision when interpolating values over really large triangles.
  // It reproduced on at least NVIDIA GTX 1080 and GTX 1050 Ti GPUs when the ground plane was not
  // subdivided into segments.
  camera.position.x = 20;
  camera.position.y = 18;
  camera.position.z = 0;

  scene.add(camera);

  // lights

  scene.add(new THREE.AmbientLight(0x666666));

  const light = new THREE.DirectionalLight(0xdfebff, 1.75);
  light.position.set(2, 8, 4);

  light.castShadow = true;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  light.shadow.camera.far = 20;

  scene.add(light);

  // scene.add( new DirectionalLightHelper( light ) );
  //   scene.add(new THREE.CameraHelper(light.shadow.camera));

  // group1

  group = new THREE.Group();
  scene.add(group);

  const geometry = new THREE.SphereGeometry(0.3, 20, 20);

  for (let i = 0; i < 5; i++) {
    const material = new THREE.MeshPhongMaterial({
      color: Math.random() * 0xffffff,
    });

    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = 5;
    sphere.position.z = 0;

    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.userData.phase = Math.random() * Math.PI;
    if (group1On) group.add(sphere);
  }

  //group2

  group2 = new THREE.Group();
  scene.add(group2);

  const geometry2 = new THREE.SphereGeometry(0.3, 20, 20);

  for (let i = 0; i < 5; i++) {
    const material = new THREE.MeshPhongMaterial({
      color: Math.random() * 0xffffff,
    });

    const sphere = new THREE.Mesh(geometry2, material);
    sphere.position.x = 5;
    sphere.position.z = 0;

    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.userData.phase = Math.random() * Math.PI;
    if (group2On) group2.add(sphere);
  }

  //group3

  group3 = new THREE.Group();
  scene.add(group3);

  const geometry3 = new THREE.SphereGeometry(0.3, 20, 20);

  for (let i = 0; i < 5; i++) {
    const material = new THREE.MeshPhongMaterial({
      color: Math.random() * 0xffffff,
    });

    const sphere = new THREE.Mesh(geometry3, material);
    sphere.position.x = 5;
    sphere.position.z = 0;

    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.userData.phase = Math.random() * Math.PI;
    if (group3On) group3.add(sphere);
  }

  //group4

  group4 = new THREE.Group();
  scene.add(group4);

  const geometry4 = new THREE.SphereGeometry(0.3, 20, 20);

  for (let i = 0; i < 5; i++) {
    const material = new THREE.MeshPhongMaterial({
      color: Math.random() * 0xffffff,
    });

    const sphere = new THREE.Mesh(geometry4, material);
    sphere.position.x = 5;
    sphere.position.z = 0;

    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.userData.phase = Math.random() * Math.PI;
    if (group4On) group4.add(sphere);
  }

  // ground

  const groundMaterial = new THREE.MeshPhongMaterial({
    color: 0x404040,
    specular: 0x111111,
  });

  const bellMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0x111111,
  });

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20000, 20000, 8, 8),
    groundMaterial
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const column = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.2, 2.8, 32),
    bellMaterial
  );
  column.position.y = 0;
  column.castShadow = true;
  column.receiveShadow = true;
  scene.add(column);

  //bell
  const loader = new GLTFLoader();
  //   const dracoLoader = new DRACOLoader();
  //   dracoLoader.setDecoderPath( '/examples/js/libs/draco/' );
  //   loader.setDRACOLoader( dracoLoader );
  loader.load(
    "https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/models/gltf/AnimatedMorphSphere/glTF/AnimatedMorphSphere.gltf",
    function (gltf) {
      scene.add(gltf.scene);
    }
  );
  //   },

  //   undefined, function ( error ) {

  //    console.error( error );

  // } );

  // overwrite shadowmap code
  //
  let shader = THREE.ShaderChunk.shadowmap_pars_fragment;

  shader = shader.replace(
    "#ifdef USE_SHADOWMAP",
    "#ifdef USE_SHADOWMAP" + document.getElementById("PCSS").textContent
  );

  shader = shader.replace(
    "#if defined( SHADOWMAP_TYPE_PCF )",
    document.getElementById("PCSSGetShadow").textContent +
      "#if defined( SHADOWMAP_TYPE_PCF )"
  );

  THREE.ShaderChunk.shadowmap_pars_fragment = shader;

  // renderer

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(scene.fog.color);

  container.appendChild(renderer.domElement);

  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;

  // controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * 0.5;
  controls.minDistance = 10;
  controls.maxDistance = 75;
  controls.target.set(0, 2.5, 0);
  controls.update();

  window.addEventListener("resize", onWindowResize);
}

//

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  const time = performance.now() / 1000;

  group.traverse(function (child) {
    if ("phase" in child.userData) {
      child.position.y =
        Math.abs(Math.sin(time + child.userData.phase)) * 4 + 0.3;
      child.position.z = time - 8;
      if (time > 8) {
        child.position.z = (time % 3) * 0.01;
      }
      child.position.x = time - 8;
      if (time > 8) {
        child.position.x = (time % 3) * 0.01;
      }
    }
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function animate2() {
  const time = performance.now() / 1000;

  group2.traverse(function (child) {
    if ("phase" in child.userData) {
      child.position.y =
        Math.abs(Math.sin(time + child.userData.phase)) * 4 + 0.3;
      child.position.z = time - 8;
      if (time > 8) {
        child.position.z = (time % 3) * 0.01;
      }
      child.position.x = -time + 8;
      if (time > 8) {
        child.position.x = (time % 3) * 0.01;
      }
    }
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate2);
}

function animate3() {
  const time = performance.now() / 1000;

  group3.traverse(function (child) {
    if ("phase" in child.userData) {
      child.position.y =
        Math.abs(Math.sin(time + child.userData.phase)) * 4 + 0.3;
      child.position.z = -time + 8;
      if (time > 8) {
        child.position.z = (time % 3) * 0.01;
      }
      child.position.x = -time + 8;
      if (time > 8) {
        child.position.x = (time % 3) * 0.01;
      }
    }
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate3);
}

function animate4() {
  const time = performance.now() / 1000;

  group4.traverse(function (child) {
    if ("phase" in child.userData) {
      child.position.y =
        Math.abs(Math.sin(time + child.userData.phase)) * 4 + 0.3;
      child.position.z = -time + 8;
      if (time > 8) {
        child.position.z = (time % 3) * 0.01;
      }
      child.position.x = time - 8;
      if (time > 8) {
        child.position.x = (time % 3) * 0.01;
      }
    }
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate4);
}
