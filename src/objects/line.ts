import {renderAll} from "../main"
import { Drawables } from "../drawables"



export function drawLine(x,y, gl:WebGL2RenderingContext, program: WebGLProgram, objProps:any){
    
    if (objProps.n_points < 2){
        objProps.vertices.push(x)
        objProps.vertices.push(y)
        objProps.vertices.push(objProps.rgb[0]/255)
        objProps.vertices.push(objProps.rgb[1]/255)
        objProps.vertices.push(objProps.rgb[2]/255)
        objProps.n_points++
        console.log(objProps.vertices)
        if (objProps.n_points == 2) {
            let obj = {
                vert: objProps.vertices,
                meth: gl.LINES,
                n: objProps.n_points
            }
            objProps.arrObjects.push(obj)
            renderAll(objProps.arrObjects,gl,program)
            objProps.vertices = []
            objProps.n_points = 0
        }  
        return objProps
    }
    
}