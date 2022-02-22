import { Drawables } from "./drawables";
import { renderAll } from "./main";

export function exportAsFile(arrObjects:Array<Drawables>){
    var filename = (<HTMLInputElement>document.getElementById('export-file')).value

    var data = JSON.stringify(arrObjects);
    
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

}

export function importData(objProps,gl:WebGL2RenderingContext,program:WebGLProgram){
    var file = (<HTMLInputElement>document.getElementById("import_file")).files[0]

    var reader = new FileReader()

    reader.onload = function(e){
        var content = e.target.result as string
        var parsedData = JSON.parse(content)
        objProps.arrObjects = parsedData
        renderAll(objProps.arrObjects,gl,program)
    }

    reader.readAsText(file);
    if (!file) {
        alert('Blank file')
    }
}