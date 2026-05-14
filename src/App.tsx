import { useEffect, useRef, useState } from 'react';

type FractalType = 'mandelbrot' | 'julia' | 'burning' | 'tricorn' | 'tree';

export default function App() {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [type, setType] = useState<FractalType>('mandelbrot');

    const zoomRef = useRef(1);
    const xRef = useRef(0);
    const yRef = useRef(0);

    useEffect(() => {

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = 900;
        canvas.height = 700;

        let dragging = false;
        let lastX = 0;
        let lastY = 0;

        // =========================
        // INPUT
        // =========================
        canvas.onmousedown = (e) => {
            dragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
        };

        canvas.onmouseup = () => dragging = false;
        canvas.onmouseleave = () => dragging = false;

        canvas.onmousemove = (e) => {
            if (!dragging) return;

            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;

            xRef.current -= dx / (200 * zoomRef.current);
            yRef.current -= dy / (200 * zoomRef.current);

            lastX = e.clientX;
            lastY = e.clientY;
        };

        canvas.onwheel = (e) => {
            e.preventDefault();
            zoomRef.current *= e.deltaY > 0 ? 1.1 : 0.9;
        };

        // =========================
        // COMPLEX HELPERS
        // =========================
        function iterMandelbrot(cx:number, cy:number) {
            let x = 0, y = 0;
            let i = 0;

            while (x*x + y*y < 4 && i < 60) {
                const xt = x*x - y*y + cx;
                y = 2*x*y + cy;
                x = xt;
                i++;
            }
            return i;
        }

        function iterJulia(x:number, y:number) {
            let cx = -0.8, cy = 0.156;
            let i = 0;

            while (x*x + y*y < 4 && i < 60) {
                const xt = x*x - y*y + cx;
                y = 2*x*y + cy;
                x = xt;
                i++;
            }
            return i;
        }

        function iterBurning(x:number, y:number) {
            let i = 0;

            while (x*x + y*y < 4 && i < 60) {
                const xt = Math.abs(x*x - y*y + -0.6);
                y = Math.abs(2*x*y) + 0.4;
                x = xt;
                i++;
            }
            return i;
        }

        function iterTricorn(x:number, y:number) {
            let i = 0;

            while (x*x + y*y < 4 && i < 60) {
                const xt = x*x - y*y + -0.8;
                y = -2*x*y;
                x = xt;
                i++;
            }
            return i;
        }

        function color(i:number) {
            const t = i / 60;
            return `hsl(${t * 360}, 100%, ${t * 60 + 20}%)`;
        }

        // =========================
        // TREE FRACTAL
        // =========================
        function drawTree(ctx:any, x:number, y:number, len:number, angle:number, depth:number) {

            if (depth === 0) return;

            const x2 = x + Math.cos(angle) * len;
            const y2 = y + Math.sin(angle) * len;

            ctx.strokeStyle = `hsl(${depth * 25},100%,60%)`;
            ctx.lineWidth = depth * 0.8;

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            drawTree(ctx, x2, y2, len * 0.7, angle - 0.4, depth - 1);
            drawTree(ctx, x2, y2, len * 0.7, angle + 0.4, depth - 1);
        }

        // =========================
        // RENDER LOOP
        // =========================
        function render() {

            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const zoom = zoomRef.current;
            const ox = xRef.current;
            const oy = yRef.current;

            if (type === 'tree') {

                drawTree(
                    ctx,
                    canvas.width / 2,
                    canvas.height - 50,
                    120,
                    -Math.PI / 2,
                    12
                );

            } else {

                const w = canvas.width;
                const h = canvas.height;

                for (let px = 0; px < w; px += 2) {
                    for (let py = 0; py < h; py += 2) {

                        const x = (px - w/2) / (200 * zoom) + ox;
                        const y = (py - h/2) / (200 * zoom) + oy;

                        let i = 0;

                        if (type === 'mandelbrot') i = iterMandelbrot(x, y);
                        if (type === 'julia') i = iterJulia(x, y);
                        if (type === 'burning') i = iterBurning(x, y);
                        if (type === 'tricorn') i = iterTricorn(x, y);

                        ctx.fillStyle = color(i);
                        ctx.fillRect(px, py, 2, 2);
                    }
                }
            }

            requestAnimationFrame(render);
        }

        render();

    }, [type]);

    return (
        <div className="bg-black text-white min-h-screen p-4">

            <h1 className="text-3xl font-bold mb-3">
                CPU Fractal Engine
            </h1>

            <select
                className="bg-zinc-900 p-2 mb-3"
                value={type}
                onChange={(e) => setType(e.target.value as FractalType)}
            >
                <option value="mandelbrot">Mandelbrot</option>
                <option value="julia">Julia</option>
                <option value="burning">Burning Ship</option>
                <option value="tricorn">Tricorn</option>
                <option value="tree">Tree</option>
            </select>

            <canvas
                ref={canvasRef}
                className="border border-zinc-800 block"
            />

        </div>
    );
}
