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

      canvas.addEventListener("mouseenter", () => {
      document.body.style.overflow = "hidden"; // Scroll'u kapat
    });

    canvas.addEventListener("mouseleave", () => {
      document.body.style.overflow = ""; // Scroll'u aç
    });

      const camera = new BABYLON.ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 4, 4, BABYLON.Vector3.Zero(), scene);
      camera.attachControl(canvas, true); // Kamerayı kullanıcı kontrolüne ekle

      const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);

      const assetsManager = new BABYLON.AssetsManager(scene);

      let mesh = null;
      assetsManager.onTaskSuccessObservable.add(function (task) {
        mesh = task.loadedMeshes[0];

        // Nesneyi normalize et ve döndür
        mesh.normalizeToUnitCube();

        // Materyal ekleme
        const material = new BABYLON.StandardMaterial('stlMaterial', scene);
        material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Kırmızı renk
        mesh.material = material; // Materyali mesh'e ata
      });

      const loadButton = document.getElementById('loadFile');

      loadButton.onchange = function (evt) {
        const files = evt.target.files;
        const filename = files[0].name;
        const blob = new Blob([files[0]]);

        BABYLON.FilesInput.FilesToLoad[filename.toLowerCase()] = blob;

        assetsManager.addMeshTask('', '', 'file:', filename);
        assetsManager.load();

        // Dosyaları temizle
        loadButton.value = '';
      };

      // GizmoManager ile nesneye pivot ekleme
      const gizmoManager = new BABYLON.GizmoManager(scene);
      gizmoManager.positionGizmoEnabled = true;
      gizmoManager.scaleGizmoEnabled = true;

      window.addEventListener('keydown', (evt) => {
        if (evt.key === 'Delete' && mesh) {
          mesh.dispose(); // Mesh'i sil
          gizmoManager.attachToMesh(null); // Mesh'ten gizmo (pivot) kaldır
        }
      });

      // Nesneye tıklayınca seçme
      canvas.addEventListener("pointerdown", function (evt) {
        const pickResult = scene.pick(evt.clientX, evt.clientY);
        if (pickResult.hit && pickResult.pickedMesh === mesh) {
          gizmoManager.attachToMesh(pickResult.pickedMesh); // Mesh'e gizmo (pivot) ekle
        } else {
          //position gizmo açıkmı kontrolü
          if (gizmoManager.gizmos.scaleGizmo.isDragging) 
            return;
          gizmoManager.attachToMesh(null); // Mesh'ten gizmo (pivot) kaldır
          }
      });

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
      <input id="loadFile" type="file" accept=".stl" className="my-20" />
      <canvas style={{ width: '100%', height: '100%' }} ref={canvasRef} />
    </div>
  );
}

export default SvgExtrudeComponent;
