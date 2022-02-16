import { createProgram, loadShader } from "./loaders/loader";
import { Drawables } from "./drawables";
// import {drawLine} from "./objects/line"

let mousePos: [number, number] = [0,0];
var isLine = false
var isSquare = false
var isRectangle = false
var isPolygon = false

var n_points = 0

var vertices = [] //arr for vertices
var rgb = [0.0, 0.0, 0.0] //arr for color
var arrObjects = new Array<Drawables>() //arr for objects to be drawn



function setLine() {
    isLine = true
    isSquare = false
    isRectangle = false
    isPolygon = false
}
function setSquare(){
    isLine = false
    isSquare = true
    isRectangle = false
    isPolygon = false
}
function setRect(){
    isLine = false
    isSquare = false
    isRectangle = true
    isPolygon = false
}
function setPolygon(){
    isLine = false
    isSquare = false
    isRectangle = false
    isPolygon = true
}

function setupUI(){
    const drawLineButton = document.getElementById('draw-line') as HTMLButtonElement
    const drawSquareButton = document.getElementById('draw-square') as HTMLButtonElement
    const drawRectButton = document.getElementById('draw-rect') as HTMLButtonElement
    const drawPolygonButton = document.getElementById('draw-pol') as HTMLButtonElement
    

    drawLineButton.addEventListener('click', () => {
        setLine()
        console.log(isLine)
    })
    drawSquareButton.addEventListener('click', () => {
        setSquare()
        console.log(isLine)
    })
    drawRectButton.addEventListener('click', () => {
        setRect()
        console.log(isLine)
    })
    drawPolygonButton.addEventListener('click', () => {
        setPolygon()
        console.log(isLine)
    })
}

function renderAll(objArr : Array<Drawables>, gl:WebGL2RenderingContext, program:WebGLProgram){
    for (let i=0; i< objArr.length;i++){
        drawObject(gl,program,objArr[i].vert,objArr[i].meth,objArr[i].n)
    }
}


async function main(){
    setupUI()
    const canvas = document.getElementById('gl_canvas') as HTMLCanvasElement
    canvas.width = window.innerWidth - 200
    canvas.height = window.innerHeight
    const gl = canvas.getContext('webgl2')
    if (!gl) {
        alert('WebGL is not supported on this browser/device')
        return
    }
    canvas.addEventListener('mousemove', (event) => {
        printMousePos(canvas, event)
    }, false)

    //create shaders
    const vertexShader =  await loadShader(gl,gl.VERTEX_SHADER, 'draw-vert.glsl')
    const fragmentShader = await loadShader(gl, gl.FRAGMENT_SHADER, 'draw-frag.glsl')

    //create program
    const drawProgram = await createProgram(gl,vertexShader,fragmentShader)

    
    canvas.addEventListener('mousedown', (event) =>{
        var canvas_x = getXCursorPosition(canvas, event)
        var canvas_y = getYCursorPosition(canvas, event)   
        console.log('x : '+ canvas_x + ' y : ' + canvas_y)
        startDraw(canvas_x, canvas_y, arrObjects, gl, drawProgram)
    })
}

function startDraw(x,y, objectArray, gl:WebGL2RenderingContext, program:WebGLProgram){
    //utk condition isLine, isSquare, dsb, masukin sini
    if (isLine){
        drawLine(x,y, objectArray, gl, program)
    }
}

function drawLine(x,y, objectArray, gl:WebGL2RenderingContext, program: WebGLProgram){

    if (n_points < 2){
        vertices.push(x)
        vertices.push(y)
        vertices.push(rgb[0]/255)
        vertices.push(rgb[1]/255)
        vertices.push(rgb[2]/255)
        n_points++
    }
    
    if (n_points == 2) {
        console.log('masuk sini')
        let obj : Drawables = {
            vert: vertices,
            meth: gl.LINES,
            n: n_points
        }
        objectArray.push(obj)
        renderAll(objectArray,gl,program)
        vertices = []
        n_points = 0
    }
}


function getXCursorPosition(canvas,event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    return (x - canvas.width/2)/ (canvas.width/2);
}

function getYCursorPosition (canvas,event){
    const rect = canvas.getBoundingClientRect()
    const y = event.clientY - rect.top
    return (y - canvas.height/2)/ (canvas.height/2) * -1;
}

function printMousePos(canvas: HTMLCanvasElement, event) {
    const {x,y} = getMousePosition(canvas, event)
    document.getElementById('x-pos').innerText = x.toString()
    document.getElementById('y-pos').innerText = y.toString()
    mousePos = [x,y]
}


function getMousePosition(canvas: HTMLCanvasElement, event) {
    const bound = canvas.getBoundingClientRect()
    return {
        x: event.clientX - bound.left,
        y: event.clientY - bound.top
    }
}




//function to draw object
function drawObject(gl:WebGL2RenderingContext, program : WebGLProgram, vertices, method, n){
    var vertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    //remember that in the vertices array, it will be like this
    /* 
    vertices - [ x1,y1, r,g,b,
                 x2,y2, r,g,b,
                ..... ]
    total ada 5 element
    */
    gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		2, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		false, //normalized = false
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
    gl.vertexAttribPointer(
		colorAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		false, //normalize = false
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

    gl.enableVertexAttribArray(positionAttribLocation)
	gl.enableVertexAttribArray(colorAttribLocation)

	// Main render loop
	gl.useProgram(program)
    gl.drawArrays(method, 0, n)
}

main()