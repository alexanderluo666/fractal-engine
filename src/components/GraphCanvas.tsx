import { useEffect, useRef } from 'react';

type Props = {
    values: number[];
    color: string;
};

export default function GraphCanvas({
    values,
    color,
}: Props) {

    const canvasRef =
        useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        const canvas = canvasRef.current;

        if (!canvas) return;

        const ctx =
            canvas.getContext('2d');

        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        // Background

        ctx.clearRect(
            0,
            0,
            width,
            height
        );

        ctx.fillStyle = '#090909';

        ctx.fillRect(
            0,
            0,
            width,
            height
        );

        // Grid

        ctx.strokeStyle = '#181818';

        for (
            let x = 0;
            x < width;
            x += 50
        ) {

            ctx.beginPath();

            ctx.moveTo(x, 0);

            ctx.lineTo(x, height);

            ctx.stroke();
        }

        for (
            let y = 0;
            y < height;
            y += 50
        ) {

            ctx.beginPath();

            ctx.moveTo(0, y);

            ctx.lineTo(width, y);

            ctx.stroke();
        }

        // Axes

        ctx.strokeStyle = '#333';

        ctx.beginPath();

        ctx.moveTo(40, 0);

        ctx.lineTo(
            40,
            height - 30
        );

        ctx.lineTo(
            width,
            height - 30
        );

        ctx.stroke();

        // Graph

        ctx.strokeStyle = color;

        ctx.lineWidth = 2;

        ctx.beginPath();

        values.forEach((
            value,
            index
        ) => {

            const x =
                40 +
                (
                    index /
                    (values.length - 1)
                ) *
                (width - 60);

            const normalized =
                (value + 4) / 8;

            const y =
                (height - 30) -
                normalized *
                (height - 60);

            if (index === 0) {

                ctx.moveTo(x, y);

            } else {

                ctx.lineTo(x, y);

            }

        });

        ctx.stroke();

    }, [values, color]);

    return (

        <canvas
            ref={canvasRef}
            width={1000}
            height={500}
            className="
                w-full
                rounded-2xl
            "
        />

    );
}
