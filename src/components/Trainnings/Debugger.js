import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from 'dat.gui'

// Global variables
let currentRef = null;
const gui = new dat.GUI();

// Scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(25, 100 / 100, 0.1, 100);
scene.add(camera);
camera.position.set(5, 5, 5);
camera.lookAt(new THREE.Vector3());

const renderer = new THREE.WebGLRenderer();
renderer.setSize(100, 100);

// OrbitControls
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;

// Resize canvas
const resize = () => {
    renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
    camera.aspect = currentRef.clientWidth / currentRef.clientHeight;
    camera.updateProjectionMatrix();
};
window.addEventListener("resize", resize);

// Animate the scene
const animate = () => {
    orbitControls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};
animate();

// Cube
const cube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
);
scene.add(cube);

//#region GUI Debbugger
const positions = gui.addFolder('Positions');
positions.add(cube.position, 'x')
    .min(-10)
    .max(10)
    .step(0.5)
    .name('Pos X');
positions.add(cube.position, 'y')
    .min(-10)
    .max(10)
    .step(0.5)
    .name('Pos Y');
positions.add(cube.position, 'z')
    .min(-10)
    .max(10)
    .step(0.5)
    .name('Pos Z');

const scale = gui.addFolder('Scale');
const cubeAux = {
    scale: 1,
    color: 0xffffff
}

scale.add(cubeAux, 'scale', {
    "small": 1,
    "medium": 2,
    "large": 3
})
    .name('Scale X')
    .onChange(() => {
        cube.scale.set(
            cubeAux.scale,
            cubeAux.scale,
            cubeAux.scale)
    });

const color = gui.addFolder('Color');
color.addColor(cubeAux, 'color').onChange(() => {
    cube.material.color.set(cubeAux.color);
})
//#endregion

//Init and mount the scene
export const initScene = (mountRef) => {
    currentRef = mountRef.current;
    resize();
    currentRef.appendChild(renderer.domElement);
};

//Dismount and clean up the buffer from the scene
export const cleanUpScene = () => {
    //scene.dispose();
    window.removeEventListener("resize", resize);
    currentRef.removeChild(renderer.domElement);
};