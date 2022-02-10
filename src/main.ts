let mousePos: [number, number] = [0,0];

async function main(){
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

main()