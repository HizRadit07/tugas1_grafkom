import {renderAll, setClear} from "../main"
import { Drawables } from "../drawables"

export function drawRect(x,y, gl:WebGL2RenderingContext, program: WebGLProgram, objProps:any){
    
    if (objProps.n_points < 2){

        objProps.vertices.push(x)
        objProps.vertices.push(y)
        objProps.vertices.push(objProps.rgb[0]/255)
        objProps.vertices.push(objProps.rgb[1]/255)
        objProps.vertices.push(objProps.rgb[2]/255)

        objProps.curPoints.push([x,y])

        objProps.n_points++
        console.log(objProps.vertices)
        console.log(objProps.curPoints)


        if (objProps.n_points == 2) {
            
            let remainingAttributes = generateRectRemains(objProps)
            let rect_vert = remainingAttributes[0]
            let rect_points = remainingAttributes[1]
            
            objProps.n_points = 4

            let obj : Drawables = {
                    vert: rect_vert,
                    meth: gl.TRIANGLE_FAN,
                    n: objProps.n_points,
                    type: "Rectangle",
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

function generateRectRemains(objProps:any) {
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

export function scaleRect(obj:any, x:number, y:number, idxPoint:number) {
    let pivotPoint = (idxPoint+2)%4
 
    // Setting pivot point as index 0
    setObjPointVertex(0, obj, obj.points[pivotPoint][0], obj.points[pivotPoint][1])

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