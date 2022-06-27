import * as THREE from "three";
import { Gui } from "./GUI";

const folderRender = Gui('Render');

export const Render = (scene, renderer, debug = false) => {

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.physicallyCorrectLights = true;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize(100, 100);

    //Debug    
    if (debug) {
        folderRender.add(renderer, 'toneMapping', {
            'NoToneMapping': THREE.NoToneMapping,
            'LinearToneMapping': THREE.LinearToneMapping,
            'ReinhardToneMapping': THREE.ReinhardToneMapping,
            'CineonToneMapping': THREE.CineonToneMapping,
            'ACESFilmicToneMapping': THREE.ACESFilmicToneMapping
        }).onChange(() => {
            renderer.toneMapping = Number(renderer.toneMapping);
            scene.traverse(child => {
                if (child instanceof THREE.Mesh) {
                    child.material.needsUpdate = true;
                }
            })
        });

        folderRender.add(renderer, 'toneMappingExposure')
            .min(0)
            .max(2)
            .step(0.02)
            .name('Exposure');
    }
}

