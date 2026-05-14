import { useEffect, useRef, useState } from 'react';

type Props = {
    fractal: string;
};

export default function GraphCanvas({
    fractal,
}: Props) {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    // 🌌 camera system
    const [zoom, setZoom] = useState(1);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);

    // 🧭 dragging
    const dragging = useRef(false);
    const lastMouse = useRef({ x: 0, y: 0 });

    // 🎧 (optional sound hook placeholder)
    const audioLevel = useRef(0);

    useEffect(() => {

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;

        const image = ctx.createImageData(w, h);

        const maxIter = 400;

        // 🔥 exponential zoom (core fractal behavior)
        const scale = Math.pow(0.92, zoom);

        const xmin = -2.5 * scale + offsetX;
        const xmax = 1.5 * scale + offsetX;
        const ymin = -1.5 * scale + offsetY;
        const ymax = 1.5 * scale + offsetY;

        for (let px = 0; px < w; px++) {
            for (let py = 0; py < h; py++) {

                const x = xmin + (px / w) * (xmax - xmin);
                const y = ymin + (py / h) * (ymax - ymin);

                let zx = 0, zy = 0;
                let cx = x, cy = y;

                // 🌊 Julia mode
                if (fractal === 'julia') {
                    zx = x;
                    zy = y;

                    // 🎛 animated morph (VERY subtle chaos)
                    cx = -0.8 + Math.sin(Date.now() * 0.0003) * 0.1;
                    cy = 0.156 + Math.cos(Date.now() * 0.0002) * 0.1;
                }

                let i = 0;

                while (zx * zx + zy * zy < 4 && i < maxIter) {

                    const xt = zx * zx - zy * zy + cx;

                    if (fractal === 'burningShip') {
                        zy = Math.abs(2 * zx * zy) + cy;
                        zx = Math.abs(xt);
                    }

                    else if (fractal === 'tricorn') {
                        zy = -2 * zx * zy + cy;
                        zx = xt;
                    }

                    else {
                        zy = 2 * zx * zy + cy;
                        zx = xt;
                    }

                    i++;
                }

                const idx = (py * w + px) * 4;

                const t = i / maxIter;

                // 🌈 improved contrast coloring
                const glow = Math.floor(255 * Math.pow(t, 0.6));

                image.data[idx] = glow;
                image.data[idx + 1] = Math.floor(glow * (0.4 + audioLevel.current));
                image.data[idx + 2] = Math.floor(255 * (1 - t));
                image.data[idx + 3] = 255;
            }
        }

        ctx.putImageData(image, 0, 0);

    }, [fractal, zoom, offsetX, offsetY]);

    // 🖱️ wheel zoom (CENTERED ON CURSOR)
    function onWheel(e: React.WheelEvent) {

        e.preventDefault();

        const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();

        const mouseX = (e.clientX - rect.left) / rect.width;
        const mouseY = (e.clientY - rect.top) / rect.height;

        const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;

        setZoom(z => z * zoomFactor);

        // 🔥 keep zoom centered on cursor
        setOffsetX(x =>
            x + (mouseX - 0.5) * (1 - zoomFactor) * 2
        );

        setOffsetY(y =>
            y + (mouseY - 0.5) * (1 - zoomFactor) * 2
        );
    }

    // 🖱️ drag navigation
    function onMouseDown(e: React.MouseEvent) {
        dragging.current = true;
        lastMouse.current = { x: e.clientX, y: e.clientY };
    }

    function onMouseUp() {
        dragging.current = false;
    }

    function onMouseMove(e: React.MouseEvent) {

        if (!dragging.current) return;

        const dx = e.clientX - lastMouse.current.x;
        const dy = e.clientY - lastMouse.current.y;

        setOffsetX(x => x - dx * 0.005 / zoom);
        setOffsetY(y => y - dy * 0.005 / zoom);

        lastMouse.current = {
            x: e.clientX,
            y: e.clientY,
        };
    }

    /* =========================
        🌳 FRACTAL TREE
    ========================= */

    if (fractal === 'tree') {

        return (
            <canvas
                ref={canvasRef}
                width={1200}
                height={800}
                className="w-full border rounded-xl border-zinc-800"
                onWheel={onWheel}
            />
        );
    }

    return (
        <div className="space-y-3">

            {/* controls */}
            <div className="flex gap-2 flex-wrap text-sm">

                <button onClick={() => setZoom(z => z * 1.3)} className="px-3 py-2 bg-zinc-800 rounded">
                    Zoom In
                </button>

                <button onClick={() => setZoom(z => z / 1.3)} className="px-3 py-2 bg-zinc-800 rounded">
                    Zoom Out
                </button>

                <button onClick={() => {
                    setZoom(1);
                    setOffsetX(0);
                    setOffsetY(0);
                }} className="px-3 py-2 bg-zinc-800 rounded">
                    Reset
                </button>

                <div className="text-zinc-400 px-2">
                    zoom {zoom.toFixed(2)}x
                </div>

            </div>

            {/* canvas */}
            <canvas
                ref={canvasRef}
                width={1200}
                height={800}
                className="w-full rounded-xl border border-zinc-800 cursor-grab active:cursor-grabbing"
                onWheel={onWheel}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onMouseMove={onMouseMove}
            />
        </div>
    );
}
