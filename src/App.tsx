import React, {
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

    const [type, setType] =
        useState<FractalType>('mandelbrot');

    // =====================================
    // SAFE TYPE CHANGE
    // =====================================

    function handleTypeChange(
        e: React.ChangeEvent<HTMLSelectElement>
    ) {

        const value =
            e.target.value as FractalType;

        setType(value);
    }

    // =====================================
    // MAIN EFFECT
    // =====================================

    useEffect(() => {

        const canvas =
            canvasRef.current;

        if (!canvas) return;

        const ctx =
            canvas.getContext('2d');

        if (!ctx) return;

        // safe aliases
        const safeCanvas = canvas;
        const safeCtx = ctx;

        const W = 1000;
        const H = 700;

        safeCanvas.width = W;
        safeCanvas.height = H;

        // =====================================
        // LOWER INTERNAL RESOLUTION
        // FOR SPEED
        // =====================================

        const SCALE = 2;

        const RW =
            Math.floor(W / SCALE);

        const RH =
            Math.floor(H / SCALE);

        const imageData =
            safeCtx.createImageData(RW, RH);

        const pixels =
            imageData.data;

        // =====================================
        // INPUT
        // =====================================

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
        }

        function onWheel(
            e: WheelEvent
        ) {

            e.preventDefault();

            // fixed zoom direction
            const delta =
                e.deltaY > 0
                    ? -0.25
                    : 0.25;

            const rect =
                safeCanvas.getBoundingClientRect();

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
                i < 180
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
                i < 180
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
                i < 180
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
                i < 180
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
        // COLOR PALETTE
        // =====================================

        function palette(i:number) {

            const t = i / 180;

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
        // RENDER LOOP
        // =====================================

        function render() {

            const scale =
                Math.exp(-zoomExpRef.current);

            for (
                let py = 0;
                py < RH;
                py++
            ) {

                for (
                    let px = 0;
                    px < RW;
                    px++
                ) {

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

                    if (
                        type === 'mandelbrot'
                    ) {

                        iter =
                            mandelbrot(x,y);
                    }

                    else if (
                        type === 'julia'
                    ) {

                        iter =
                            julia(x,y);
                    }

                    else if (
                        type === 'burning'
                    ) {

                        iter =
                            burning(x,y);
                    }

                    else if (
                        type === 'tricorn'
                    ) {

                        iter =
                            tricorn(x,y);
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

            safeCtx.imageSmoothingEnabled = false;

            safeCtx.clearRect(
                0,
                0,
                W,
                H
            );

            safeCtx.drawImage(
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

            animationRef.current =
                requestAnimationFrame(render);
        }

        render();

        // =====================================
        // CLEANUP
        // =====================================

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
                Infinite logarithmic zoom enabled

            </div>

        </div>
    );
}
