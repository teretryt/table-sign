import React, { useEffect, useRef, useState } from "react";
import earcut from 'earcut';
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import { AdvancedDynamicTexture, TextBlock } from 'babylonjs-gui';
import * as lil from "lil-gui";
import "../styles/workshop.css";

function Workshop() {
  const canvasRef = useRef(null);
  const addTextButtonRef = useRef(null);
  const guiRef = useRef(null); // GUI referansı
  const [svgContent, setSvgContent] = useState(null);
  const [stateChanged, setStateChanged] = useState(false);

  window.earcut = earcut;

  useEffect(() => {
    const canvas = canvasRef.current;
    const addTextButton = addTextButtonRef.current;
    const loadFileBtn = document.getElementById("loadFileBtn");
    const engine = new BABYLON.Engine(canvas, true);
    const textColorList = {
      "white": "#ffffff",
      "red": "#ff0000",
      "green": "#00ff00",
      "blue": "#0000ff",
      "yellow": "#ffff00",
      "cyan": "#00ffff",
      "magenta": "#ff00ff",
      "gray": "#808080",
      "orange": "#ffa500",
      "purple": "#800080",
      "brown": "#a52a2a",
      "black": "#000000",
    };

    const meterialPathList = {
      "METAL": "http://localhost:3000/textures/environment.env",
    };

    let preparedMaterials = {};
    let labels = [];

    let caseColor = "#ffffff";
    let backgroundIsVısıble = false;
    let textColorFront = "#ffffff";
    let textColorSide = "#ffffff";
    let selectedMaterial = "none";
    let sideFaceIsLit = false;
    let frontFaceIsLit = false;
    let singleLit = false;
    let isSingleColor = false;
    let padding = 10;
    let fontSize = 15;
    let textDepth = 1;
    let text = "Table Sign";
    const fontFamilies = {};
    let selectedFont = "OpenSans";

    let fontData = null;
    let texts = {};
    let initializedTexts = [];
    let thinText = null;// YAN YÜZ MAT OLURSA KULLANILACAK İNCE YAZI
    let background = null;// ARKAPLAN YANİ zemin
    let light = null;
    let oldMesh = null;
    let noRender = 0;

    let scene = null;
    let gizmoManager = null;
    let assetsManager = null;
    /* DEFİNE ATTRİBUTES */
    let textAttribute, bgAttribute, ssiAttribute, ffiAttribute, singleLitBtn, singleColorBtn, fontSelection, fontSizeAttribute, textDepthAttribute, colorsFolder, colorsFolder2, materialFolder, mainColorFolder, caseColorFolder;

    // Kaydırma işlemini devre dışı bırak
    canvas.addEventListener("mouseenter", () => {
      document.body.style.overflow = "hidden"; // Scroll'u kapat
    });

    canvas.addEventListener("mouseleave", () => {
      document.body.style.overflow = ""; // Scroll'u aç
    });

    canvas.addEventListener("keydown", (e) => {
      if (e.keyCode == 27)
      {
        if (gizmoManager)
          gizmoManager.attachToMesh(null);
        guiRef.current.domElement.style.display = "none";

        deleteLabels();
      }
      if (e.keyCode == 46)
        if (gizmoManager.attachedMesh && gizmoManager.attachedMesh.name != "background") {
          const mesh = gizmoManager.attachedMesh;
          const meshName = mesh.name;
          mesh.dispose();
          const m = scene.getMaterialByName(meshName + "_textMaterial");
          const tm = scene.getMaterialByName(meshName + "_thinTextMaterial");
          if (m)
            m.dispose();
          if (tm)
            tm.dispose();

          //delete from texts
          delete texts[mesh.name];
          //delete from initializedTexts
          initializedTexts = initializedTexts.filter((item) => item !== mesh.name);

          gizmoManager.attachToMesh(null);
        }
      //gizmo manager
      if (e.keyCode == 87) {
        gizmoManager.scaleGizmoEnabled = false;
        gizmoManager.rotationGizmoEnabled = false;
        gizmoManager.positionGizmoEnabled = !gizmoManager.positionGizmoEnabled;
      }
      if (e.keyCode == 83 && gizmoManager.attachedMesh && !((gizmoManager.attachedMesh.name).toString().startsWith("text"))) {
        gizmoManager.positionGizmoEnabled = false;
        gizmoManager.rotationGizmoEnabled = false;
        gizmoManager.scaleGizmoEnabled = !gizmoManager.scaleGizmoEnabled;
      }
      if (e.keyCode == 82 && gizmoManager.attachedMesh && !((gizmoManager.attachedMesh.name).toString().startsWith("text"))) {
        gizmoManager.positionGizmoEnabled = false;
        gizmoManager.scaleGizmoEnabled = false;
        //setup rotation gizmo step 45 degree
        gizmoManager.rotationGizmoEnabled = !gizmoManager.rotationGizmoEnabled;
      }
    });

    addTextButton.addEventListener("click", () => {
      let createdIndex = initializedTexts.length;

      //if text + initializedTexts.length exists, create text + initializedTexts.length + 1 
      while (initializedTexts.includes("text" + (createdIndex).toString())) {
        createdIndex++;
      }
      initializedTexts.push("text" + createdIndex);
      createTextAndEvents(scene, "text" + createdIndex);

      //select new text mesh
      const m = scene.getMeshByName("text" + createdIndex);
      gizmoManager.attachToMesh(m);

      guiSetDefaults();
    });

    const handleFileSelect = (evt) => {
      const files = evt.target.files;
      const filename = files[0].name;
      const blob = new Blob([files[0]]);

      BABYLON.FilesInput.FilesToLoad[filename.toLowerCase()] = blob;

      assetsManager.addMeshTask('', '', 'file:', filename);
      assetsManager.load();

      // Dosyaları temizle
      loadFileBtn.value = '';
    };

    loadFileBtn.onchange = handleFileSelect;

    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("gui-front-color-btn")) {
        document.querySelectorAll(".gui-front-color-btn").forEach((btn) => {
          btn.classList.remove("active");
        });
        e.target.classList.add("active");
      }
      if (e.target.classList.contains("gui-side-color-btn")) {
        document.querySelectorAll(".gui-side-color-btn").forEach((btn) => {
          btn.classList.remove("active");
        });
        e.target.classList.add("active");
      }
      if (e.target.classList.contains("gui-main-color-btn")) {
        document.querySelectorAll(".gui-main-color-btn").forEach((btn) => {
          btn.classList.remove("active");
        });
        e.target.classList.add("active");
      }
      /* if (e.target.getAttribute("id", "openFileBtn")) {
        loadFileBtn.click();
      } */
    });

    const guiSetDefaults = () => {
      noRender = 1;

      textAttribute.setValue("Table Sign");
      fontSizeAttribute.setValue(15);
      textDepthAttribute.setValue(1);
      fontSelection.setValue("OpenSans");
      bgAttribute.setValue(false);
      ssiAttribute.setValue(false);
      ffiAttribute.setValue(false);
      singleLitBtn.setValue(false);
      singleColorBtn.setValue(false);
      selectedMaterial = preparedMaterials["p_pleksi"];
      colorsFolder.domElement.querySelector(".children").querySelectorAll("button").forEach((btn) => {
        btn.classList.remove("active");
        if (btn.getAttribute("data-color") == "#ffffff")
          btn.classList.add("active");
      });
      colorsFolder2.domElement.querySelector(".children").querySelectorAll("button").forEach((btn) => {
        btn.classList.remove("active");
        if (btn.getAttribute("data-color") == "#ffffff")
          btn.classList.add("active");
      });
      mainColorFolder.domElement.querySelector(".children").querySelectorAll("button").forEach((btn) => {
        btn.classList.remove("active");
        if (btn.getAttribute("data-color") == "#ffffff")
          btn.classList.add("active");
      });
      caseColorFolder.domElement.querySelector(".children").querySelectorAll("button").forEach((btn) => {
        btn.classList.remove("active");
        if (btn.getAttribute("data-color") == "#ffffff")
          btn.classList.add("active");
      }
      );
      materialFolder.domElement.querySelector(".children").querySelectorAll("button").forEach((btn) => {
        btn.classList.remove("active");
        if (btn.getAttribute("data-material") == "pleksi")
          btn.classList.add("active");
      }
      );

      noRender = 0;
    };

    const createGui = (scene) => {
      guiRef.current = new lil.GUI({ autoPlace: false, container: document.getElementById("gui-container"), title: "Kontroller" }); // GUI'yi otomatik olarak yerleştirme
      // Text Folder
      const textFolder = guiRef.current.addFolder("Metin");
      textFolder.domElement.id = "gui-TextFolder";

      // Text input
      textAttribute = textFolder.add({ text }, 'text').name("Metin").onChange((value) => {
        text = value;
        if (text.length > 0 && noRender == 0)
          reWriteText(scene);
      });

      // Arkaplan gözüksün mü?
      bgAttribute = textFolder.add({ backgroundIsVısıble }, 'backgroundIsVısıble').name("Arkaplan Görünümü").onChange((value) => {
        backgroundIsVısıble = value;
        if (!backgroundIsVısıble)
          caseColorFolder.domElement.classList.add("force-d-none");
        else
          caseColorFolder.domElement.classList.remove("force-d-none");
        background.visibility = backgroundIsVısıble ? 1 : 0;
        if (noRender == 0)
          reWriteText(scene);
      });
      // Yan yüzeyler aydınlatmalı mı?
      ssiAttribute = textFolder.add({ sideFaceIsLit }, 'sideFaceIsLit').name("Yan Yüzeyler Aydınlatılsın mı?").onChange((value) => {
        if (sideFaceIsLit == value)
          return;
        sideFaceIsLit = value;
        if (noRender == 0)
          reWriteText(scene);
      });
      // Ön yüzey aydınlatılsın mı?
      ffiAttribute = textFolder.add({ frontFaceIsLit }, 'frontFaceIsLit').name("Ön Yüzey Aydınlatılsın mı?").onChange((value) => {
        if (frontFaceIsLit == value)
          return;
        frontFaceIsLit = value;
        if (noRender == 0)
          reWriteText(scene);
      });
      //Aydınlat
      singleLitBtn = textFolder.add({ singleLit }, 'singleLit').name("Aydınlat").onChange((value) => {
        if (singleLit == value)
          return;
        singleLit = value;
        if (noRender == 0)
          reWriteText(scene);
      });
      singleLitBtn.domElement.style.display = "none";
      // Tek Renk Olsun mu?
      singleColorBtn = textFolder.add({ isSingleColor }, 'isSingleColor').name("Tek Renk").onChange((value) => {
        if (isSingleColor == value)
          return;
        isSingleColor = value;
        // colorsFolder 1 ve 2 nin görünümünü kapat
        colorsFolder.domElement.style.display = value ? "none" : "block";
        colorsFolder2.domElement.style.display = value ? "none" : "block";
        ffiAttribute.domElement.style.display = value ? "none" : "flex";
        ssiAttribute.domElement.style.display = value ? "none" : "flex";
        singleLitBtn.domElement.style.display = value ? "flex" : "none";
        singleLitBtn.setValue(false);
        if (value) {
          singleLit = false;
          ffiAttribute.setValue(false);
          ssiAttribute.setValue(false);
        }
        mainColorFolder.domElement.style.display = value ? "block" : "none";
        if (noRender == 0)
          reWriteText(scene);
      });

      // Font Selection
      fontSelection = textFolder.add({ fontData }, 'fontData', Object.keys(fontFamilies)).name("Font").onChange(async (value) => {
        console.log(value);
        if (Object.keys(fontFamilies).includes(value)) {
          fontData = fontFamilies[value];
          selectedFont = value;

          if (gizmoManager.attachedMesh) {
            const meshName = gizmoManager.attachedMesh.name;
            if (texts[meshName]) {
              texts[meshName]["fontFamily"] = value;
            }
          }
        }
        if (noRender == 0)
          reWriteText(scene);
      });
      fontSelection.setValue("OpenSans");
      fontSelection.domElement.id = "fontSelectionElement";

      // Case Color Folder
      caseColorFolder = guiRef.current.addFolder("Zemin Rengi");
      caseColorFolder.domElement.id = "gui-caseFolder";
      caseColorFolder.domElement.querySelector(".children").classList.add("flex", "flex-wrap");
      //add color buttons to colors folder from textColorList
      for (const [key, value] of Object.entries(textColorList)) {
        const options = {
          action: () => {
            caseColor = value;
            background.material.albedoColor = new BABYLON.Color3.FromHexString(value);
            if (noRender == 0)
              reWriteText(scene);
          },
        };
        let btn = caseColorFolder.add(options, 'action').name("");
        btn.domElement.classList.add("w-10", "h-10", "m-1");
        btn.domElement.querySelector("button").style.backgroundColor = value;
        btn.domElement.querySelector("button").classList.add("force-rounded-full");
      }


      // Colors Folder 
      colorsFolder = guiRef.current.addFolder("Ön Yüzey Rengi");
      colorsFolder.domElement.id = "gui-colorsFolder";
      colorsFolder.domElement.querySelector(".children").classList.add("flex", "flex-wrap");
      //add color buttons to colors folder from textColorList
      for (const [key, value] of Object.entries(textColorList)) {
        const options = {
          action: () => {
            textColorFront = value;
            if (noRender == 0)
              reWriteText(scene);
          },
        };
        let btn = colorsFolder.add(options, 'action').name("");
        btn.domElement.classList.add("w-10", "h-10", "m-1");
        btn.domElement.querySelector("button").style.backgroundColor = value;
        btn.domElement.querySelector("button").classList.add("force-rounded-full");
        btn.domElement.querySelector("button").setAttribute("data-color", value);
        btn.domElement.querySelector("button").classList.add("gui-front-color-btn");
      }

      colorsFolder2 = guiRef.current.addFolder("Yan Yüzeylerin Rengi");
      colorsFolder2.domElement.id = "gui-colorsFolder2";
      colorsFolder2.domElement.querySelector(".children").classList.add("flex", "flex-wrap");
      //add color buttons to colors folder from textColorList
      for (const [key, value] of Object.entries(textColorList)) {
        const options = {
          action: () => {
            textColorSide = value;
            if (noRender == 0)
              reWriteText(scene);
          },
        };
        let btn = colorsFolder2.add(options, 'action').name("");
        btn.domElement.classList.add("w-10", "h-10", "m-1");
        btn.domElement.querySelector("button").style.backgroundColor = value;
        btn.domElement.querySelector("button").classList.add("force-rounded-full");
        btn.domElement.querySelector("button").setAttribute("data-color", value);
        btn.domElement.querySelector("button").classList.add("gui-side-color-btn");
      }

      materialFolder = guiRef.current.addFolder("Materyal");
      materialFolder.domElement.id = "gui-materialFolder";
      materialFolder.domElement.querySelector(".children").classList.add("flex", "flex-wrap", "justify-around", "gap-2");
      //add color buttons to colors folder from textColorList
      const foundEntry = Object.entries(preparedMaterials).filter(([key, value]) => value.is_text_color);

      for (const [key, value] of foundEntry) {
        const options = {
          action: () => {
            selectedMaterial = value;
            if (value["name"] != "pleksi") {
              singleColorBtn.setValue(true);
              singleColorBtn.domElement.style.display = "none";
              mainColorFolder.domElement.querySelector(".title").innerText = "Arkaplan Aydınlatma Rengi";
            }else {
              console.log("Pleksi");
              singleColorBtn.setValue(false);
              singleColorBtn.domElement.style.display = "flex";
              mainColorFolder.domElement.querySelector(".title").innerText = "Renk";
            }
            if (noRender == 0)
              reWriteText(scene);
          },
        };
        let btn = materialFolder.add(options, 'action').name("");
        btn.domElement.classList.add("w-20", "h-24", "m-1", "force-p-0");
        btn.domElement.querySelector(".widget").classList.add("h-full", "flex", "flex-col", "justify-center", "items-center");
        btn.domElement.querySelector("button").style.background = "url(" + value.textureicon + ")";
        btn.domElement.querySelector("button").style.backgroundSize = "cover";
        btn.domElement.querySelector("button").classList.add("force-rounded-full", "force-h-full");
        btn.domElement.querySelector("button").setAttribute("data-material", value["name"]);
        btn.domElement.querySelector("button").classList.add("gui-side-material-btn");
        //add material name image bottom
        btn.domElement.querySelector(".widget").appendChild(document.createElement("p")).innerText = value.displayName;
      }

      mainColorFolder = guiRef.current.addFolder("Renk");
      mainColorFolder.domElement.id = "gui-mainColorFolder";
      mainColorFolder.domElement.querySelector(".children").classList.add("flex", "flex-wrap");
      //add color buttons to colors folder from textColorList
      for (const [key, value] of Object.entries(textColorList)) {
        const options = {
          action: () => {
            textColorSide = value;
            textColorFront = value;
            if (noRender == 0)
              reWriteText(scene);
          },
        };
        let btn = mainColorFolder.add(options, 'action').name("");
        btn.domElement.classList.add("w-10", "h-10", "m-1");
        btn.domElement.querySelector("button").style.backgroundColor = value;
        btn.domElement.querySelector("button").classList.add("force-rounded-full");
        btn.domElement.querySelector("button").setAttribute("data-color", value);
        btn.domElement.querySelector("button").classList.add("gui-main-color-btn");
      }
      mainColorFolder.domElement.style.display = "none";

      textDepthAttribute= guiRef.current.add({ textDepth }, 'textDepth', 0, 10).name("Metin Derinliği").onChange((value) => {
        textDepth = value;
        if (noRender == 0)
          reWriteText(scene);
      });
      textDepthAttribute.domElement.querySelector(".widget .slider")?.remove();
      textDepthAttribute.domElement.querySelector(".widget input")?.setAttribute("type", "number");
      textDepthAttribute.domElement.querySelector(".widget input")?.setAttribute("step", 1);
      textDepthAttribute.domElement.querySelector(".widget input")?.setAttribute("min", 1);
      textDepthAttribute.domElement.querySelector(".widget input")?.setAttribute("max", 10);

      // Font Size Slider
      fontSizeAttribute = guiRef.current.add({ fontSize }, 'fontSize', 15, 80).name("Yazı Boyutu").onChange((value) => {
        fontSize = value;
        if (noRender == 0)
          reWriteText(scene);
      });
      // font size attribute step 1 er er olsun
      fontSizeAttribute.domElement.querySelector(".widget .slider")?.remove();
      fontSizeAttribute.domElement.querySelector(".widget input")?.setAttribute("type", "number");
      fontSizeAttribute.domElement.querySelector(".widget input")?.setAttribute("step", 1);
      fontSizeAttribute.domElement.querySelector(".widget input")?.setAttribute("min", 15);
      fontSizeAttribute.domElement.querySelector(".widget input")?.setAttribute("max", 80);
      guiRef.current.close();
    };

    const representGui = () => {
      const guiTextFolder = document.getElementById("gui-TextFolder");
      const guiCaseFolder = document.getElementById("gui-caseFolder");
      const guiColorsFolder = document.getElementById("gui-colorsFolder");
      const guiColorsFolder2 = document.getElementById("gui-colorsFolder2");
      const guiMainColorFolder = document.getElementById("gui-mainColorFolder");
      const guiMaterialFolder = document.getElementById("gui-materialFolder");

      if (gizmoManager && gizmoManager.attachedMesh) {
        const meshName = gizmoManager.attachedMesh.name;
        if (meshName == "background") {
          //case folder display manage
          guiTextFolder.classList.add("force-d-none");
          guiColorsFolder.classList.add("force-d-none");
          guiColorsFolder2.classList.add("force-d-none");
          guiMainColorFolder.classList.add("force-d-none");
          guiCaseFolder.classList.remove("force-d-none");
          guiMaterialFolder.classList.add("force-d-none");

        }
        if (texts[meshName]) {
          /* AÇ KAPA */
          guiTextFolder.classList.remove("force-d-none");
          guiColorsFolder.classList.remove("force-d-none");
          guiColorsFolder2.classList.remove("force-d-none");
          guiMainColorFolder.classList.remove("force-d-none");
          guiMaterialFolder.classList.remove("force-d-none");
          guiCaseFolder.classList.add("force-d-none");

          /* AÇ KAPA */
          /* BİLGİ DOLDUR */
          /* texts[name] = {
            "name": name,
            "fontSize": texts[name] ? texts[name]["fontSize"] : fontSize,
            "fontFamily": texts[name] ? texts[name]["fontFamily"] : selectedFont,
            "thinText": undefined
          } */
          const textObject = texts[meshName];
          if (textObject === undefined)
            return;

          try {
            textAttribute.domElement.querySelector(".widget input").value = textObject.text;
            fontSizeAttribute.domElement.querySelector(".widget input").value = textObject.fontSize;
            textDepthAttribute.domElement.querySelector(".widget input").value = textObject.depth;
            ffiAttribute.domElement.querySelector(".widget input").checked = textObject.frontFaceLit;
            ssiAttribute.domElement.querySelector(".widget input").checked = textObject.sideFaceLit;

            text = textObject.text;
            fontSize = textObject.fontSize;
            textDepth = textObject.depth;
            textColorFront = textObject.textColorFront;
            textColorSide = textObject.textColorSide;
            frontFaceIsLit = textObject.frontFaceLit;
            sideFaceIsLit = textObject.sideFaceLit;
            singleLit = textObject.singleLit;
            isSingleColor = textObject.isSingleColor;
            fontData = fontFamilies[textObject.fontFamily];
            selectedMaterial = textObject.material;
            fontSelection.setValue(textObject.fontFamily);


            singleLitBtn.setValue(textObject.singleLit);
            singleColorBtn.setValue(textObject.isSingleColor);

            colorsFolder.domElement.querySelector(".children").querySelectorAll("button").forEach((btn) => {
              if (btn.getAttribute("data-color") == textObject.textColorFront)
                btn.classList.add("active");
              else
                btn.classList.remove("active");
            });
            colorsFolder2.domElement.querySelector(".children").querySelectorAll("button").forEach((btn) => {
              if (btn.getAttribute("data-color") == textObject.textColorSide)
                btn.classList.add("active");
              else
                btn.classList.remove("active");
            });
            mainColorFolder.domElement.querySelector(".children").querySelectorAll("button").forEach((btn) => {
              if (btn.getAttribute("data-color") == textObject.textColorSide)
                btn.classList.add("active");
              else
                btn.classList.remove("active");
            });
            materialFolder.domElement.querySelector(".children").querySelectorAll("button").forEach((btn) => {
              if (btn.getAttribute("data-material") == textObject.material["name"])
                btn.classList.add("active");
              else
                btn.classList.remove("active");
            });

            console.log("Text Object", textObject);
          } catch (error) {
            console.log("Hata: ", error);
          }

        } else if (meshName != "background") {
          /* AÇ KAPA */
          guiTextFolder.classList.add("force-d-none");
          guiColorsFolder.classList.add("force-d-none");
          guiColorsFolder2.classList.add("force-d-none");
          guiMainColorFolder.classList.add("force-d-none");
          guiCaseFolder.classList.add("force-d-none");
          /* AÇ KAPA */
        }
      }
    };

    const createScene = async () => {
      scene = new BABYLON.Scene(engine);

      assetsManager = new BABYLON.AssetsManager(scene);
      gizmoManager = new BABYLON.GizmoManager(scene);
      gizmoManager.positionGizmoEnabled = true;
      gizmoManager.rotationGizmoEnabled = true;
      gizmoManager.gizmos.rotationGizmo.snapDistance = Math.PI / 4;

      //Bir mesh dışardan yüklendiğinde tetiklenen event
      assetsManager.onTaskSuccessObservable.add(function (task) {
        let mesh = task.loadedMeshes[0];

        // Nesneyi normalize et ve döndür
        /* mesh.normalizeToUnitCube();
 */
        // Materyal ekleme
        const material = new BABYLON.StandardMaterial('stlMaterial', scene);
        material.diffuseColor = new BABYLON.Color3(0, 0, 1); // Kırmızı renk
        mesh.material = material; // Materyali mesh'e ata
      });

      // Bir mesh seçildiğinde tetiklenen event
      gizmoManager.onAttachedToMeshObservable.add((selectedMesh) => {
        deleteLabels();
        guiRef.current.domElement.style.display = "flex";

        if (oldMesh)
          oldMesh.showBoundingBox = false;
        if (selectedMesh) {
          const smn = selectedMesh.name;
          oldMesh = selectedMesh;
          if (smn != "background")
            gizmoManager.scaleGizmoEnabled = false;
          selectedMesh.showBoundingBox = true;
          console.log("Seçilen Mesh Adı:", smn);
          calculateMeshBounds(selectedMesh);
        } else {
          console.log("Seçim kaldırıldı");
        }
        representGui();
      });

      //gizmo hareket ettirme işlemi yaptıpığında tetiklenen event
      gizmoManager.gizmos.positionGizmo.onDragEndObservable.add((event) => {
        if (gizmoManager.attachedMesh) {
          const meshName = gizmoManager.attachedMesh.name;
          if (texts[meshName]) {
            texts[meshName]["x"] = gizmoManager.attachedMesh.position.x;
            texts[meshName]["y"] = gizmoManager.attachedMesh.position.y;
            texts[meshName]["z"] = gizmoManager.attachedMesh.position.z;
          }
        }
      });

      gizmoManager.positionGizmoEnabled = false;
      gizmoManager.rotationGizmoEnabled = false;

      // initialize prepared materials
      preparedMaterials =
      {
        "p_silver_chrome": {
          "name": "chrome",
          "displayName": "Krom",
          "metallic": 1,
          "roughness": 0.0,
          "reflectionTexture": new BABYLON.CubeTexture(meterialPathList.METAL, scene),
          "microSurface": 0.96,
          "albedoColor": "#ffffff",
          "is_text_color": true,
          "textureicon": "http://localhost:3000/texture_icons/chrome.png"
        },
        "p_gold_chrome": {
          "name": "gold_chrome",
          "displayName": "Altın Krom",
          "metallic": 1,
          "roughness": 0.0,
          "reflectionTexture": new BABYLON.CubeTexture(meterialPathList.METAL, scene),
          "microSurface": 0.96,
          "albedoColor": "#d4af37",
          "is_text_color": true,
          "textureicon": "http://localhost:3000/texture_icons/gold_chrome.png"
        },
        "p_composite": {
          "name": "composite",
          "displayName": "Kompozit",
          "metallic": 0.4,
          "roughness": 0.3,
          "reflectionTexture": new BABYLON.CubeTexture(meterialPathList.METAL, scene),
          "microSurface": 0.8,
          "is_text_color": false
        },
        "p_pleksi": {
          "name": "pleksi",
          "displayName": "Pleksi",
          "metallic": 0.0,
          "roughness": 0.1,
          "reflectionTexture": new BABYLON.CubeTexture(meterialPathList.METAL, scene),
          "microSurface": 0.8,
          "textureicon": "http://localhost:3000/texture_icons/pleksi.png",
          "is_text_color": true
        },
      };
      //add font family example to json file
      fontFamilies.OpenSans = await (await fetch("http://localhost:3000/fonts/opensans.json")).json();
      fontFamilies.MontserratMedium = await (await fetch("http://localhost:3000/fonts/montserrat_m.json")).json();
      fontFamilies.MontserratThin = await (await fetch("http://localhost:3000/fonts/montserrat_t.json")).json();
      fontFamilies.OrbitronMedium = await (await fetch("http://localhost:3000/fonts/orbitron_m.json")).json();
      fontFamilies.SendFlowers = await (await fetch("http://localhost:3000/fonts/send_flowers.json")).json();
      fontFamilies.SourceSerifMedium = await (await fetch("http://localhost:3000/fonts/ss4m.json")).json();
      fontFamilies.SourceSerifMediumItalic = await (await fetch("http://localhost:3000/fonts/ss4mi.json")).json();

      fontData = await fontFamilies.OpenSans;

      const gl = new BABYLON.GlowLayer("glow", scene);
      gl.intensity = 1.0;
      gl.blurKernelSize = 64;

      //İLK YAZI
      createBackground(scene);
      initializedTexts.push("text0");
      createTextAndEvents(scene, "text0");

      if (!guiRef.current)
        createGui(scene);
      //Arc camera and hemishrephic light
      /* camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI /2, 5, BABYLON.Vector3.Zero(), scene); 
      camera.attachControl(canvas, true);*/

      light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
      light.intensity = 1.0;

      scene.createDefaultCameraOrLight(true);
      scene.activeCamera.attachControl(canvas, true);

      setStateChanged(true);

      return scene;
    };

    const getDefault = (prop) => {
      if (prop == "text")
        return "Table Sign";
      if (prop == "fontSize")
        return 15;
      if (prop == "depth")
        return 1;
      if (prop == "textColorFront" || prop == "textColorSide")
        return "#ffffff";
      if (prop == "frontFaceIsLit" || prop == "sideFaceIsLit" || prop == "singleLit")
        return false;
      if (prop == "isSingleColor")
        return false;
      if (prop == "material")
        return preparedMaterials["p_pleksi"];
    }

    const createBackground = (scene) => {
      let backgroundMaterial = new BABYLON.PBRMaterial("backgroundMaterial", scene);
      backgroundMaterial.albedoColor = BABYLON.Color3.FromHexString(caseColor);
      backgroundMaterial.metallic = preparedMaterials.p_composite.metallic;
      backgroundMaterial.roughness = preparedMaterials.p_composite.roughness;
      backgroundMaterial.microSurface = preparedMaterials.p_composite.microSurface;
      backgroundMaterial.reflectionTexture = preparedMaterials.p_composite.reflectionTexture;
      backgroundMaterial.alpha = 1;


      let backgroundWidth = 250; // Sol ve sağ padding ekle
      let backgroundHeight = 50; // Taban yüksekliği
      let backgroundDepth = 1.0; // Taban derinliği
      background = BABYLON.MeshBuilder.CreateBox("background", {
        width: backgroundWidth,
        height: backgroundHeight,
        depth: backgroundDepth
      }, scene);
      background.position.z = (backgroundDepth + 10) / 2; // Metnin önünde konumlandır
      background.position.y = 10;
      background.material = backgroundMaterial;
    };

    const createThinText = (scene, name, correctSingleLit, correctFrontLit, correctFrontColor) => {
      const thinTextDepth = 0.09; // İnce metin kalınlığını ayarla

      thinText = BABYLON.MeshBuilder.CreateText(
        `${name}_thinText`,
        texts[name]["text"],
        fontFamilies[texts[name]["fontFamily"]],
        {
          size: (texts[name]["fontSize"] * 1.0),
          resolution: 128,
          depth: thinTextDepth
        },
        scene
      );
      // İnce metin için mat materyali ayarla
      if (texts[name]["material"] != "none") {
        const thinTextMaterial = new BABYLON.PBRMaterial(`${name}_thinTextMaterial`, scene);
        thinTextMaterial.albedoColor = BABYLON.Color3.FromHexString(
          texts[name]["material"]?.albedoColor || correctFrontColor
        );
        thinTextMaterial.metallic = texts[name]["material"].metallic;
        thinTextMaterial.roughness = texts[name]["material"].roughness;
        thinTextMaterial.microSurface = texts[name]["material"].microSurface;
        thinTextMaterial.realTimeFiltering = true;
        thinTextMaterial.realTimeFilteringQuality = BABYLON.Constants.TEXTURE_FILTERING_QUALITY_HIGH;
        if (texts[name]["material"]["name"] == "pleksi" || (!correctSingleLit && texts[name]["material"]["name"] != "pleksi"))
          thinTextMaterial.reflectionTexture = new BABYLON.CubeTexture(meterialPathList.METAL, scene);
        if (correctFrontLit || (texts[name]["material"]["name"] != "pleksi" && correctSingleLit)) {
          thinTextMaterial.emissiveColor = BABYLON.Color3.FromHexString(correctFrontColor);
          thinTextMaterial.emissiveIntensity = 0.5;
        }
        thinTextMaterial.alpha = 1;
        thinText.material = thinTextMaterial;
        // İnce metni ana metnin önüne yerleştir
      }
      if (texts[name]["material"]["name"] != "pleksi")
        thinText.position.z = +((texts[name]["depth"] / 2) - ((texts[name]["depth"] / 220.0))); // Ana metnin arkasına yerleştir
      else
        thinText.position.z = -((texts[name]["depth"] / 2) - ((texts[name]["depth"] / 220.0))); // Ana metnin önüne yerleştir
      texts[name]["thinText"] = `${name}_thinText`;
      thinText.parent = scene.getMeshByName(name);
    };

    const createTextAndEvents = (scene, name) => {
      const correctText = texts[name] ? texts[name]["text"] : getDefault("text");
      const correctFontSize = texts[name] ? texts[name]["fontSize"] : getDefault("fontSize");
      const correctTextDepth = texts[name] ? texts[name]["depth"] : getDefault("depth");
      const correctFrontColor = texts[name] ? texts[name]["textColorFront"] : getDefault("textColorFront");
      const correctSideColor = texts[name] ? texts[name]["textColorSide"] : getDefault("textColorSide");
      const correctFrontLit = texts[name] ? texts[name]["frontFaceLit"] : getDefault("frontFaceIsLit");
      const correctSideLit = texts[name] ? texts[name]["sideFaceLit"] : getDefault("sideFaceIsLit");
      const correctSingleLit = texts[name] ? texts[name]["singleLit"] : getDefault("singleLit");
      const correctisSingleColor = texts[name] ? texts[name]["isSingleColor"] : getDefault("isSingleColor");
      const correctSelectedMaterial = texts[name] ? texts[name]["material"] : getDefault("material");

      let t = BABYLON.MeshBuilder.CreateText(
        name,
        correctText,
        texts[name] ? fontFamilies[texts[name]["fontFamily"]] : fontData,
        {
          size: (correctFontSize * 1.0),
          resolution: 128,
          depth: correctTextDepth
        },
        scene
      );
      if (texts[name]) {
        t.position.x = texts[name]["x"];
        t.position.y = texts[name]["y"];
        t.position.z = texts[name]["z"];
      }

      if (correctSelectedMaterial != "none") 
      {
        let textMaterial = new BABYLON.PBRMaterial(name + "_textMaterial", scene);
        textMaterial.albedoColor = BABYLON.Color3.FromHexString(
          correctSelectedMaterial?.albedoColor || correctSideColor
        );

        textMaterial.metallic = correctSelectedMaterial.metallic;
        textMaterial.roughness = correctSelectedMaterial.roughness;
        textMaterial.microSurface = correctSelectedMaterial.microSurface;
        textMaterial.reflectionTexture = new BABYLON.CubeTexture(meterialPathList.METAL, scene);
        textMaterial.realTimeFiltering = true;
        textMaterial.realTimeFilteringQuality = BABYLON.Constants.TEXTURE_FILTERING_QUALITY_HIGH;

        if ((correctSideLit || correctSingleLit) && correctSelectedMaterial["name"] == "pleksi") {
          textMaterial.emissiveColor = BABYLON.Color3.FromHexString(correctSideColor);
          textMaterial.emissiveIntensity = 0.5;
        }

        textMaterial.alpha = 1;
        t.material = textMaterial;
      }

      /* t.type = "TextObj"; */

      if (!(name in texts)) {
        console.log("girrrrr");
        texts[name] = {
          "name": name,
          "text": correctText,
          "depth": correctTextDepth,
          "fontSize": correctFontSize,
          "fontFamily": selectedFont,
          "thinText": undefined,
          "textColorFront": correctFrontColor,
          "textColorSide": correctSideColor,
          "sideFaceLit": correctSideLit,
          "frontFaceLit": correctFrontLit,
          "singleLit": correctSingleLit,
          "isSingleColor": correctisSingleColor,
          "material": correctSelectedMaterial,
          "x": 0,
          "y": 0,
          "z": 0
        }
      }

      if (correctSingleLit && correctSelectedMaterial["name"] == "pleksi") {
        texts[name]["thinText"] = undefined;
        return;
      }
      createThinText(scene, name, correctSingleLit, correctFrontLit, correctFrontColor);
    }

    const updateMesh = (scene, name) => {
      const mesh = scene.getMeshByName(name);
      console.log("UPDATING MESH", mesh);
      if (mesh)
      {
        mesh.dispose();
        if (texts[name]["thinText"]) {
          const thinTextMesh = scene.getMeshByName(texts[name]["thinText"]);
          if (thinTextMesh)
            thinTextMesh.dispose();
          const tm = scene.getMaterialByName(name + "_thinTextMaterial");
          if (tm)
            tm.dispose();
        }
        const m = scene.getMaterialByName(name + "_textMaterial");
        if (m)
          m.dispose();
        createTextAndEvents(scene, name);
      }
    };

    const updateTextAndEvents = (scene, selectedMeshName) => {
      if (!selectedMeshName)
        return;
      if (selectedMeshName in texts) {
        console.log("SELECTEDDDDDD", selectedMeshName);
        texts[selectedMeshName]["text"] = text;
        texts[selectedMeshName]["fontSize"] = fontSize;
        texts[selectedMeshName]["depth"] = textDepth;
        texts[selectedMeshName]["fontFamily"] = selectedFont;
        texts[selectedMeshName]["textColorFront"] = textColorFront;
        texts[selectedMeshName]["textColorSide"] = textColorSide;
        texts[selectedMeshName]["frontFaceLit"] = frontFaceIsLit;
        texts[selectedMeshName]["sideFaceLit"] = sideFaceIsLit;
        texts[selectedMeshName]["singleLit"] = singleLit;
        texts[selectedMeshName]["isSingleColor"] = isSingleColor;
        texts[selectedMeshName]["material"] = selectedMaterial;

        updateMesh(scene, selectedMeshName);
      }
    };

    const deleteLabels = () => {
      labels.forEach(label => {
        label.dispose();  // Etiketi sahneden kaldırma
      });
      labels.length = 0;  // Etiket listesini temizleme
    };

    //yazının en boy derinlik bilgilerini bounding boxdan alır ve bounding box etrafında yazdırır
    const calculateMeshBounds = () => {
      const text = gizmoManager.attachedMesh;
      if (text) {
        const meshName = text.name;
        const textObject = texts[meshName];
        if (textObject) {
          const textPosition = text.position;
          let textBounds = text.getBoundingInfo().boundingBox.extendSize;
          //şimdi ise alınan ölçüleri text in fontSize ına göre oranlayarak scale edeceğiz
          const scaleRat = ((textObject.fontSize * 1.0) / ((textBounds.y * 2 )* 1.0)).toFixed(3);
          text.scaling = new BABYLON.Vector3(scaleRat, scaleRat, 1);

          const textWidth = (textBounds.x * 2) * scaleRat;
          const textHeight = (textBounds.y * 2) * scaleRat;
          const textDepth = textBounds.z * 2;   
          console.log("w: ", textWidth, " h: ", textHeight, " d: ", textDepth);
    
          // 3D metin etiketlerini oluşturma fonksiyonu
          const create3DTextLabel = (textContent, position, padding, p) => {
            // 3D metin oluşturma
            const labelText = BABYLON.MeshBuilder.CreateText(
              "labelText" + p, 
              textContent, 
              fontFamilies.OpenSans,
              {
                size: 5,
                resolution: 64,
                depth: 1,
                faceColors: [new BABYLON.Color4(0, 1, 1, 1)]
              },
              scene
            );
            labels.push(labelText);
    
            const labelSize = labelText.getBoundingInfo().boundingBox.extendSize;

            if (p === "x") {
              position.y += padding; // Y ekseninde biraz offset ver
            } else if (p === "y") {
              position.x += -(labelSize.x + padding); // X ekseninde etiketin genişliğini ekleyin
              position.y += -labelSize.y; // Y ekseninde etiketin yüksekliğini düzeltin
              labelText.rotate(BABYLON.Axis.Z, Math.PI / 2, BABYLON.Space.WORLD); // Z ekseninde etiketi döndür
            } else if (p === "z") {
              position.x += labelSize.x + padding; // X ekseninde etiketin genişliğini ekleyin
              position.y += -labelSize.y * 2; // Y ekseninde etiketin yüksekliğini düzeltin
            }

            labelText.position = position;
    
            // Işıklandırmadan bağımsız olacak şekilde billboard modunu etkinleştirme
            labelText.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_ALL;
            //add child to text
            labelText.parent = text;
          };
    
          // Bounding box etrafına boyut etiketlerini yerleştiriyoruz
          create3DTextLabel(`W: ${textWidth.toFixed(2)} cm`, new BABYLON.Vector3(0 , textHeight, -textDepth + textDepth / 2), 5, "x");
          create3DTextLabel(`H: ${textHeight.toFixed(2)} cm`, new BABYLON.Vector3(-textWidth / 2, (textHeight / 2), -textDepth + textDepth / 2), 5, "y");
          create3DTextLabel(`D: ${textDepth.toFixed(2)} cm`, new BABYLON.Vector3(textWidth / 2, 0 , -textDepth + textDepth / 2), 5, "z");
        }
      }
    };


    const reWriteText = (scene) => {
      let selectedMeshName = null;

      if (gizmoManager.attachedMesh)
        selectedMeshName = gizmoManager.attachedMesh.name;
      updateTextAndEvents(scene, selectedMeshName);

      if (selectedMeshName)
      {
        const selectedMesh = scene.getMeshByName(selectedMeshName);
        if (selectedMesh) {
          gizmoManager.attachToMesh(selectedMesh);
        }
      }

    };

    const scenePromise = createScene();

    engine.runRenderLoop(() => {
      scenePromise.then(scene => scene.render());
    });

    window.addEventListener("resize", () => {
      engine.resize();
    });

    return () => {
      if (guiRef.current) {
        guiRef.current.destroy(); // GUI'yi temizle
        guiRef.current = null;
      }
      if (loadFileBtn)
      {
        loadFileBtn.removeEventListener("change", handleFileSelect);
      }
      engine.dispose();
    };
  }, [stateChanged]);

  return (
    <div className="relative isolate my-10 px-6 pt-14 lg:px-8 h-screen">
      {/* Babylon.js Canvas */}

      <div className="mx-auto flex justify-center w-full h-full py-24 sm:py-16 lg:py-0 lg:pt-24">
        <div id="gui-add-menu" className="absolute flex gap-x-2 py-2 align-center left-0 bottom-24 lg:bottom-auto px-8 lg:px-10">
          <button ref={addTextButtonRef} className="bg-slate-800 text-white p-2 rounded-md">+ Metin Ekle</button>
          {/* LOAD STL MODEL */}
          <input id="loadFileBtn" type="file" accept=".stl" className="bg-slate-800 p-2" />
        </div>
        <div id="gui-container" className="absolute right-0 px-6 lg:px-8" />
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}

export default Workshop;
