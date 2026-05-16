import {
    useEffect,
    useRef,
    useState
} from 'react';

type FractalType =
    | 'mandelbrot'
    | 'julia'
    | 'burning'
    | 'tricorn';

export default function App() {

    const canvasRef =
        useRef<HTMLCanvasElement | null>(null);

    const frameRef =
        useRef<number>(0);

    const zoomRef =
        useRef(0);

    const targetZoomRef =
        useRef(0);

    const xRef =
        useRef(-0.5);

    const yRef =
        useRef(0);

    const draggingRef =
        useRef(false);

    const lastMouseRef =
        useRef({ x: 0, y: 0 });

    const [type, setType] =
        useState<FractalType>('mandelbrot');

    const [gpuFailed, setGpuFailed] =
        useState(false);

    useEffect(() => {

        const canvas =
            canvasRef.current;

        if (!canvas) return;

        // =========================
        // SAFE CANVAS
        // =========================

        const safeCanvas = canvas;

        const gl =
            safeCanvas.getContext('webgl');

        if (!gl) {

            setGpuFailed(true);
            return;
        }

        const safeGL = gl;

        const DPR =
            window.devicePixelRatio || 1;

        const W = 1400;
        const H = 900;

        safeCanvas.width = W * DPR;
        safeCanvas.height = H * DPR;

        safeCanvas.style.width = `${W}px`;
        safeCanvas.style.height = `${H}px`;

        safeGL.viewport(
            0,
            0,
            safeCanvas.width,
            safeCanvas.height
        );

        // =========================
        // VERTEX SHADER
        // =========================

        const vertexShaderSource = `
attribute vec2 position;

void main() {

    gl_Position =
        vec4(position, 0.0, 1.0);
}
`;

        // =========================
        // FRAGMENT SHADER
        // =========================

        const fragmentShaderSource = `
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_center;
uniform float u_zoom;
uniform int u_type;

vec3 palette(float t){

    return 0.5 + 0.5 * cos(
        6.28318 *
        (
            vec3(0.0,0.33,0.67)
            + t
        )
    );
}

int fractal(vec2 c){

    vec2 z;

    if(u_type == 1)
        z = c;
    else
        z = vec2(0.0);

    vec2 julia =
        vec2(-0.8,0.156);

    int i = 0;

    for(int n=0;n<300;n++){

        if(dot(z,z) > 4.0)
            break;

        if(u_type == 0){

            z = vec2(
                z.x*z.x - z.y*z.y,
                2.0*z.x*z.y
            ) + c;
        }

        else if(u_type == 1){

            z = vec2(
                z.x*z.x - z.y*z.y,
                2.0*z.x*z.y
            ) + julia;
        }

        else if(u_type == 2){

            z = abs(z);

            z = vec2(
                z.x*z.x - z.y*z.y,
                2.0*z.x*z.y
            ) + c;
        }

        else {

            z = vec2(
                z.x*z.x - z.y*z.y,
                -2.0*z.x*z.y
            ) + c;
        }

        i++;
    }

    return i;
}

void main(){

    vec2 uv =
        (
            gl_FragCoord.xy
            - 0.5 * u_resolution
        )
        / u_resolution.y;

    float scale =
        exp(-u_zoom);

    vec2 c =
        uv * scale * 4.0
        + u_center;

    int iter =
        fractal(c);

    float t =
        float(iter) / 300.0;

    vec3 col =
        palette(t);

    if(iter >= 299)
        col = vec3(0.0);

    gl_FragColor =
        vec4(col,1.0);
}
`;

        // =========================
        // SHADER COMPILER
        // =========================

        function compileShader(
            type:number,
            source:string
        ){

            const shader =
                safeGL.createShader(type);

            if(!shader){

                throw new Error(
                    'Shader compile failed'
                );
            }

            safeGL.shaderSource(
                shader,
                source
            );

            safeGL.compileShader(
                shader
            );

            return shader;
        }

        const vertexShader =
            compileShader(
                safeGL.VERTEX_SHADER,
                vertexShaderSource
            );

        const fragmentShader =
            compileShader(
                safeGL.FRAGMENT_SHADER,
                fragmentShaderSource
            );

        const program =
            safeGL.createProgram();

        if(!program)
            return;

        safeGL.attachShader(
            program,
            vertexShader
        );

        safeGL.attachShader(
            program,
            fragmentShader
        );

        safeGL.linkProgram(program);

        safeGL.useProgram(program);

        // =========================
        // FULLSCREEN QUAD
        // =========================

        const vertices =
            new Float32Array([
                -1,-1,
                 1,-1,
                -1, 1,

                -1, 1,
                 1,-1,
                 1, 1
            ]);

        const buffer =
            safeGL.createBuffer();

        safeGL.bindBuffer(
            safeGL.ARRAY_BUFFER,
            buffer
        );

        safeGL.bufferData(
            safeGL.ARRAY_BUFFER,
            vertices,
            safeGL.STATIC_DRAW
        );

        const position =
            safeGL.getAttribLocation(
                program,
                'position'
            );

        safeGL.enableVertexAttribArray(
            position
        );

        safeGL.vertexAttribPointer(
            position,
            2,
            safeGL.FLOAT,
            false,
            0,
            0
        );

        // =========================
        // UNIFORMS
        // =========================

        const resolutionLoc =
            safeGL.getUniformLocation(
                program,
                'u_resolution'
            );

        const centerLoc =
            safeGL.getUniformLocation(
                program,
                'u_center'
            );

        const zoomLoc =
            safeGL.getUniformLocation(
                program,
                'u_zoom'
            );

        const typeLoc =
            safeGL.getUniformLocation(
                program,
                'u_type'
            );

        // =========================
        // INPUT
        // =========================

        function onMouseDown(
            e: MouseEvent
        ){

            draggingRef.current = true;

            lastMouseRef.current = {
                x: e.clientX,
                y: e.clientY
            };
        }

        function onMouseUp(){

            draggingRef.current = false;
        }

        function onMouseMove(
            e: MouseEvent
        ){

            if(!draggingRef.current)
                return;

            const dx =
                e.clientX
                - lastMouseRef.current.x;

            const dy =
                e.clientY
                - lastMouseRef.current.y;

            lastMouseRef.current = {
                x: e.clientX,
                y: e.clientY
            };

            const scale =
                Math.exp(-zoomRef.current);

            xRef.current -=
                dx * scale * 0.003;

            yRef.current -=
                dy * scale * 0.003;
        }

        function onWheel(
            e: WheelEvent
        ){

            e.preventDefault();

            const delta =
                e.deltaY > 0
                    ? -0.25
                    : 0.25;

            targetZoomRef.current += delta;
        }

        safeCanvas.addEventListener(
            'mousedown',
            onMouseDown
        );

        window.addEventListener(
            'mouseup',
            onMouseUp
        );

        window.addEventListener(
            'mousemove',
            onMouseMove
        );

        safeCanvas.addEventListener(
            'wheel',
            onWheel,
            { passive:false }
        );

        // =========================
        // TYPE MAP
        // =========================

        function getType(){

            if(type === 'mandelbrot')
                return 0;

            if(type === 'julia')
                return 1;

            if(type === 'burning')
                return 2;

            return 3;
        }

        // =========================
        // RENDER LOOP
        // =========================

        function render(){

            zoomRef.current +=
                (
                    targetZoomRef.current
                    - zoomRef.current
                ) * 0.08;

            if(resolutionLoc){

                safeGL.uniform2f(
                    resolutionLoc,
                    safeCanvas.width,
                    safeCanvas.height
                );
            }

            if(centerLoc){

                safeGL.uniform2f(
                    centerLoc,
                    xRef.current,
                    yRef.current
                );
            }

            if(zoomLoc){

                safeGL.uniform1f(
                    zoomLoc,
                    zoomRef.current
                );
            }

            if(typeLoc){

                safeGL.uniform1i(
                    typeLoc,
                    getType()
                );
            }

            safeGL.drawArrays(
                safeGL.TRIANGLES,
                0,
                6
            );

            frameRef.current =
                requestAnimationFrame(
                    render
                );
        }

        render();

        return () => {

            cancelAnimationFrame(
                frameRef.current
            );

            safeCanvas.removeEventListener(
                'mousedown',
                onMouseDown
            );

            window.removeEventListener(
                'mouseup',
                onMouseUp
            );

            window.removeEventListener(
                'mousemove',
                onMouseMove
            );

            safeCanvas.removeEventListener(
                'wheel',
                onWheel
            );
        };

    }, [type]);

    return (

        <div
            className="
                min-h-screen
                bg-black
                text-white
                p-4
            "
        >

            <h1
                className="
                    text-4xl
                    font-bold
                    mb-4
                "
            >
                AetherScope
            </h1>

            <div className="mb-4">

                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as FractalType)}
                    className="
                        bg-zinc-900
                        border
                        border-zinc-700
                        px-4
                        py-2
                        rounded
                    "
                >

                    <option value="mandelbrot">
                        Mandelbrot
                    </option>

                    <option value="julia">
                        Julia
                    </option>

                    <option value="burning">
                        Burning Ship
                    </option>

                    <option value="tricorn">
                        Tricorn
                    </option>

                </select>

            </div>

            {
                gpuFailed && (

                    <div className="text-red-400 mb-4">

                        WebGL failed.
                        GPU acceleration may be disabled.

                    </div>
                )
            }

            <canvas
                ref={canvasRef}
                className="
                    border
                    border-zinc-800
                    rounded
                    shadow-2xl
                    cursor-grab
                "
            />

            <div className="mt-4 text-zinc-400">

                GPU WebGL Rendering<br/>
                Infinite Smooth Zoom<br/>
                Drag = Pan<br/>
                Scroll = Zoom

            </div>

        </div>
    );
}
