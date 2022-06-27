import * as THREE from "three";
import { Gui } from "./GUI";

export const sceneParams = {
    envMapIntensity: 1,
    directionalLightColor: 0xffffff,
    ambientLightColor: 0xffffff
}

const folderLights = Gui('Lights');

export const DirectionalLight = (scene, debug = false) => {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 6, 1);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(1024, 1024);
    // Correccion de artefactos en sombra //
    //directionalLight.shadow.bias =0.0005;
    //directionalLight.shadow.normalBias =0.0005;
    scene.add(directionalLight);

    //Debug    
    if (debug) {
        folderLights.add(directionalLight, 'intensity')
            .min(0)
            .max(5)
            .step(0.05)
            .name('DirectionalLight');

        folderLights.addColor(sceneParams, 'directionalLightColor')
            .onChange(() => {
                directionalLight.color.set(sceneParams.directionalLightColor)
            });

        const positionLight = folderLights.addFolder('Positions');
        positionLight.add(directionalLight.position, 'x')
            .min(-10)
            .max(10)
            .step(0.5)
            .name('Pos X');
        positionLight.add(directionalLight.position, 'y')
            .min(-10)
            .max(10)
            .step(0.5)
            .name('Pos Y');
        positionLight.add(directionalLight.position, 'z')
            .min(-10)
            .max(10)
            .step(0.5)
            .name('Pos Z');
    }
};

export const AmbientLight = (scene, debug = false) => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    //Debug
    if (debug) {
        folderLights.add(ambientLight, 'intensity')
            .min(0)
            .max(5)
            .step(0.05)
            .name('AmbientLight');
        folderLights.addColor(sceneParams, 'directionalLightColor')
            .onChange(() => {
                ambientLight.color.set(sceneParams.ambientLightColor)
            });
    }
};

export const HDRiLight = (scene, debug = false) => {
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
    scene.background = HDRiMap;

    //Debug
    if (debug) {
        folderLights.add(sceneParams, 'envMapIntensity')
            .min(0)
            .max(5)
            .step(0.05)
            .name('HDRiLight')
            .onChange(() => {
                scene.traverse(child => {
                    if (child instanceof THREE.Mesh &&
                        child.material instanceof THREE.MeshStandardMaterial) {
                        child.material.envMapIntensity = sceneParams.envMapIntensity;
                    }
                })
            });
    }
}