import React, {
    useEffect,
    useRef,
    useState
} from 'react';

type FractalType =
    | 'mandelbrot'
    | 'julia'
    | 'burning'
    | 'tricorn'
    | 'tree';

export default function App() {

    const canvasRef =
        useRef<HTMLCanvasElement | null>(null);

    const [type, setType] =
        useState<FractalType>('mandelbrot');

    // logarithmic zoom
    const zoomExpRef = useRef(0);

    // world coordinates
    const xRef = useRef(-0.5);
    const yRef = useRef(0);

    // rerender trigger
    const dirtyRef = useRef(true);

    // =====================================
    // SAFE TYPE HANDLER
    // =====================================

    function handleTypeChange(
        e: React.ChangeEvent<HTMLSelectElement>
    ) {

        const value =
            e.target.value as FractalType;

        setType(value);
    }

    useEffect(() => {

        const canvas = canvasRef.current;

        if (!canvas) return;

        const ctx =
            canvas.getContext('2d');

        if (!ctx) return;

        const W = 1000;
        const H = 700;

        canvas.width = W;
        canvas.height = H;

        // =====================================
        // PERFORMANCE
        // =====================================

        const SCALE = 2;

        const RW =
            Math.floor(W / SCALE);

        const RH =
            Math.floor(H / SCALE);

        const imageData =
            ctx.createImageData(RW, RH);

        const pixels =
            imageData.data;

        // =====================================
        // INPUT
        // =====================================

        let dragging = false;

        let lastX = 0;
        let lastY = 0;

        canvas.onmousedown = (e) => {

            dragging = true;

            lastX = e.clientX;
            lastY = e.clientY;
        };

        canvas.onmouseup = () => {
            dragging = false;
        };

        canvas.onmouseleave = () => {
            dragging = false;
        };

        canvas.onmousemove = (e) => {

            if (!dragging) return;

            const dx =
                e.clientX - lastX;

            const dy =
                e.clientY - lastY;

            const scale =
                Math.exp(-zoomExpRef.current);

            xRef.current -=
                dx * scale * 0.004;

            yRef.current -=
                dy * scale * 0.004;

            lastX = e.clientX;
            lastY = e.clientY;

            dirtyRef.current = true;
        };

        // =====================================
        // INFINITE ZOOM
        // =====================================

        canvas.onwheel = (e) => {

            e.preventDefault();

            // fixed wheel direction
            const delta =
                e.deltaY > 0
                    ? -0.25
                    : 0.25;

            const rect =
                canvas.getBoundingClientRect();

            const mx =
                e.clientX - rect.left;

            const my =
                e.clientY - rect.top;

            const scaleBefore =
                Math.exp(-zoomExpRef.current);

            const wx =
                (mx - W / 2)
                * scaleBefore
                * 0.004
                + xRef.current;

            const wy =
                (my - H / 2)
                * scaleBefore
                * 0.004
                + yRef.current;

            zoomExpRef.current += delta;

            const scaleAfter =
                Math.exp(-zoomExpRef.current);

            xRef.current =
                wx -
                (mx - W / 2)
                * scaleAfter
                * 0.004;

            yRef.current =
                wy -
                (my - H / 2)
                * scaleAfter
                * 0.004;

            dirtyRef.current = true;
        };

        // =====================================
        // FRACTALS
        // =====================================

        function mandelbrot(
            x:number,
            y:number
        ) {

            let zx = 0;
            let zy = 0;

            let i = 0;

            while (
                zx*zx + zy*zy < 4 &&
                i < 160
            ) {

                const xt =
                    zx*zx - zy*zy + x;

                zy =
                    2*zx*zy + y;

                zx = xt;

                i++;
            }

            return i;
        }

        function julia(
            x:number,
            y:number
        ) {

            let zx = x;
            let zy = y;

            const cx = -0.8;
            const cy = 0.156;

            let i = 0;

            while (
                zx*zx + zy*zy < 4 &&
                i < 160
            ) {

                const xt =
                    zx*zx - zy*zy + cx;

                zy =
                    2*zx*zy + cy;

                zx = xt;

                i++;
            }

            return i;
        }

        function burning(
            x:number,
            y:number
        ) {

            let zx = 0;
            let zy = 0;

            let i = 0;

            while (
                zx*zx + zy*zy < 4 &&
                i < 160
            ) {

                zx = Math.abs(zx);
                zy = Math.abs(zy);

                const xt =
                    zx*zx - zy*zy + x;

                zy =
                    2*zx*zy + y;

                zx = xt;

                i++;
            }

            return i;
        }

        function tricorn(
            x:number,
            y:number
        ) {

            let zx = 0;
            let zy = 0;

            let i = 0;

            while (
                zx*zx + zy*zy < 4 &&
                i < 160
            ) {

                const xt =
                    zx*zx - zy*zy + x;

                zy =
                    -2*zx*zy + y;

                zx = xt;

                i++;
            }

            return i;
        }

        // =====================================
        // COLORS
        // =====================================

        function palette(i:number) {

            const t = i / 160;

            const r =
                127 +
                127 *
                Math.sin(6.283 * t);

            const g =
                127 +
                127 *
                Math.sin(
                    6.283 * (t + 0.33)
                );

            const b =
                127 +
                127 *
                Math.sin(
                    6.283 * (t + 0.66)
                );

            return [r,g,b];
        }

        // =====================================
        // TREE FRACTAL
        // =====================================

        function drawTree(
            x:number,
            y:number,
            len:number,
            angle:number,
            depth:number
        ) {

            if (depth <= 0) return;

            const x2 =
                x + Math.cos(angle) * len;

            const y2 =
                y + Math.sin(angle) * len;

            ctx.strokeStyle =
                `hsl(${depth * 24},100%,60%)`;

            ctx.lineWidth =
                depth * 0.7;

            ctx.beginPath();

            ctx.moveTo(x,y);

            ctx.lineTo(x2,y2);

            ctx.stroke();

            drawTree(
                x2,
                y2,
                len * 0.72,
                angle - 0.4,
                depth - 1
            );

            drawTree(
                x2,
                y2,
                len * 0.72,
                angle + 0.4,
                depth - 1
            );
        }

        // =====================================
        // MAIN RENDER
        // =====================================

        function render() {

            if (!dirtyRef.current) {

                requestAnimationFrame(render);

                return;
            }

            dirtyRef.current = false;

            ctx.fillStyle = 'black';

            ctx.fillRect(0,0,W,H);

            // =================================
            // TREE
            // =================================

            if (type === 'tree') {

                drawTree(
                    W / 2,
                    H - 50,
                    140,
                    -Math.PI / 2,
                    12
                );

                requestAnimationFrame(render);

                return;
            }

            // =================================
            // FRACTAL RENDER
            // =================================

            const scale =
                Math.exp(-zoomExpRef.current);

            for (let py=0; py<RH; py++) {

                for (let px=0; px<RW; px++) {

                    const x =
                        (px - RW/2)
                        * scale
                        * 0.004
                        + xRef.current;

                    const y =
                        (py - RH/2)
                        * scale
                        * 0.004
                        + yRef.current;

                    let iter = 0;

                    if (type === 'mandelbrot') {
                        iter = mandelbrot(x,y);
                    }

                    else if (type === 'julia') {
                        iter = julia(x,y);
                    }

                    else if (type === 'burning') {
                        iter = burning(x,y);
                    }

                    else if (type === 'tricorn') {
                        iter = tricorn(x,y);
                    }

                    const [r,g,b] =
                        palette(iter);

                    const idx =
                        (py * RW + px) * 4;

                    pixels[idx] = r;
                    pixels[idx + 1] = g;
                    pixels[idx + 2] = b;
                    pixels[idx + 3] = 255;
                }
            }

            // =================================
            // UPSCALE
            // =================================

            const temp =
                document.createElement('canvas');

            temp.width = RW;
            temp.height = RH;

            const tctx =
                temp.getContext('2d');

            if (!tctx) return;

            tctx.putImageData(
                imageData,
                0,
                0
            );

            ctx.imageSmoothingEnabled = false;

            ctx.drawImage(
                temp,
                0,
                0,
                RW,
                RH,
                0,
                0,
                W,
                H
            );

            requestAnimationFrame(render);
        }

        render();

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
                    onChange={handleTypeChange}
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

                    <option value="tree">
                        Tree
                    </option>

                </select>

            </div>

            <canvas
                ref={canvasRef}
                className="
                    border
                    border-zinc-800
                    rounded
                    block
                    shadow-2xl
                "
            />

            <div className="mt-4 text-zinc-400">

                Scroll = Zoom<br/>
                Drag = Pan<br/>
                Infinite logarithmic zoom enabled

            </div>

        </div>
    );
}
