import { useEffect, useRef } from "react";
import { ContainerScene } from "./Scene.elements";
import { cleanUpScene, initScene, gsapAnimations } from "./Script";

const Scene = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        initScene(mountRef);

        return () => {
            cleanUpScene();
        };
    }, []);

    return (
        <>
            <ContainerScene
                className='SceneContainer'
                ref={mountRef}>
            </ContainerScene>
            <button
                onClick={() => gsapAnimations('cube1')}
                style={{ padding: '1rem' }}>CUBE 1</button>
            <button
                onClick={() => gsapAnimations('cube2')}
                style={{ padding: '1rem' }}>CUBE 2</button>
            <button
                onClick={() => gsapAnimations('cube3')}
                style={{ padding: '1rem' }}>CUBE 3</button>
            <button
                onClick={() => gsapAnimations('cube4')}
                style={{ padding: '1rem' }}>CUBE 4</button>
        </>
    );
};

export default Scene;