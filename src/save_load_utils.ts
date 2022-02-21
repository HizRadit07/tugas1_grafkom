import { Drawables } from "./drawables";

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