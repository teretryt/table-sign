import React, { useRef, useEffect, useState } from 'react';
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders'; // STL yükleyici için gerekli

function SvgExtrudeComponent() {
  const canvasRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const engine = new BABYLON.Engine(canvas, true);
      const scene = new BABYLON.Scene(engine);

      scene.createDefaultCameraOrLight(true);
      scene.activeCamera.attachControl(canvas, true);

      let  assetsManager = new BABYLON.AssetsManager(scene);

      //called when a single task has been sucessfull
        assetsManager.onTaskSuccessObservable.add(function(task) {

            // var mesh = task.loadedMeshes[0]; //will hold the mesh that has been loaded recently
            console.log('task successful', task);
            console.log(task.loadedMeshes[0]);
            task.loadedMeshes[0].normalizeToUnitCube()
            //rotate x axis 45 degrees
            task.loadedMeshes[0].rotation.x = -1 * Math.PI/4;
        });
    
        assetsManager.onTaskErrorObservable.add(function(task) {
            console.log('task failed', task.errorObject.message, task.errorObject.exception);
        });

        var loadButton = document.getElementById('loadFile');

        loadButton.onchange = function(evt){
            var files = evt.target.files;
            var filename = files[0].name;
            var blob = new Blob([files[0]]);
    
            BABYLON.FilesInput.FilesToLoad[filename.toLowerCase()] = blob;
            
            assetsManager.addMeshTask("", "", "file:", filename);
            assetsManager.load();
        }; 

      engine.runRenderLoop(() => {
        scene.render();
      });

      return () => {
        engine.dispose();
      };
    }
  }, [selectedFile]);

  return (
    <div>
      <input id='loadFile' type="file" accept=".stl" className='my-20' />
      <canvas style={{ width: "100%", height: "100%" }} ref={canvasRef} />
    </div>
  );
}

export default SvgExtrudeComponent;