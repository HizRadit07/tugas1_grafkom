import {renderAll, setClear} from "../main"
import { Drawables } from "../drawables"



export function drawLine(x,y, gl:WebGL2RenderingContext, program: WebGLProgram, objProps:any, color){
    console.log(color)
    
    if (objProps.n_points < 2){

        objProps.vertices.push(x)
        objProps.vertices.push(y)
        objProps.vertices.push(color[0]/255)
        objProps.vertices.push(color[1]/255)
        objProps.vertices.push(color[2]/255)

        objProps.curPoints.push([x,y])

        objProps.n_points++
        // console.log(objProps.vertices)

        if (objProps.n_points == 2) {
            let obj : Drawables = {
                vert: objProps.vertices,
                meth: gl.LINES,
                n: objProps.n_points,
                type: "Line",
                points: objProps.curPoints
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