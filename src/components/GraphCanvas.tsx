import { useEffect, useRef } from 'react';

type Props = {
    values: number[];
};

export default function GraphCanvas({
    values,
}: Props) {

    const canvasRef =
        useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        const canvas = canvasRef.current;

        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        ctx.clearRect(0, 0, width, height);

        // Background
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, width, height);

        // Axes
        ctx.strokeStyle = '#444';

        ctx.beginPath();

        ctx.moveTo(40, 0);
        ctx.lineTo(40, height - 30);

        ctx.lineTo(width, height - 30);

        ctx.stroke();

        // Graph
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;

        ctx.beginPath();

        values.forEach((value, index) => {

            const x =
                40 +
                (index / (values.length - 1)) *
                (width - 60);

            const normalized =
                (value + 2) / 4;

            const y =
                (height - 30) -
                normalized *
                (height - 60);

            if (index === 0) {
                ctx.moveTo(x, y);
            }
            else {
                ctx.lineTo(x, y);
            }

        });

        ctx.stroke();

    }, [values]);

    return (
        <canvas
            ref={canvasRef}
            width={700}
            height={400}
            style={{
                width: '100%',
                borderRadius: 12,
                marginTop: 24,
            }}
        />
    );
}
