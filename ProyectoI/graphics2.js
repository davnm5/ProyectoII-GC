//VAIABLES GLOBALES

    //OBTIENE EL OBJETO SELECCIONADO CON CLICK
    //var ONFOCUS_OBJECT;
    //OBTIENE LA LUZ SELECCIONADA DEL MENU
    var ONFOCUS_LIGHT;
    var KEYDOWN;
    var FUNCTION;

    var selected_object = null;
    var aux;
    var picking_method = 'transform';
    // instantiate raycaster 
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    // to orbit with mouse
    var mouseOrbit;

    //VARIABLES PARA LA ESCENA, CAMARA Y RENDERIZADO DE LA VENTANA
    var renderer
    var camera
    var scene
    var backgroundScene = "#002233"
    //VARIABLES PARA EEFECTO DEL MOUSE
    var presionado=false;
    var x_anterior;
    var y_anterior;
    var escala = 1;
    // var rotacion;
    
    //OBJETO COMPLEJO
    var cuboRubik = new THREE.Group();
    var pivotPoint = new THREE.Object3D();
    var cubePosX;
    var cubePosY;
    var cubePosZ;

    var cubeMesh;
    

    //CREA TRES VERTICES CON RESPECTO A UN CUBO PEQUEÑO EN TODAS LAS FIGURAS. 
    //TRASLACIONES PERMITIDAS CON DRAG
        //VERTICES -> EN LOS TRES EJES (X, Y, Z)
        //CUBO INTERIOR -> EN CUALQUIER DIRECCION
        //CARAS DEL CUBO -> EN LOS PLANOS (X-Y, X-Z, Y-Z)
    var splineHelperObjects = [], splineOutline;
    var splinePointsLength = 4;
    var transformControl;
    var ARC_SEGMENTS = 200;
    var splineMesh;
    var splines = {};
    var positions = [];

    //CONTENEDOR DE FIGURAS
    var figuras= new Object();
    objects=[];
    var normalizadores={};
    figuras.cantidad=0;


    //TABLERO
    var tablero = new THREE.Group();
    //SIZE OF THE TILES
    var tile_width=4;  
    var tile_color="#ffffff";
    //CUBO
    var cube_width = tile_width*0.75;

    //LUCES
    var distanceFromCenter = 1.75*tile_width;

var addLights = function( distanceFromCenter ){

    ambient_light = new THREE.AmbientLight("#ffffff",0.2 ); // soft white light
    //luces.push(ambient_light);
    scene.add(ambient_light);

    white_up = new THREE.SpotLight("#ffffff",1);
    //white_up_light.position.set(0 - tile_width, 20, 0 - tile_width);
    white_up.position.set(0, 200, 0);
    //luces.push(white_up_light);
    scene.add(white_up);

    white_down = new THREE.SpotLight("#ffffff",0.2);
    //white_down_light.position.set(0 - tile_width, -20, 0 - tile_width);
    white_down.position.set(0 - tile_width, -100, 0 - tile_width);
    scene.add(white_down);

    red = new THREE.SpotLight("#ff0000",6);
    red.position.set(distanceFromCenter - tile_width, 20, distanceFromCenter - tile_width);
    scene.add(red);

    green = new THREE.SpotLight("#00ff00",6);
    green.position.set( -distanceFromCenter - tile_width, 20, distanceFromCenter - tile_width);
    scene.add(green);

    blue = new THREE.SpotLight("#0000ff",6);
    blue.position.set( 0 - tile_width, 20, -distanceFromCenter - tile_width);
    scene.add(blue); 
    
}

var addTablero = function(){
    var tile_geometry = new THREE.BoxGeometry(tile_width,tile_width/10,tile_width);
    var black_material = new THREE.MeshPhongMaterial({ color:"#000000", side: THREE.DoubleSide, flatShading: true });   //fixed color
    var color_material = new THREE.MeshPhongMaterial({ color:tile_color, side: THREE.DoubleSide, flatShading: true });  //to change with gui
    var black_color = -1;
    //Chess Table has 64 tiles, 8 rows, 8 columns
    for(var i = 0; i < 8; i++){
        if (i % 2 == 0) { black_color = -1 }
        else { black_color = 1 };
        for(var j = 0; j < 8; j++){
            var material;
            if(black_color == 1){ material = black_material; }   // iterate black and white
            else{ material = color_material; }
            var tile = new THREE.Mesh( tile_geometry, material );
            tile.position.x = (-4 + j) * tile_width;
            tile.position.z = (-4 + i) * tile_width;
            tablero.add(tile);
            black_color *= -1; } }
    scene.add(tablero); 
    console.log(tablero.position);
}


var createRubikCube = function(){
    for(var i= 0;i<3;i++){
        for(var j=0;j<3;j++){
            for(var k=0;k<3;k++){
                let geometryC = new THREE.BoxGeometry(cube_width, cube_width, cube_width );
                if(i==0){
                    //pintar abajo
                    geometryC.faces[ 6 ].color.setHex(0x4b3621);
                    geometryC.faces[ 7 ].color.setHex(0x4b3621);
                }else if(i==2){
                    //pintar arriba
                    geometryC.faces[ 4 ].color.setHex(0xffffff);
                    geometryC.faces[ 5 ].color.setHex(0xffffff);
                }
                if(j==0){
                    //pintar atras
                    geometryC.faces[ 10 ].color.setHex(0xff0000);
                    geometryC.faces[ 11 ].color.setHex(0xff0000);
                }else if(j==2){
                    //pintar adelante
                    geometryC.faces[ 8 ].color.setHex(0xff5500);
                    geometryC.faces[ 9 ].color.setHex(0xff5500);
                }
                if(k==0){
                    //pintar izq
                    geometryC.faces[ 2 ].color.setHex(0x00ff55);
                    geometryC.faces[ 3 ].color.setHex(0x00ff55);
                }else if(k==2){
                    //pintar der
                    geometryC.faces[ 0 ].color.setHex(0xffff00);
                    geometryC.faces[ 1 ].color.setHex(0xffff00);
                }
                let material = new THREE.MeshLambertMaterial( { color: "#ffffff",side: THREE.DoubleSide, vertexColors: THREE.FaceColors, flatShading: true} );
                //let material = new THREE.MeshLambertMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors} );
                material.light = true;
                let cube = new THREE.Mesh(geometryC, material);
                cube.position.x = ((-1.65 + k) * cube_width)+(((k+1)%2)*(-1+k)*(cube_width/50));
                cube.position.z = ((-1.65 + j) * cube_width)+(((j+1)%2)*(-1+j)*(cube_width/50));
                cube.position.y = ((2 + i) * cube_width)+(((i+1)%2)*(-1+i)*(cube_width/50));
                cuboRubik.add(cube);
            }        
        }
    }
}

var addRubikCube = function(){
    var geometry = new THREE.BoxGeometry( 4, 4, 4 );
    var material = new THREE.MeshBasicMaterial( {color: 0x000000} );
    cubeMesh = new THREE.Mesh( geometry, material );
    cubeMesh.position.y = 3;

    cuboRubik.position.y =-7.5;
    cuboRubik.position.x =1;
    cuboRubik.position.z = 1;


    cubeMesh.add(cuboRubik);
    
    //cubeMesh.add(pivotPoint);
    scene.add(cubeMesh);
    //scene.add(cuboRubik);
}
var rmRubikCube = function(){
    cubeMesh.remove(pivotPoint);
    scene.add(pivotPoint);
    scene.remove(cubeMesh);
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
//FUNCION CREAR FIGURA 
figuras.agregar=function(name,geometria,COLOR){
    this.cantidad+=1;
    let nombre = this.cantidad+"."+name
    //SE CREA EL MATERIAL DE LA FIGURA
    
    /*if (name == "ESFERA" || name == "CILINDRO" || name== "TOROIDE") {
        let maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
        let cubeTexture = new THREE.CubeTextureLoader()
            .load([
                'https://dl.dropboxusercontent.com/s/vbnwu8hrqhfqy6o/sprite.png?dl=0',
                'https://dl.dropboxusercontent.com/s/vbnwu8hrqhfqy6o/sprite.png?dl=0',
                'https://dl.dropboxusercontent.com/s/vbnwu8hrqhfqy6o/sprite.png?dl=0',
                'https://dl.dropboxusercontent.com/s/vbnwu8hrqhfqy6o/sprite.png?dl=0',
                'https://dl.dropboxusercontent.com/s/vbnwu8hrqhfqy6o/sprite.png?dl=0',
                'https://dl.dropboxusercontent.com/s/vbnwu8hrqhfqy6o/sprite.png?dl=0']);
        cubeTexture.anisotropy = maxAnisotropy;
        cubeTexture.wrapS  = cubeTexture.wrapT = THREE.RepeatWrapping;
        //cubeTexture.repeat.set(2,2);

        var material = new THREE.MeshPhongMaterial( { color: COLOR, envMap: cubeTexture, side: THREE.DoubleSide, overdraw: 0.5 } );
    
    }
    */
    var material = new THREE.MeshPhongMaterial( { color: COLOR, overdraw: 0.5 } );
    this[nombre]=new Object();
    this[nombre].id=Math.trunc((this.cantidad-1)/3);
    //GENERA LA FIGURA
    this[nombre].esqueleto=new THREE.Mesh( geometria, material);
    normalizadores[this[nombre].esqueleto.uuid]= [];
    //this[nombre].esqueleto.position.x = Math.pow(-1,getRandomInt(0,2))*(getRandomInt(3*cube_width,4*cube_width));
    let posIniX = Math.pow(-1,getRandomInt(0,2))*(getRandomInt(3*cube_width,4*cube_width));
    let posIniZ = Math.pow(-1,getRandomInt(0,2))*(getRandomInt(3*cube_width,4*cube_width));
    let normIni = Math.sqrt((Math.pow(posIniX,2)+(Math.pow(posIniZ,2))));
    let angleIni = getRandomInt(1,361);
    //altura 
    this[nombre].esqueleto.position.y = getRandomInt(2*cube_width,4*cube_width);
    //posicion X-Z
    this[nombre].esqueleto.position.x = (normIni)*(Math.sin(angleIni*Math.PI/180));
    this[nombre].esqueleto.position.z = (normIni)*(Math.cos(angleIni*Math.PI/180));
    //rotacion 
    this[nombre].esqueleto.rotation.x = Math.random() * 2 * Math.PI;
    this[nombre].esqueleto.rotation.y = Math.random() * 2 * Math.PI;
    this[nombre].esqueleto.rotation.z = Math.random() * 2 * Math.PI;
    //EMITE SOMBRA
    this[nombre].esqueleto.castShadow = true;
    //GUARDA EL INVERSO DE LA MATRIZ DE DEFORMACIÓN
    this[nombre].normalizador=0;
    objects.push(this[nombre].esqueleto);
    //group.add(this[nombre].esqueleto);
    pivotPoint.add(this[nombre].esqueleto);
    splineHelperObjects.push(self.figuras[nombre].esqueleto)
    return nombre;
};

//VARIEBLE PARA CONTROLES DE LA INTERFAZ
var speed=0.025;
var speed_around=0.025;
var menu = {
    background: backgroundScene, 
    baldosas: tile_color,
    Rubik: true,
    
    rotar_alrededor: false,				//inicia con escena sin girar las figuras
    speed_around: this.speed_around,
    rotar: false,
    speed:this.speed,
    
    white_up: true, white_down: false, 
    red: false, green: false , blue: false, 
    
    figuras: "ESFERA",			//por defecto opcion de agregar un cubo
    addGraphic: agregar,		//llamada a funcion agregar() una figura
    color: '#ff00ff'

}
var shape_params = {
    color: "#00ffff",
    picking: "translate"    
};
    //MENU DE CONTROLES
    gui = new dat.GUI({ height : 3 * 8 - 1 });
    gui_controllers = [];

function init() {
    
    //CREA LA ESCENA THREE.JS
        scene = new THREE.Scene();
    //var backgroundScene = "#002233"
        scene.background = new THREE.Color(backgroundScene);
    //window.addEventListener( 'resize', onWindowResize, false );
    
    //ELIJE TIPO DE CAMARA DE THREE.JS
        camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,500);
        camera.position.set(30,10,0); // Define posición de la cámara en XYZ
        camera.lookAt( scene.position );

    scene.add(pivotPoint);
    //REPRESENTADOR WebGL
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true});
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight*escala );

    //PERMITE QUE SE VEAN LAS SOMBRAS
        renderer.shadowMap.enabled = true; 
        renderer.setSize(window.innerWidth,window.innerHeight);

    document.body.appendChild(renderer.domElement);
    //mouseOrbit = new THREE.OrbitControls(camera, renderer.domElement);
    mouseOrbit = new THREE.OrbitControls( camera, renderer.domElement );
       
    gui.addColor(menu, 'background');//.onChange(update);
    gui.addColor(menu, 'baldosas');

    //ROTA TODO EL GRUPO DE FIGURAS
        gui.add(menu, 'Rubik').onChange(function(newValue) {
            updateFiguras(newValue);
        });;

    //ROTA TODO EL GRUPO DE FIGURAS
        var animRotar = gui.addFolder("Rotacion")
            gui_controllers[0] = animRotar
            .add(menu, 'rotar_alrededor')
            .listen()
            .onFinishChange(
                function(value) {
                }
            );
            animRotar.add(menu, 'speed_around',-1,1);
            gui_controllers[0] = animRotar
            .add(menu, 'rotar')
            .listen()
            .onFinishChange(
                function(value) {
                }
            );
            animRotar.add(menu, 'speed',-1,1);

    //LUCES
        var scenectl = gui.addFolder("Luces");
        scenectl.add(menu, 'white_up');
        scenectl.add(menu, 'white_down');
        scenectl.add(menu, 'red');
        scenectl.add(menu, 'green');
        scenectl.add(menu, 'blue');
  

    //NUEVA FIGURA -> SECCION DEL MENU
        var figura = gui.addFolder('Nueva Figura');
        figura.add(menu, 'figuras', ["ESFERA", "TOROIDE", "PIRAMIDE", "CILINDRO"]); //lista de figuras posibles para crear 
        figura.addColor(menu,'color');
        figura.add(menu, 'addGraphic');  //llamada a funcion agregar figura
    
        var shapectl = gui.addFolder("Figura Seleccionada");
        // adding folder to gui control
        shapectl.addColor(shape_params, 'color').onChange(ChangeColor).listen();
        shapectl.add(shape_params, 'picking', [ "translate", "rotate", "scale"] );

            // adding events to window
        window.addEventListener( 'mousemove', onMouseMove, false );
        document.addEventListener( 'mousedown', onDocumentMouseDown );

        // ----- TRANSLATE CONTROL ---------------------------
        control = new THREE.TransformControls( camera, renderer.domElement );
        control.addEventListener( 'change', render );
        control.addEventListener( 'dragging-changed', function ( event ) {
			mouseOrbit.enabled = ! event.value;
        } );     
        scene.add( control );
}

//ANIMAR

    //AGREGA UNA FIGURA EN LA ESCENA
    function agregar() {
        let color = menu.color;
        let fig = menu.figuras;
            if(fig == "ESFERA"){
                geometria = new THREE.SphereGeometry(1.5,32,32);
            }
            if(fig == "TOROIDE"){
                geometria =new THREE.TorusGeometry(1.5,0.5,32,100 );
            }
            if(fig == "PIRAMIDE"){
                geometria = new THREE.CylinderBufferGeometry(0,2,3,4);
            }
            if(fig == "CILINDRO"){
                geometria = new THREE.CylinderGeometry(1,1,3,8);
            }

            nombre =figuras.agregar(fig,geometria,color);
            renderer.render( scene, camera );
    }

    var updateLights = function(){ 
        // change in GUI for lights
        if (menu.white_up) { white_up.intensity = 1; }
        else { white_up.intensity = 0; };
    
        if (menu.white_down) { white_down.intensity = 1; }
        else { white_down.intensity = 0; };	            
        
        if (menu.red) { red.intensity = 6; }
        else { red.intensity = 0; };
        
        if (menu.green) { green.intensity = 6; }
        else { green.intensity = 0; };
        
        if (menu.blue) { blue.intensity = 6; }
        else { blue.intensity = 0; };
    }
    var animateFiguras = function(){
        if(menu.rotar_alrededor){
            if(menu.Rubik){
                cubeMesh.add(pivotPoint);
                pivotPoint.rotation.y += menu.speed_around; }else{
                    cubeMesh.remove(pivotPoint);
                }
        }
        else{
            pivotPoint.rotation=false;
        }

        if(menu.rotar){
            rotateFiguras(); 
        }
    }

    var updateFiguras = function(){ 
        if (menu.Rubik){
            addRubikCube();
        }else{
            menu['rotar_alrededor'] = false;
            rmRubikCube();
        }


    }
    
    var rotateFiguras = function(){
        for(let i = 0; i< objects.length; i++){
            objects[i].rotation.y += menu.speed;
        } }

    // callback for event to change color
    function ChangeColor(){
        selected_object.material.color.setHex(shape_params.color);
    };

// get mouse coordinates all the time
function onMouseMove( event ) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

// callback event for mouse down
function onDocumentMouseDown( event ) {    
            // event.preventDefault();
            event.stopPropagation();
            raycaster.setFromCamera( mouse, camera );
            
            // calculate objects intersecting the picking ray
            //var intersects = raycaster.intersectObjects( scene.children);
            objects = pivotPoint.children.concat([cubeMesh]);

            console.log(objects);

            var intersects = raycaster.intersectObjects( objects );
            // intersects[0].object.material.color.set( 0xff0000 );
            
            //validate if has objects intersected
            if (intersects.length>0){
                // pick first intersected object
                selected_object = intersects[0].object;

                // change gui color
                shape_params.color = selected_object.material.color.getHex();
                
                control.setMode(shape_params.picking);
                control.attach( selected_object );           
            }
}
             
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    render();
}
window.addEventListener( 'resize', onWindowResize, false );

init();
addTablero();
addLights(distanceFromCenter);
createRubikCube();
//scene.add(cuboRubik);
addRubikCube();


function render(){ 
    renderer.render(scene,camera); 
}

var showAnimationLoop = function(){
    requestAnimationFrame(showAnimationLoop);
    updateLights();
    animateFiguras();
    render(); }

showAnimationLoop();