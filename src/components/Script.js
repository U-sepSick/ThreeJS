import * as THREE from "three";
import { gsap, Power2 } from 'gsap';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Render } from "./Render";
import { Gui } from "./GUI";

// Global variables
let currentRef = null;
const timeline = new gsap.timeline({
    defaults: {
        duration: 1,
        ease: Power2.easeOut

    }
});
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
// Animations Params
const animationsParams = {
    cube1: {
        target: {
            x: 0,
            y: 0,
            z: 0
        },
        camera: {
            x: -10,
            y: -5,
            z: 2
        },
        zoom: 1.2
    },
    cube2: {
        target: {
            x: 0,
            y: 3,
            z: 0
        },
        camera: {
            x: 7,
            y: 10,
            z: 15
        },
        zoom: 3
    },
    cube3: {
        target: {
            x: 0,
            y: 6,
            z: 0
        },
        camera: {
            x: -6,
            y: -3,
            z: 3
        },
        zoom: 2
    },
    cube4: {
        target: {
            x: 0,
            y: 9,
            z: 0
        },
        camera: {
            x: 10,
            y: 10,
            z: 10
        },
        zoom: 1.2
    }
}

// Cubes
const cube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
);
scene.add(cube);

const cube2 = cube.clone();
cube2.position.set(0, 3, 0);
scene.add(cube2);

const cube3 = cube.clone();
cube3.position.set(0, 6, 0);
scene.add(cube3);

const cube4 = cube.clone();
cube4.position.set(0, 9, 0);
scene.add(cube4);

// Animations
export const gsapAnimations = (mesh) => {
    timeline
        .to(orbitControls.target, {
            x: animationsParams[mesh].target.x,
            y: animationsParams[mesh].target.y,
            z: animationsParams[mesh].target.z,
        })
        .to(camera.position, {
            x: animationsParams[mesh].camera.x,
            y: animationsParams[mesh].camera.y,
            z: animationsParams[mesh].camera.z,
        },'-=1.0')
        .to(camera, {
            zoom: animationsParams[mesh].zoom,
            onUpdate: () => {
                camera.updateProjectionMatrix();
            }
        },'-=1.0')
}
// GUI
const animation = Gui('Anim');
animation.add(camera.position, 'x')
    .min(0)
    .max(10)
    .step(1)
    .name('Camera x')
animation.add(camera.position, 'y')
    .min(0)
    .max(10)
    .step(1)
    .name('Camera y')
animation.add(camera.position, 'z')
    .min(0)
    .max(10)
    .step(1)
    .name('Camera z')
animation.add(camera, 'zoom')
    .min(1)
    .max(5)
    .step(0.1)
    .name('Zoom')
    .onChange(()=>{
        camera.updateProjectionMatrix();
    })
//#endregion

//#region UseEffect
//Init and mount the scene
export const initScene = (mountRef) => {

    currentRef = mountRef.current;
    currentRef.appendChild(renderer.domElement);
    resize();
};

//Dismount and clean up the buffer from the scene
export const cleanUpScene = () => {
    window.removeEventListener("resize", resize);
    currentRef.removeChild(renderer.domElement);
};
//#endregion