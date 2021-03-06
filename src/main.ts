import { createProgram, loadShader } from "./loaders/loader";
import { Drawables } from "./drawables";
import { drawLine } from "./objects/line"
import { drawPoly } from "./objects/polygon"
import { drawSquare, scaleSquare } from "./objects/square";
import { drawRect, scaleRect } from "./objects/rectangle";
import { exportAsFile, importData } from "./save_load_utils";

let mousePos: [number, number] = [0,0];
var isLine = false
var isSquare = false
var isRectangle = false
var isPolygon = false
var color = [0.0,0.0,0.0]

//number of points
var objProps = {
    n_points:0,
    vertices:[],
    rgb: [0.0,0.0,0.0],
    curPoints:[],
    arrObjects: new Array<Drawables>()
}

//vars for selection and moving purposes
var selectedObject
var idxPoint
var isDrag = false
var isEnter = false

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

export function setClear(){
    isLine = false
    isSquare = false
    isRectangle = false
    isPolygon = false
}

function setupUI(){
    const drawLineButton = document.getElementById('draw-line') as HTMLButtonElement
    const drawSquareButton = document.getElementById('draw-square') as HTMLButtonElement
    const drawRectButton = document.getElementById('draw-rect') as HTMLButtonElement
    const drawPolygonButton = document.getElementById('draw-pol') as HTMLButtonElement
    const fileExportButton = document.getElementById('export-btn') as HTMLButtonElement
    const colorpicker = document.getElementById('colorPicker') as HTMLInputElement

    drawLineButton.addEventListener('click', () => {
        setLine()
    })
    drawSquareButton.addEventListener('click', () => {
        setSquare()
    })
    drawRectButton.addEventListener('click', () => {
        setRect()
    })
    drawPolygonButton.addEventListener('click', () => {
        setPolygon()
    })
    fileExportButton.addEventListener('click', () =>{
        exportAsFile(objProps.arrObjects)
    })

    colorpicker.addEventListener('input', (event) =>{
        console.log(colorpicker.value)
        let rgbv = hexToRgb(colorpicker.value)
        let split = rgbv.split(',');
        console.log(rgbv)
        color[0] = parseFloat(split[0])
        color[1] = parseFloat(split[1])
        color[2] = parseFloat(split[2])
    })

    // document.getElementById(colorpicker).onchange = function () {
    //     objProps.c = this.value;
    //     objProps.renderAll();
    // };
    

}

export function renderAll(objArr : Array<Drawables>, gl:WebGL2RenderingContext, program:WebGLProgram){
    //this is an n^2 method but i really dont know another way to implement it
    for (let i=0; i< objArr.length;i++){
        drawObject(gl,program,objArr[i].vert,objArr[i].meth,objArr[i].n)
        for (let j=0;j<objArr[i].points.length;j++){
            let curx = objArr[i].points[j][0]
            let cury = objArr[i].points[j][1]
            drawObject(gl,program,getSquarePoint(curx,cury),gl.TRIANGLE_FAN,4) //hardcode 4 bcs points will be square shaped
        }
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


    //we add the importer here for rendering purposes
    //gl and drawprogram baru diinitialize di main
    const fileImportButton = document.getElementById('import-btn') as HTMLButtonElement
    fileImportButton.addEventListener('click', () =>{
        importData(objProps,gl,drawProgram) 
    })

    canvas.addEventListener('mouseup', (event) =>{
        isDrag = false
    })

    canvas.addEventListener('mousemove', (event) =>{
        if (selectedObject != null) {
            changeObjectPoint(canvas,event,gl,drawProgram)
        }
    })

    canvas.addEventListener('mousedown', (event) =>{
        var canvas_x = getXCursorPosition(canvas, event)
        var canvas_y = getYCursorPosition(canvas, event)
        // console.log(objProps.vertices)
        startDraw(canvas_x,canvas_y,gl,drawProgram,objProps,color)
        checkSelectedObject(canvas_x,canvas_y)

        if (selectedObject != null){
            isDrag = true
        }
    })

    window.addEventListener('keydown', (event) =>{
        var canvas_x = getXCursorPosition(canvas, event)
        var canvas_y = getYCursorPosition(canvas, event)
        // console.log(objProps.vertices)
        if (event.key == 'Enter') {
            if (isPolygon) {
                isEnter = true
                startDraw(canvas_x,canvas_y,gl,drawProgram,objProps, color)
            }
        }
    })

}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if(result){
        var r= parseInt(result[1], 16);
        var g= parseInt(result[2], 16);
        var b= parseInt(result[3], 16);
        return r+","+g+","+b;//return 23,14,45 -> reformat if needed 
    } 
    return null;
  }

function startDraw(x,y, gl:WebGL2RenderingContext, program:WebGLProgram, objProps, color){
    //utk condition isLine, isSquare, dsb, masukin sini
    if (isLine){
        objProps = drawLine(x,y, gl, program, objProps, color)
        //this makes it so that harus gambar satu-satu, so pencet button, draw
    } else if (isSquare) {
        objProps = drawSquare(x,y, gl, program, objProps, color)
    } else if (isRectangle) {
        objProps = drawRect(x,y, gl, program, objProps, color)
    } else if (isPolygon) {
        objProps = drawPoly(x,y, gl, program, objProps, color, isEnter)
        isEnter = false
    }
}

function getSquarePoint(x, y) { //get points
    return [
        x-0.010, y+0.015, 1.0, 1.0, 1.0,
        x+0.010, y+0.015, 1.0, 1.0, 1.0,
        x+0.010, y-0.015, 1.0, 1.0, 1.0,
        x-0.010, y-0.015, 1.0, 1.0, 1.0
    ]
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

//selection and dragging functions

function checkSelectedObject(x,y){
    selectedObject = null
    idxPoint = -1

    objProps.arrObjects.forEach(function (item){
        item.points.forEach(function (point,idx){
            var curSqPoint = getSquarePoint(point[0],point[1])
            if (x > curSqPoint[0] && y < curSqPoint[1] &&
                x < curSqPoint[5] && y < curSqPoint[6] &&
                x < curSqPoint[10] && y > curSqPoint[11] &&
                x > curSqPoint[15] && y > curSqPoint[16]){
                    selectedObject = item
                    idxPoint = idx
                    console.log("object selected with idx " + idx)
                }
        })
    })
}

function changeObjectPoint(canvas, event, gl:WebGL2RenderingContext, program:WebGLProgram){
    if (isDrag){
        var x = getXCursorPosition(canvas, event)
        var y = getYCursorPosition(canvas, event)
        // let idxPoint = checkSelectedObject(x,y)[1]
        // console.log("YO: " + typeof idxPoint[1])

        //selectedObject is drawables, ga di specify disini
        //but well i wrote it so should be fine
        //change the vert
        if (selectedObject.type == "Square") {
            scaleSquare(selectedObject, x, y, idxPoint)
        } else if (selectedObject.type == "Rectangle") {
            scaleRect(selectedObject, x, y, idxPoint)
        } else {
            selectedObject.vert[idxPoint*5] = x
            selectedObject.vert[idxPoint*5+1] = y
            selectedObject.points[idxPoint] = [x,y]
        }
        
        console.log(selectedObject.type)

        //change the point
        renderAll(objProps.arrObjects,gl,program)
        // isDrag = false
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