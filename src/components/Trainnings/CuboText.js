import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

// Global variables
let currentRef = null;
//const gui = new dat.GUI();

// Scene
const scene = new THREE.Scene();
//scene.background = new THREE.Color(0xffffff);

// Camera
const camera = new THREE.PerspectiveCamera(
    25,
    100 / 100,
    0.1,
    1000);

camera.position.z = 5;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(100,100);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

// Target Camera
controls.target = new THREE.Vector3(0, 0, 0);

// SmoothStop objects movement
controls.enableDamping = true;

// Resize
const resize = () => {
    renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
    camera.aspect = currentRef.clientWidth / currentRef.clientHeight;
    camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize)

// Textures
const textureLoader = new THREE.TextureLoader();
const baseColor = textureLoader.load('./textures/basecolor.jpg');
const AOmap = textureLoader.load('./textures/AO.jpg');
const Rmap = textureLoader.load('./textures/R.jpg');
const Nmap = textureLoader.load('./textures/N.jpg');
const Hmap = textureLoader.load('./textures/H.png');

// Cube
const cube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(
        1, 1, 1,
        250, 250, 250
    ),
    new THREE.MeshStandardMaterial(
        {
            map: baseColor,
            aoMap: AOmap,
            roughnessMap: Rmap,
            normalMap: Nmap,
            displacementMap: Hmap,
            displacementScale: 0.02
        }
    ))

cube.position.set(0, 0, 0);
scene.add(cube);

// Lights
// Ambiental Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight);

// Point Light
/*      const pointLight = new THREE.PointLight(0xffffff, 1)
     pointLight.position.set(0, 5, 0);
     scene.add(pointLight); */

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);


// HDRi Light
const HDRiLight = new THREE.CubeTextureLoader()
const HDRiMap = HDRiLight.load([
    './cubeMap/px.png',
    './cubeMap/nx.png',
    './cubeMap/py.png',
    './cubeMap/ny.png',
    './cubeMap/pz.png',
    './cubeMap/nz.png'
])
scene.environment = HDRiMap;
//scene.background = HDRiMap;

// Render scene
const animate = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

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