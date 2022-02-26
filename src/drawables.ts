export interface Drawables {
    vert : number[] //[x1, y1, r1, g1, b1, x2, y2]
    meth : any //gl.LINE gl.TRINAGLE_FAN gl.TRIANGLE_STRIP
    n : any //jumlah titik
    type: string //identifier
    points: number[] //[[x1,y1],[x2,y2]]
}