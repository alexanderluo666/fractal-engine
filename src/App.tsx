import { useState } from 'react';

import GraphCanvas from './components/GraphCanvas';

export default function App() {

    const [fractal, setFractal] =
        useState('mandelbrot');

    return (

        <div className="min-h-screen bg-black text-white p-6">

            <div className="max-w-7xl mx-auto">

                {/* Header */}

                <div className="mb-8">

                    <h1
                        className="
                            text-6xl
                            font-black
                            bg-gradient-to-r
                            from-pink-500
                            via-cyan-400
                            to-purple-500
                            text-transparent
                            bg-clip-text
                        "
                    >
                        Fractal Engine
                    </h1>

                    <p className="text-zinc-500 mt-2 text-lg">
                        Complex Plane Renderer
                    </p>

                </div>

                <div
                    className="
                        grid
                        grid-cols-1
                        lg:grid-cols-4
                        gap-6
                    "
                >

                    {/* Controls */}

                    <div
                        className="
                            bg-zinc-900/80
                            rounded-3xl
                            p-6
                            border
                            border-zinc-800
                            h-fit
                        "
                    >

                        <h2 className="text-2xl font-bold mb-6">
                            Fractals
                        </h2>

                        <select
                            value={fractal}
                            onChange={(e) =>
                                setFractal(
                                    e.target.value
                                )
                            }
                            className="
                                w-full
                                bg-zinc-800
                                border
                                border-zinc-700
                                rounded-xl
                                p-3
                                mb-6
                            "
                        >

                            <option value="mandelbrot">
                                Mandelbrot
                            </option>

                            <option value="julia">
                                Julia Set
                            </option>

                            <option value="burningShip">
                                Burning Ship
                            </option>

                            <option value="tricorn">
                                Tricorn
                            </option>

                        </select>

                        <div
                            className="
                                bg-black
                                rounded-2xl
                                p-4
                                border
                                border-zinc-800
                                text-sm
                                text-zinc-400
                                leading-relaxed
                            "
                        >

                            Fractals emerge from
                            repeated iteration of
                            complex equations.

                            <br />
                            <br />

                            Tiny coordinate changes
                            create massive
                            structural differences.

                        </div>

                    </div>

                    {/* Renderer */}

                    <div className="lg:col-span-3">

                        <div
                            className="
                                bg-zinc-900/80
                                rounded-3xl
                                p-6
                                border
                                border-zinc-800
                            "
                        >

                            <h2 className="text-3xl font-bold mb-4">
                                {fractal}
                            </h2>

                            <GraphCanvas
                                fractal={fractal}
                            />

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}
