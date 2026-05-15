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

    const animationRef =
        useRef<number>(0);

    const zoomExpRef =
        useRef(0);

    const xRef =
        useRef(-0.5);

    const yRef =
        useRef(0);

    const draggingRef =
        useRef(false);

    const lastMouseRef =
        useRef({ x: 0, y: 0 });

    // =========================
    // NEW: stable deep zoom refs
    // =========================

    const pixelShiftRef =
        useRef({ x: 0, y: 0 });

    const frameLimiterRef =
        useRef(0);

    const [type, setType] =
        useState<FractalType>('mandelbrot');

    useEffect(() => {

        const canvas =
            canvasRef.current;

        if (!canvas) return;

        const ctx =
            canvas.getContext('2d');

        if (!ctx) return;

        const safeCanvas = canvas;
        const safeCtx = ctx;

        const DPR =
            window.devicePixelRatio || 1;

        const W = 1200;
        const H = 800;

        safeCanvas.width = W * DPR;
        safeCanvas.height = H * DPR;

        safeCanvas.style.width = `${W}px`;
        safeCanvas.style.height = `${H}px`;

        safeCtx.scale(DPR, DPR);

        // =========================
        // DYNAMIC RESOLUTION
        // =========================

        let SCALE = 1.5;

        const RW =
            Math.floor(W / SCALE);

        const RH =
            Math.floor(H / SCALE);

        // =========================
        // TEMP CANVAS
        // =========================

        const tempCanvas =
            document.createElement('canvas');

        tempCanvas.width = RW;
        tempCanvas.height = RH;

        const tempCtx =
            tempCanvas.getContext('2d');

        if (!tempCtx) return;

        const safeTempCtx = tempCtx;

        const imageData =
            safeTempCtx.createImageData(RW, RH);

        const pixels =
            imageData.data;

        // =========================
        // INPUT
        // =========================

        function onMouseDown(
            e: MouseEvent
        ) {

            draggingRef.current = true;

            lastMouseRef.current = {
                x: e.clientX,
                y: e.clientY
            };
        }

        function onMouseUp() {

            draggingRef.current = false;
        }

        function onMouseMove(
            e: MouseEvent
        ) {

            if (!draggingRef.current)
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
                Math.exp(-zoomExpRef.current);

            xRef.current -=
                dx * scale * 0.004;

            yRef.current -=
                dy * scale * 0.004;

            // =========================
            // STABLE DRAGGING
            // =========================

            pixelShiftRef.current.x += dx;
            pixelShiftRef.current.y += dy;
        }

        function onWheel(
            e: WheelEvent
        ) {

            e.preventDefault();

            const delta =
                e.deltaY > 0
                    ? -0.4
                    : 0.4;

            const rect =
                safeCanvas.getBoundingClientRect();

            const mx =
                e.clientX - rect.left;

            const my =
                e.clientY - rect.top;

            const before =
                Math.exp(-zoomExpRef.current);

            const wx =
                (
                    mx
                    - W / 2
                    - pixelShiftRef.current.x
                )
                * before
                * 0.004
                + xRef.current;

            const wy =
                (
                    my
                    - H / 2
                    - pixelShiftRef.current.y
                )
                * before
                * 0.004
                + yRef.current;

            zoomExpRef.current += delta;

            const after =
                Math.exp(-zoomExpRef.current);

            xRef.current =
                wx -
                (mx - W / 2)
                * after
                * 0.004;

            yRef.current =
                wy -
                (my - H / 2)
                * after
                * 0.004;

            pixelShiftRef.current = {
                x: 0,
                y: 0
            };
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
            { passive: false }
        );

        // =========================
        // FRACTALS
        // =========================

        function mandelbrot(
            x:number,
            y:number,
            max:number
        ) {

            let zx = 0;
            let zy = 0;

            let i = 0;

            while (
                zx*zx + zy*zy < 4 &&
                i < max
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
            y:number,
            max:number
        ) {

            let zx = x;
            let zy = y;

            const cx = -0.8;
            const cy = 0.156;

            let i = 0;

            while (
                zx*zx + zy*zy < 4 &&
                i < max
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
            y:number,
            max:number
        ) {

            let zx = 0;
            let zy = 0;

            let i = 0;

            while (
                zx*zx + zy*zy < 4 &&
                i < max
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
            y:number,
            max:number
        ) {

            let zx = 0;
            let zy = 0;

            let i = 0;

            while (
                zx*zx + zy*zy < 4 &&
                i < max
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

        // =========================
        // COLOR
        // =========================

        function palette(i:number,max:number){

            if(i >= max)
                return [0,0,0];

            const t = i / max;

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

        // =========================
        // PARALLEL RENDER
        // =========================

        function renderBand(
            yStart:number,
            yEnd:number,
            scale:number,
            maxIter:number
        ) {

            const cx = xRef.current;
            const cy = yRef.current;

            const pxShift =
                pixelShiftRef.current.x;

            const pyShift =
                pixelShiftRef.current.y;

            for (
                let py = yStart;
                py < yEnd;
                py++
            ) {

                for (
                    let px = 0;
                    px < RW;
                    px++
                ) {

                    const baseX =
                        px - RW / 2;

                    const baseY =
                        py - RH / 2;

                    const x =
                        (
                            baseX - pxShift
                        )
                        * scale
                        * 0.004
                        + cx;

                    const y =
                        (
                            baseY - pyShift
                        )
                        * scale
                        * 0.004
                        + cy;

                    let iter = 0;

                    if(type==='mandelbrot')
                        iter = mandelbrot(x,y,maxIter);

                    else if(type==='julia')
                        iter = julia(x,y,maxIter);

                    else if(type==='burning')
                        iter = burning(x,y,maxIter);

                    else
                        iter = tricorn(x,y,maxIter);

                    const [r,g,b] =
                        palette(iter,maxIter);

                    const idx =
                        (py * RW + px) * 4;

                    pixels[idx] = r;
                    pixels[idx+1] = g;
                    pixels[idx+2] = b;
                    pixels[idx+3] = 255;
                }
            }
        }

        // =========================
        // MAIN RENDER LOOP
        // =========================

        function render() {

            const now =
                performance.now();

            // =========================
            // FRAME LIMITER
            // =========================

            if (
                now
                - frameLimiterRef.current
                < 16
            ) {

                animationRef.current =
                    requestAnimationFrame(render);

                return;
            }

            frameLimiterRef.current = now;

            const scale =
                Math.exp(-zoomExpRef.current);

            // =========================
            // ADAPTIVE ITERATIONS
            // =========================

            const maxIter =
                Math.floor(
                    180
                    + zoomExpRef.current * 25
                );

            // =========================
            // CPU PARALLELIZATION
            // =========================

            const bands = 4;
            const bandHeight =
                Math.floor(RH / bands);

            for (
                let i = 0;
                i < bands;
                i++
            ) {

                const yStart =
                    i * bandHeight;

                const yEnd =
                    i === bands - 1
                    ? RH
                    : yStart + bandHeight;

                renderBand(
                    yStart,
                    yEnd,
                    scale,
                    maxIter
                );
            }

            safeTempCtx.putImageData(
                imageData,
                0,
                0
            );

            safeCtx.imageSmoothingEnabled = false;

            safeCtx.clearRect(
                0,
                0,
                W,
                H
            );

            safeCtx.drawImage(
                tempCanvas,
                0,
                0,
                RW,
                RH,
                0,
                0,
                W,
                H
            );

            animationRef.current =
                requestAnimationFrame(render);
        }

        render();

        return () => {

            cancelAnimationFrame(
                animationRef.current
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
                    onChange={(e) =>
                        setType(e.target.value as FractalType)
                    }
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

                Scroll = Zoom<br/>
                Drag = Pan<br/>
                CPU Parallel Rendering<br/>
                Infinite Deep Zoom Enabled

            </div>

        </div>
    );
}
