var camera, controls, scene, renderer, container;
var clicked = false;
var raycaster, mouse, intersects;
var circleWheel, circleStart;
init();
animate();

function init(){
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.set(0,0,100);
    
    
    //set up the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );
    scene.add( new THREE.AmbientLight( 0x505050 ) );
    

    //Setting the renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } ); 
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    
    
    //resizes the project according to the window
    window.addEventListener( 'resize', onWindowResize, false );
    function onWindowResize(){
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }
   
   
    //creating the wheel
    var geometryWheel = new THREE.CircleGeometry( 50, 12 );
    var skinWheel = new THREE.TextureLoader().load( '../textures/wheel.png' );
    var materialWheel = new THREE.MeshBasicMaterial( { map: skinWheel } );
    circleWheel = new THREE.Mesh( geometryWheel, materialWheel );
    scene.add( circleWheel );
    circleWheel.rotation.z=Math.PI/12.0;

    //start button
    var geometryStart = new THREE.CircleGeometry( 7, 32 );
    var skinStart = new THREE.TextureLoader().load( '../textures/start.png' );
    var materialStart = new THREE.MeshBasicMaterial( { map: skinStart } );
    circleStart = new THREE.Mesh( geometryStart, materialStart );
    scene.add( circleStart );
    circleStart.position.z=2;

    //triangle
    var geometryTriangle = new THREE.Geometry();
    var v1Triangle = new THREE.Vector3(0,43,2);
    var v2Triangle = new THREE.Vector3(-12,55,2);
    var v3Triangle = new THREE.Vector3(12,55,2);

    geometryTriangle.vertices.push(v1Triangle);
    geometryTriangle.vertices.push(v2Triangle);
    geometryTriangle.vertices.push(v3Triangle);

    geometryTriangle.faces.push( new THREE.Face3( 0, 2, 1 ) );
    geometryTriangle.computeFaceNormals();

    var meshTriangle= new THREE.Mesh( geometryTriangle, new THREE.MeshBasicMaterial({ color: 0xf43567 }) );
    scene.add(meshTriangle);
}

//setup for the spin
function spinStart(){
    clicked = true;
    circleStart.visible = false;
}
function spinEnd(){
    clicked = false;
    circleStart.visible = true;
}

raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();
document.addEventListener( 'mousedown', onDocumentMouseDown, false );

function onDocumentMouseDown( event ){
    event.preventDefault();
    
    mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );
    intersects = raycaster.intersectObjects( scene.children );
    
    if ( intersects.length>0 ){
        if (intersects[0].object.id==circleStart.id){
            spinStart();
        }
    }
}

function animate(){
    requestAnimationFrame( animate );
    render();
}

function render(){
    //the zone the wheel ends on
    var zone = 20;
    let endAnimation = false;
    const minSpins = 3, maxSpins = 5;
    //random integer between [3:5]
    let numSpins = Math.floor(Math.random() * (maxSpins - minSpins + 1)) + minSpins;
    //set rotation to the desired zone + numSpins
    let rotation = -((((zone - 1) * Math.PI / 6.0) + numSpins * 2.0 * Math.PI)-Math.PI / 12.0);
    let speed = 0.1;
    
    if(clicked){
        circleWheel.rotation.z-=speed;
        if(circleWheel.rotation.z <= rotation){
            circleWheel.rotation.z = rotation;
            endAnimation = true;
        }
    }
    if (endAnimation){
        spinEnd();
    }
    renderer.render(scene, camera);
}