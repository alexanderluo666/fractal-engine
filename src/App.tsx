import { useState } from 'react';
import GraphCanvas from './components/GraphCanvas';

export default function App() {

    const [fractal, setFractal] =
        useState('mandelbrot');

    return (
        <div className="min-h-screen bg-black text-white p-6">

            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-5xl font-black bg-gradient-to-r from-pink-500 via-cyan-400 to-purple-500 text-transparent bg-clip-text">
                        Fractal Engine
                    </h1>
                    <p className="text-zinc-500">
                        Zoomable fractal + tree renderer
                    </p>
                </div>

                {/* Controls */}
                <div className="mb-6">
                    <select
                        value={fractal}
                        onChange={(e) =>
                            setFractal(e.target.value)
                        }
                        className="bg-zinc-900 border border-zinc-700 p-3 rounded-xl"
                    >
                        <option value="mandelbrot">Mandelbrot</option>
                        <option value="julia">Julia</option>
                        <option value="burningShip">Burning Ship</option>
                        <option value="tricorn">Tricorn</option>
                        <option value="tree">Fractal Tree (CLI-style visual)</option>
                    </select>
                </div>

                {/* Canvas */}
                <GraphCanvas fractal={fractal} />

            </div>
        </div>
    );
}
