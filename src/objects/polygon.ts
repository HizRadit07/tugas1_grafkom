import {renderAll, setClear} from "../main"
import { Drawables } from "../drawables"
import { drawLine } from "./line"

export function drawPoly(x,y, gl:WebGL2RenderingContext, program: WebGLProgram, objProps:any, color, isDone:boolean){
    
    if (!isDone) {

        //Masukin vertex dan points
        objProps.vertices.push(x)
        objProps.vertices.push(y)
        objProps.vertices.push(color[0]/255)
        objProps.vertices.push(color[1]/255)
        objProps.vertices.push(color[2]/255)

        objProps.curPoints.push([x,y])

        objProps.n_points++
        
        //Buat gambarin garis bantuan
        if (objProps.n_points > 1) {
            let temp_vert = objProps.vertices.slice((objProps.n_points-2)*5,(objProps.n_points-2)*5+11)
            let temp_points = objProps.curPoints.slice(objProps.n_points-2,objProps.n_points)
            let obj : Drawables = {
                vert: temp_vert,
                meth: gl.LINES,
                n: 2,
                type: "Line",
                points: temp_points
            }
            objProps.arrObjects.push(obj)
        }
        
        renderAll(objProps.arrObjects,gl,program)

    } else {
        // Remove the lines
        objProps.arrObjects.splice(-(objProps.n_points-1))
        console.log(objProps.arrObjects)

        let obj : Drawables = {
            vert: objProps.vertices,
            meth: gl.TRIANGLE_FAN,
            n: objProps.n_points,
            type: "Polygon",
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