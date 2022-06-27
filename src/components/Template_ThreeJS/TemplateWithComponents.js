import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { DirectionalLight, AmbientLight, HDRiLight, sceneParams } from "./Lights";
import { Render } from "./Render";

// Global variables
let currentRef = null;

//#region Scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(25, 100 / 100, 0.1, 100);
scene.add(camera);
camera.position.set(5, 5, 5);
camera.lookAt(new THREE.Vector3());

const renderer = new THREE.WebGLRenderer();
Render(scene, renderer, true);

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

const castAndReceiveShadows = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.envMapIntensity = sceneParams.envMapIntensity;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    })
}
//#endregion

//#region TO-DO


scene.background = new THREE.Color('grey');

// Cube
const cube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
);
castAndReceiveShadows();
scene.add(cube);


//#endregion

//#region UseEffect
// Lights
DirectionalLight(scene, true);
AmbientLight(scene, true);
HDRiLight(scene, true);
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
//#endregion