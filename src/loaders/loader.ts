export const loadShader = async (gl: WebGL2RenderingContext, type: number, source: string) => {
    const rawShader = await fetchShader(source)
    const shader = gl.createShader(type)
    gl.shaderSource(shader, rawShader)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('Error when compiling shaders: ' + gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
    }
    return shader
}

export async function fetchShader(source: string) {
    const shader = await fetch('/shaders/' + source).then(res => res.text())
    console.log(shader)
    return shader
}

export const createProgram = async (gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader:WebGLShader) => {
    var program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Error linking program!', gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
        return
    }
    gl.validateProgram(program)
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error('Error validating program!', gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
        return
    }

    return program
}