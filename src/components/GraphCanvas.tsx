import { useEffect, useRef, useState } from 'react';

type Props = {
    fractal: string;
};

export default function GraphCanvas({
    fractal,
}: Props) {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    // 🌌 camera system (better than raw zoom scaling)
    const [zoom, setZoom] = useState(1);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);

    useEffect(() => {

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;

        const image = ctx.createImageData(w, h);

        const maxIter = 500;

        // 🔥 exponential zoom (this is KEY for fractals)
        const scale = Math.pow(0.92, zoom);

        const xmin = -2.5 * scale + offsetX;
        const xmax = 1.5 * scale + offsetX;
        const ymin = -1.5 * scale + offsetY;
        const ymax = 1.5 * scale + offsetY;

        for (let px = 0; px < w; px++) {
            for (let py = 0; py < h; py++) {

                const x = xmin + (px / w) * (xmax - xmin);
                const y = ymin + (py / h) * (ymax - ymin);

                let zx = 0;
                let zy = 0;

                let cx = x;
                let cy = y;

                if (fractal === 'julia') {
                    zx = x;
                    zy = y;
                    cx = -0.8;
                    cy = 0.156;
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

                if (i === maxIter) {
                    image.data[idx] = 0;
                    image.data[idx + 1] = 0;
                    image.data[idx + 2] = 0;
                    image.data[idx + 3] = 255;
                } else {

                    // 🌈 better contrast color palette
                    const c = Math.floor(255 * t);

                    image.data[idx] = 20 + c;
                    image.data[idx + 1] = Math.floor(80 + 120 * (1 - t));
                    image.data[idx + 2] = Math.floor(255 * (1 - t));
                    image.data[idx + 3] = 255;
                }
            }
        }

        ctx.putImageData(image, 0, 0);

    }, [fractal, zoom, offsetX, offsetY]);

    return (
        <div className="space-y-3">

            {/* 🌌 Controls */}
            <div className="flex gap-2 flex-wrap">

                <button
                    onClick={() => setZoom(z => z * 1.25)}
                    className="px-3 py-2 bg-zinc-800 rounded"
                >
                    Zoom In
                </button>

                <button
                    onClick={() => setZoom(z => z / 1.25)}
                    className="px-3 py-2 bg-zinc-800 rounded"
                >
                    Zoom Out
                </button>

                <button
                    onClick={() => {
                        setZoom(1);
                        setOffsetX(0);
                        setOffsetY(0);
                    }}
                    className="px-3 py-2 bg-zinc-800 rounded"
                >
                    Reset
                </button>

                <div className="text-zinc-400 px-2 flex items-center">
                    zoom: {zoom.toFixed(2)}x
                </div>

            </div>

            {/* 🧠 Canvas */}
            <canvas
                ref={canvasRef}
                width={1200}
                height={800}
                className="w-full rounded-xl border border-zinc-800"
                onWheel={(e) => {
                    e.preventDefault();

                    const factor =
                        e.deltaY < 0 ? 1.12 : 0.88;

                    setZoom(z => z * factor);
                }}
            />
        </div>
    );
}
