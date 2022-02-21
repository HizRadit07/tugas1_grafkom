import {renderAll, setClear} from "../main"
import { Drawables } from "../drawables"

export function drawSquare(x,y, gl:WebGL2RenderingContext, program: WebGLProgram, objProps:any){
    
    if (objProps.n_points < 2){

        //Approximating equal side lengths
        if (objProps.n_points == 1) {
            const canvas = document.getElementById('gl_canvas') as HTMLCanvasElement
            let existingX = objProps.curPoints[0][0]
            let existingY = objProps.curPoints[0][1]

            let absYDiff = Math.abs(y - existingY)
            let absXDiff = Math.abs(x - existingX)*canvas.width/canvas.height

            if (absXDiff > absYDiff) {
                y = generateEqualSideCorner(objProps.curPoints[0], [x,y], 0, canvas)
            } else {
                x = generateEqualSideCorner(objProps.curPoints[0], [x,y], 1, canvas)
            }
            
        }

        objProps.vertices.push(x)
        objProps.vertices.push(y)
        objProps.vertices.push(objProps.rgb[0]/255)
        objProps.vertices.push(objProps.rgb[1]/255)
        objProps.vertices.push(objProps.rgb[2]/255)

        objProps.curPoints.push([x,y])

        objProps.n_points++
        // console.log(objProps.vertices)
        // console.log(objProps.curPoints)

        if (objProps.n_points == 2) {
            
            let remainingAttributes = generateSquareRemains(objProps)
            let rect_vert = remainingAttributes[0]
            let rect_points = remainingAttributes[1]
            
            objProps.n_points = 4

            let obj : Drawables = {
                    vert: rect_vert,
                    meth: gl.TRIANGLE_FAN,
                    n: objProps.n_points,
                    type: "Square",
                    points: rect_points
                }
            
            objProps.arrObjects.push(obj)
            renderAll(objProps.arrObjects,gl,program)
            objProps.vertices = []
            objProps.n_points = 0
            objProps.curPoints = []
            setClear()
            
        }

        return objProps
    }
    
}

function generateSquareRemains(objProps:any) {
    let point3_x = objProps.curPoints[0][0]
    let point3_y = objProps.curPoints[1][1]
    let point4_x = objProps.curPoints[1][0]
    let point4_y = objProps.curPoints[0][1]

    let color = [objProps.rgb[0]/255, objProps.rgb[1]/255, objProps.rgb[2]/255]

    var vert = objProps.vertices.slice(0,5)
    pushToArray(vert, [point3_x, point3_y].concat(color))
    pushToArray(vert, objProps.vertices.slice(5,10))
    pushToArray(vert, [point4_x, point4_y].concat(color))

    var points = [objProps.curPoints[0]]
    points.push([point3_x, point3_y])
    points.push(objProps.curPoints[1])
    points.push([point4_x, point4_y])

    return [vert, points]
}

function pushToArray(destination:any, source:any) {
    for (let i = 0; i < source.length; i++) {
        destination.push(source[i])
    }
}

function generateEqualSideCorner(firstPoint:number[], secondPoint:number[], index:number,
        canvas:HTMLCanvasElement) {
    let counterIndex = Math.abs(1-index)

    let multiplier = canvas.width/canvas.height
    if (index == 1) {
        multiplier = 1/multiplier
    }

    let sideLength = Math.abs(secondPoint[index] - firstPoint[index])
    if (secondPoint[counterIndex] >= firstPoint[counterIndex]) {
        return firstPoint[counterIndex]+sideLength*multiplier
    }
    return firstPoint[counterIndex]-sideLength*multiplier
}

export function scaleSquare(obj:any, x:number, y:number, idxPoint:number) {
    let pivotPoint = (idxPoint+2)%4
 
    // Setting pivot point as index 0
    setObjPointVertex(0, obj, obj.points[pivotPoint][0], obj.points[pivotPoint][1])
    
    //Generating new scaled opposite vertex
    const canvas = document.getElementById('gl_canvas') as HTMLCanvasElement
    let existingX = obj.points[0][0]
    let existingY = obj.points[0][1]
    let absYDiff = Math.abs(y - existingY)
    let absXDiff = Math.abs(x - existingX)*canvas.width/canvas.height
    if (absXDiff > absYDiff) {
        y = generateEqualSideCorner(obj.points[0], [x,y], 0, canvas)
    } else {
        x = generateEqualSideCorner(obj.points[0], [x,y], 1, canvas)
    }

    // Setting opposite point as index 2
    setObjPointVertex(2, obj, x, y)

    //Setting reimaing points
    setObjPointVertex(1, obj, obj.points[0][0], obj.points[2][1])
    setObjPointVertex(3, obj, obj.points[2][0], obj.points[0][1])

    console.log(obj.points)
    console.log(obj.vert)
}

function setObjPointVertex(index:number, obj:any, x:number, y:number) {
    obj.vert[index*5] = x
    obj.vert[index*5+1] = y
    obj.points[index] = [x,y]
}
