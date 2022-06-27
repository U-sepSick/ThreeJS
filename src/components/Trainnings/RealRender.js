import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { DirectionalLight, AmbientLight, HDRiLight, sceneParams } from "../Lights";
import { Render } from "../Render";

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
//#endregion
//#region TO-DO

scene.background = new THREE.Color('grey');

const castAndReceiveShadows = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.envMapIntensity = sceneParams.envMapIntensity;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    })
}

// Plane Base
const planeBase = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(8, 8, 8),
    new THREE.MeshStandardMaterial({ color: 'grey' })
)
planeBase.rotation.x = Math.PI * -0.5;
planeBase.position.y = -1;
scene.add(planeBase);

// Load Model 3D
// Loading Manager
const loadingManager = new THREE.LoadingManager(
    () => {
        console.log('Todo cargado');
    },
    (
        itemUrl,
        itemsToLoad,
        itemsLoaded
    ) => {
        console.log('Loading . . .', Math.round((itemsToLoad / itemsLoaded) * 100) + '%');
    },
    () => {
        console.log('Error')
    }
);

//DRACO 
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('./draco/draco/')

const gltfLoader = new GLTFLoader(loadingManager);
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load('./draco/helmet.gltf',
    (gltf) => {
        while (gltf.scene.children.length) {
            console.log(gltf.scene.children[0]);
            scene.add(gltf.scene.children[0]);
        }
        castAndReceiveShadows();
    },
    () => {
        console.log('Progress')
    },
    () => {
        console.log('Error')
    }
)

// Lights
DirectionalLight(scene, true);
AmbientLight(scene, true);
HDRiLight(scene, true);

//#endregion
//#region UseEffect
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