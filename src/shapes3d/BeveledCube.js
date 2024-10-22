/* import * as BABYLON from 'babylonjs';

export const createBeveledCube = (scene) => {
    var xR = 2; // bevel radius x direction
    var yR = 0; // bevel radius y direction
    var width = 18;
    var height = 7;
    var depth = 9;

    var w = width / 2;
    var h = height / 2;

    var n = 20; //increments around circle
    var a; //angle
    
    //Array of paths to construct extrusion
	var mainShape = [ ];

    mainShape.push(new BABYLON.Vector3(w, h - yR, 0));
	
    for (var i = 0; i < n; i++)	{
        a = i * Math.PI / (2 * n);
        mainShape.push(new BABYLON.Vector3(w - xR * (1 - Math.cos(a)), h - yR * (1 - Math.sin(a)), 0 ))
    }

    mainShape.push(new BABYLON.Vector3(w - xR, h, 0));
    mainShape.push(new BABYLON.Vector3(-w + xR, h, 0));
    
    for (var i = 0; i < n; i++)	{
        a = Math.PI / 2 + i * Math.PI / (2 * n);
        mainShape.push(new BABYLON.Vector3(-w + xR * ( 1 + Math.cos(a)), h - yR * (1 - Math.sin(a)), 0 ))
    }

	mainShape.push(new BABYLON.Vector3(-w, h - yR, 0));
	mainShape.push(new BABYLON.Vector3(-w, -h + yR, 0));

    for (var i = 0; i < n; i++)	{
        a = Math.PI + i * Math.PI / (2 * n);
        mainShape.push(new BABYLON.Vector3(-w + xR * ( 1 + Math.cos(a)), -h + yR * (1 + Math.sin(a)), 0 ))
    }

	mainShape.push(new BABYLON.Vector3(-w + xR, -h, 0));
	mainShape.push(new BABYLON.Vector3(w - xR, -h, 0));

    for (var i = 0; i < n; i++)	{
        a = 3 * Math.PI / 2 + i * Math.PI / (2 * n);
        mainShape.push(new BABYLON.Vector3(w - xR * ( 1 - Math.cos(a)), -h + yR * (1 + Math.sin(a)), 0 ))
    }

	mainShape.push(new BABYLON.Vector3(w, -h + yR, 0));

	mainShape.push(mainShape[0]);
	
	var mainPath = [
		new BABYLON.Vector3(0, 0, -depth / 2 + xR),
		new BABYLON.Vector3(0, 0, depth / 2 - xR)
	];
	
	var mainBody = BABYLON.MeshBuilder.ExtrudeShape("extruded", {shape: mainShape, path: mainPath, sideOrientation: BABYLON.Mesh.DOUBLESIDE, cap: BABYLON.Mesh.CAP_ALL}, scene);
	mainBody.convertToFlatShadedMesh();

    var endShape = [];
    endShape.push(new BABYLON.Vector3(xR / 2, -h + yR, 0));
    endShape.push(new BABYLON.Vector3(xR / 2, h - yR, 0));

    for (var i = 0; i < n; i++)	{
        a = Math.PI / 2 + i * Math.PI / (2 * n);
        endShape.push(new BABYLON.Vector3(xR / 2 + xR * Math.cos(a), h - yR * (1 - Math.sin(a)), 0))
    }

    endShape.push(new BABYLON.Vector3(-xR / 2, h - yR, 0));
    endShape.push(new BABYLON.Vector3(-xR / 2, -h + yR, 0));

    for (var i = 0; i < n + 1; i++)	{
        a = Math.PI + i * Math.PI / (2 * n);
        endShape.push(new BABYLON.Vector3(xR / 2 + xR * Math.cos(a),  -h + yR * (1 + Math.sin(a)), 0))
    }

    endShape.push(endShape[0]);

    var endPath = [
        new BABYLON.Vector3(-w + xR, 0, 0),
        new BABYLON.Vector3(w - xR, 0, 0)
    ]

    var endBody = BABYLON.MeshBuilder.ExtrudeShape("extruded", {shape: endShape, path: endPath, sideOrientation: BABYLON.Mesh.DOUBLESIDE, cap: BABYLON.Mesh.CAP_ALL}, scene);
	endBody.convertToFlatShadedMesh();

    endBody.position.z = 0.5 * (depth - xR);

    endBodyBack = endBody.clone("ebb");
    endBodyBack.rotation.y = Math.PI;
    endBodyBack.position.z = -0.5 * (depth - xR);

    var fillerShape = [];
    for (var i = 0; i < n; i++)	{
        a = 3 * Math.PI / 2 + i * Math.PI / (2 * n);
        fillerShape.push(new BABYLON.Vector3(xR * Math.cos(a), -h + yR * (1 + Math.sin(a)), 0))
    }

    fillerShape.push(new BABYLON.Vector3(xR, h - yR, 0));
    fillerShape.push(new BABYLON.Vector3(xR, -h + yR, 0));

    for (var i = 0; i < n + 1; i++)	{
        a = i * Math.PI / (2 * n);
        fillerShape.push(new BABYLON.Vector3(xR * Math.cos(a),  h - yR * (1 - Math.sin(a)), 0))
    }
    
    var filler = BABYLON.MeshBuilder.CreateLathe("lathe", {shape: fillerShape, arc: 0.25}, scene);
    filler.convertToFlatShadedMesh();
    
    filler.position.x = w - xR;
    filler.position.z = depth / 2 - xR;

    filler2 = filler.clone("f2");
    filler2.rotation.y = 3 * Math.PI / 2;
    filler2.position.x = -w + xR;

    filler3 = filler.clone("f3");
    filler3.rotation.y = Math.PI / 2;
    filler3.position.z = -(depth / 2 - xR);

    filler4 = filler.clone("f4");
    filler4.rotation.y = Math.PI;
    filler4.position.z = -(depth / 2 - xR);
    filler4.position.x = -w + xR;

    
}; */