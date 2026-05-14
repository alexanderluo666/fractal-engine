import {
    useEffect,
    useRef,
} from 'react';

import Complex from '../math/Complex';

type Props = {
    fractal: string;
};

export default function GraphCanvas({
    fractal,
}: Props) {

    const canvasRef =
        useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        const canvas =
            canvasRef.current;

        if (!canvas) return;

        const ctx =
            canvas.getContext('2d');

        if (!ctx) return;

        const width =
            canvas.width;

        const height =
            canvas.height;

        const image =
            ctx.createImageData(
                width,
                height
            );

        const maxIterations = 300;

        const xmin = -2.5;
        const xmax = 1.5;

        const ymin = -1.5;
        const ymax = 1.5;

        for (
            let px = 0;
            px < width;
            px++
        ) {

            for (
                let py = 0;
                py < height;
                py++
            ) {

                const x =
                    xmin +
                    (px / width) *
                    (xmax - xmin);

                const y =
                    ymin +
                    (py / height) *
                    (ymax - ymin);

                let zx = 0;
                let zy = 0;

                let cx = x;
                let cy = y;

                // Julia

                if (
                    fractal === 'julia'
                ) {

                    zx = x;
                    zy = y;

                    cx = -0.8;
                    cy = 0.156;
                }

                let iteration = 0;

                while (
                    zx * zx +
                    zy * zy < 4 &&
                    iteration < maxIterations
                ) {

                    let xtemp;

                    switch (fractal) {

                        case 'burningShip':

                            xtemp =
                                zx * zx -
                                zy * zy +
                                cx;

                            zy =
                                Math.abs(
                                    2 *
                                    zx *
                                    zy
                                ) + cy;

                            zx =
                                Math.abs(
                                    xtemp
                                );

                            break;

                        case 'tricorn':

                            xtemp =
                                zx * zx -
                                zy * zy +
                                cx;

                            zy =
                                -2 *
                                zx *
                                zy +
                                cy;

                            zx = xtemp;

                            break;

                        default:

                            xtemp =
                                zx * zx -
                                zy * zy +
                                cx;

                            zy =
                                2 *
                                zx *
                                zy +
                                cy;

                            zx = xtemp;
                    }

                    iteration++;

                }

                const index =
                    (
                        py * width +
                        px
                    ) * 4;

                if (
                    iteration ===
                    maxIterations
                ) {

                    image.data[index] = 0;
                    image.data[index + 1] = 0;
                    image.data[index + 2] = 0;
                    image.data[index + 3] = 255;

                } else {

                    const t =
                        iteration /
                        maxIterations;

                    // MUCH BETTER COLORS

                    image.data[index] =
                        Math.floor(
                            9 *
                            (1 - t) *
                            t *
                            t *
                            t *
                            255
                        );

                    image.data[index + 1] =
                        Math.floor(
                            15 *
                            (1 - t) *
                            (1 - t) *
                            t *
                            t *
                            255
                        );

                    image.data[index + 2] =
                        Math.floor(
                            8.5 *
                            (1 - t) *
                            (1 - t) *
                            (1 - t) *
                            t *
                            255
                        );

                    image.data[index + 3] = 255;

                }

            }

        }

        ctx.putImageData(
            image,
            0,
            0
        );

    }, [fractal]);

    return (

        <canvas
            ref={canvasRef}
            width={1200}
            height={800}
            className="
                w-full
                rounded-2xl
                border
                border-zinc-800
            "
        />

    );
}
