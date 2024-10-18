import React, { useEffect, useRef, useState } from "react";
import earcut from "earcut";
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import * as GUI from "babylonjs-gui";

function Workshop() {
  const canvasRef = useRef(null);
  const [text, setText] = useState("HELLO WORLD"); // Varsayılan metin
  const [fontSize, setFontSize] = useState(16); // Varsayılan font boyutu
  const [textColor, setTextColor] = useState("#4A10CE"); // Varsayılan yazı rengi
  const [textEmissiveColor, setTextEmissiveColor] = useState("#210EEF"); // İç aydınlatma rengi
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF"); // Tabela arka plan rengi
  const [padding, setPadding] = useState(5); // Varsayılan padding

  window.earcut = earcut;

  const handleChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case "sign_text":
        setText(value);
        break;
      case "font_size":
        setFontSize(parseInt(value, 10)); // Font boyutunu güncelle
        break;
      case "text_color":
        setTextColor(value); // Yazı rengini güncelle
        break;
      case "text_emissive_color":
        setTextEmissiveColor(value); // İç aydınlatma rengini güncelle
        break;
      case "background_color":
        setBackgroundColor(value); // Arka plan rengini güncelle
        break;
      case "padding":
        setPadding(parseInt(value, 10)); // Padding'i güncelle
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new BABYLON.Engine(canvas, true);

    // Kaydırma işlemini devre dışı bırak
    canvas.addEventListener("mouseenter", () => {
      document.body.style.overflow = "hidden"; // Scroll'u kapat
    });

    canvas.addEventListener("mouseleave", () => {
      document.body.style.overflow = ""; // Scroll'u aç
    });

    const createScene = async () => {
      const scene = new BABYLON.Scene(engine);
    
      // Font verisini yükle
      const fontData = await (await fetch("https://assets.babylonjs.com/fonts/Droid Sans_Regular.json")).json();
      
      const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    
      // Material'leri bir kez oluştur
      const backgroundMaterial = new BABYLON.StandardMaterial("backgroundMaterial", scene);
      backgroundMaterial.diffuseColor = BABYLON.Color3.FromHexString(backgroundColor); // Arka plan rengi
    
      const textMaterial = new BABYLON.StandardMaterial("textMaterial", scene);
      textMaterial.diffuseColor = BABYLON.Color3.FromHexString(textColor); // Yazı rengi
      textMaterial.emissiveColor = BABYLON.Color3.FromHexString(textEmissiveColor); // İç aydınlatma rengi
    
      // Metin için mesh ve arka planı baştan oluştur
      let myText = BABYLON.MeshBuilder.CreateText(
        "myText",
        "type a text",
        fontData,
        {
          size: fontSize,
          resolution: 64,
          depth: 10,
        },
        scene
      );
      myText.material = textMaterial;
    
      const background = BABYLON.MeshBuilder.CreateBox("background", {
        width: myText.getBoundingInfo().boundingBox.extendSize.x * 2 + padding * 2,
        height: myText.getBoundingInfo().boundingBox.extendSize.y * 2 + padding * 2,
        depth: 0.1,
      }, scene);
      background.material = backgroundMaterial;
      background.position.y = (background.getBoundingInfo().boundingBox.extendSize.y - padding * 2) / 2;
    
      // Input GUI
      const inputText = new GUI.InputText();
      inputText.width = "200px";
      inputText.height = "40px";
      inputText.text = "type a text";
      inputText.color = "white";
      inputText.background = "black";
      inputText.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
      inputText.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;

      // Font boyutu için kaydırıcı
      const slider = new GUI.Slider();
      slider.minimum = 8;
      slider.maximum = 32;
      slider.value = 16;
      slider.height = "20px";
      slider.width = "200px";
      slider.onValueChangedObservable.add(function (value) {
        reWriteText();
      });

      // Renk seçici
      const colorPicker = new GUI.ColorPicker();
      colorPicker.value = BABYLON.Color3.Red();
      colorPicker.size = "150px";
      colorPicker.onValueChangedObservable.add(function (value) {
        setTextColor(value);
        reWriteText();
      });
      // Tekrar mesh oluşturmak yerine sadece metni güncelle
      inputText.onTextChangedObservable.add((eventData) => {
        eventData.text = eventData.text.length ? eventData.text : "type a text";
        setText(eventData.text);
        reWriteText();
      });

      const reWriteText = () => {
        myText.dispose(); // Eski mesh'i tamamen dispose et
        myText = BABYLON.MeshBuilder.CreateText(
          "myText",
          text,
          fontData,
          {
            size: fontSize,
            resolution: 64,
            depth: 10,
          },
          scene
        );
        myText.material = textMaterial;
    
        // Bounding box'a göre arka planı güncelle
        const newWidth = myText.getBoundingInfo().boundingBox.extendSize.x * 2 + padding * 2;
        const newHeight = myText.getBoundingInfo().boundingBox.extendSize.y * 2 + padding * 2;
        background.scaling.x = newWidth / background.scaling.x;
        background.scaling.y = newHeight / background.scaling.y;
      };
    
      advancedTexture.addControl(inputText);
      advancedTexture.addControl(slider);
      advancedTexture.addControl(colorPicker);
    
      // Kamera ve ışık ayarları
      scene.createDefaultCameraOrLight(true);
      scene.activeCamera.attachControl(canvas, true);
    
      return scene;
    };

    // İlk sahne oluşturma
    const scene = createScene();

    // Render döngüsü
    engine.runRenderLoop(() => {
      scene.then(s => s.render());
    });

    // Pencere yeniden boyutlandırıldığında motoru güncelle
    window.addEventListener("resize", () => {
      engine.resize();
    });

    return () => {
      engine.dispose(); // Temizleme işlemi
    };
  }, [text, fontSize, textColor, textEmissiveColor, backgroundColor, padding]);

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8 h-screen">
      <div className="mx-auto flex justify-center max-w-2xl py-36 sm:py-32 lg:py-0 lg:pt-24">
        <div className="text-center w-fit">
          <span className="text-balance break-keep text-4xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Tablonuzun Metnini Girin
          </span>
          <div className="mt-3.5">
            <input
              type="text"
              id="sign_text"
              value={text}
              onChange={handleChange} // Input değişikliğini yakala
              className="bg-gray-50 text-center border outline-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
            <label htmlFor="font_size" className="block text-left text-gray-900 text-sm font-medium mt-2.5"></label>
            <input type="range" id="font_size" value={fontSize} onChange={handleChange} min="8" max="32" className="mt-2.5" />

            <label htmlFor="text_color" className="block text-left text-gray-900 text-sm font-medium mt-2.5"></label>
            <input type="color" id="text_color" value={textColor} onChange={handleChange} className="mt-2.5" />

            <label htmlFor="text_emissive_color" className="block text-left text-gray-900 text-sm font-medium mt-2.5"></label>
            <input type="color" id="text_emissive_color" value={textEmissiveColor} onChange={handleChange} className="mt-2.5" />

            <label htmlFor="background_color" className="block text-left text-gray-900 text-sm font-medium mt-2.5"></label>
            <input type="color" id="background_color" value={backgroundColor} onChange={handleChange} className="mt-2.5" />

            <label htmlFor="padding" className="block text-left text-gray-900 text-sm font-medium mt-2.5"></label>
            <input type="range" id="padding" value={padding} onChange={handleChange} min="0" max="10" className="mt-2.5" />

          </div>
        </div>
      </div>

      {/* Babylon.js Canvas */}
      <div className="mx-auto flex justify-center max-w-2xl py-36 sm:py-32 lg:py-0 lg:pt-24">
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}

export default Workshop;
