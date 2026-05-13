import { useMemo, useState } from 'react';

import { iterateFunction } from './math/iterate';
import { functions } from './math/functions';

import GraphCanvas from './components/GraphCanvas';

const COLORS = {
    green: '#00ff88',
    cyan: '#00e5ff',
    pink: '#ff4fd8',
    orange: '#ff9f1c',
    purple: '#9b5cff',
    red: '#ff4f4f',
    yellow: '#ffe600',
};

export default function App() {

    const [selectedFunction, setSelectedFunction] =
        useState('cosine');

    const [start, setStart] =
        useState(0.5);

    const [steps, setSteps] =
        useState(50);

    const [r, setR] =
        useState(3.7);

    const [mode, setMode] =
        useState<'gui' | 'cli'>('gui');

    const [selectedColor, setSelectedColor] =
        useState('green');

    const graphColor = useMemo(() => {

        if (selectedColor === 'random') {

            const values =
                Object.values(COLORS);

            return values[
                Math.floor(
                    Math.random() * values.length
                )
            ];
        }

        return COLORS[
            selectedColor as keyof typeof COLORS
        ];

    }, [selectedColor]);

    const values = useMemo(() => {

        let fn: (x: number) => number;

        switch (selectedFunction) {

            case 'sqrt':
                fn = functions.sqrt;
                break;

            case 'logistic':
                fn = functions.logistic(r);
                break;

            case 'tanh':
                fn = functions.tanh;
                break;

            case 'atan':
                fn = functions.atan;
                break;

            case 'reciprocalShift':
                fn = functions.reciprocalShift;
                break;

            case 'cosineSquared':
                fn = functions.cosineSquared;
                break;

            case 'dampedSine':
                fn = functions.dampedSine;
                break;

            case 'fixedPointWeird':
                fn = functions.fixedPointWeird;
                break;

            default:
                fn = functions.cosine;
        }

        return iterateFunction(
            fn,
            start,
            steps
        );

    }, [
        selectedFunction,
        start,
        steps,
        r,
    ]);

    return (

        <div className="min-h-screen bg-black text-white p-6">

            <div className="max-w-7xl mx-auto">

                {/* Header */}

                <div className="flex justify-between items-center mb-8">

                    <div>

                        <h1
                            className="
                                text-5xl
                                font-black
                                bg-gradient-to-r
                                from-green-400
                                to-cyan-400
                                text-transparent
                                bg-clip-text
                            "
                        >
                            Fractal Engine
                        </h1>

                        <p className="text-zinc-500 mt-2">
                            Dynamical Systems Playground
                        </p>

                    </div>

                    <button
                        onClick={() =>
                            setMode(
                                mode === 'gui'
                                    ? 'cli'
                                    : 'gui'
                            )
                        }
                        className="
                            px-5
                            py-3
                            rounded-2xl
                            bg-zinc-800
                            hover:bg-zinc-700
                            transition
                        "
                    >
                        Switch to {
                            mode === 'gui'
                                ? 'CLI'
                                : 'GUI'
                        }
                    </button>

                </div>

                <div
                    className="
                        grid
                        grid-cols-1
                        lg:grid-cols-3
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
                        "
                    >

                        <h2 className="text-2xl font-bold mb-6">
                            Controls
                        </h2>

                        {/* Function */}

                        <div className="mb-6">

                            <label className="block mb-2">
                                Function
                            </label>

                            <select
                                value={selectedFunction}
                                onChange={(e) =>
                                    setSelectedFunction(
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
                                "
                            >

                                <option value="cosine">
                                    Cosine
                                </option>

                                <option value="sqrt">
                                    Square Root
                                </option>

                                <option value="logistic">
                                    Logistic Map
                                </option>

                                <option value="tanh">
                                    tanh(x)
                                </option>

                                <option value="atan">
                                    atan(x)
                                </option>

                                <option value="reciprocalShift">
                                    1 / (x + 2)
                                </option>

                                <option value="cosineSquared">
                                    cos(x^2)
                                </option>

                                <option value="dampedSine">
                                    sin(x) / 2
                                </option>

                                <option value="fixedPointWeird">
                                    Weird Fixed Point
                                </option>

                            </select>

                        </div>

                        {/* Color */}

                        <div className="mb-6">

                            <label className="block mb-2">
                                Graph Color
                            </label>

                            <select
                                value={selectedColor}
                                onChange={(e) =>
                                    setSelectedColor(
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
                                "
                            >

                                <option value="green">
                                    Green
                                </option>

                                <option value="cyan">
                                    Cyan
                                </option>

                                <option value="pink">
                                    Pink
                                </option>

                                <option value="orange">
                                    Orange
                                </option>

                                <option value="purple">
                                    Purple
                                </option>

                                <option value="red">
                                    Red
                                </option>

                                <option value="yellow">
                                    Yellow
                                </option>

                                <option value="random">
                                    Random
                                </option>

                            </select>

                        </div>

                        {/* Start */}

                        <div className="mb-6">

                            <div className="flex justify-between mb-2">

                                <span>
                                    Start Value
                                </span>

                                <span className="text-green-400">
                                    {start.toFixed(2)}
                                </span>

                            </div>

                            <input
                                type="range"
                                min="-2"
                                max="2"
                                step="0.01"
                                value={start}
                                onChange={(e) =>
                                    setStart(
                                        Number(e.target.value)
                                    )
                                }
                                className="w-full"
                            />

                        </div>

                        {/* Steps */}

                        <div className="mb-6">

                            <div className="flex justify-between mb-2">

                                <span>
                                    Steps
                                </span>

                                <span className="text-cyan-400">
                                    {steps}
                                </span>

                            </div>

                            <input
                                type="range"
                                min="1"
                                max="500"
                                value={steps}
                                onChange={(e) =>
                                    setSteps(
                                        Number(e.target.value)
                                    )
                                }
                                className="w-full"
                            />

                        </div>

                        {/* Logistic */}

                        {
                            selectedFunction ===
                            'logistic' && (

                                <div className="mb-6">

                                    <div className="flex justify-between mb-2">

                                        <span>
                                            r Value
                                        </span>

                                        <span className="text-pink-400">
                                            {r.toFixed(2)}
                                        </span>

                                    </div>

                                    <input
                                        type="range"
                                        min="0"
                                        max="4"
                                        step="0.01"
                                        value={r}
                                        onChange={(e) =>
                                            setR(
                                                Number(e.target.value)
                                            )
                                        }
                                        className="w-full"
                                    />

                                </div>
                            )
                        }

                    </div>

                    {/* Main */}

                    <div className="lg:col-span-2 space-y-6">

                        {/* Current Value */}

                        <div
                            className="
                                bg-zinc-900/80
                                rounded-3xl
                                p-6
                                border
                                border-zinc-800
                            "
                        >

                            <h2 className="text-zinc-400 mb-2">
                                Current Value
                            </h2>

                            <div
                                className="
                                    text-5xl
                                    font-black
                                "
                                style={{
                                    color: graphColor,
                                }}
                            >
                                {
                                    values[
                                        values.length - 1
                                    ].toFixed(6)
                                }
                            </div>

                        </div>

                        {/* GUI / CLI */}

                        {
                            mode === 'gui' ? (

                                <div
                                    className="
                                        bg-zinc-900/80
                                        rounded-3xl
                                        p-6
                                        border
                                        border-zinc-800
                                    "
                                >

                                    <h2 className="text-2xl font-bold mb-4">
                                        Visualization
                                    </h2>

                                    <GraphCanvas
                                        values={values}
                                        color={graphColor}
                                    />

                                </div>

                            ) : (

                                <div
                                    className="
                                        bg-zinc-900/80
                                        rounded-3xl
                                        p-6
                                        border
                                        border-zinc-800
                                    "
                                >

                                    <h2 className="text-2xl font-bold mb-4">
                                        CLI Output
                                    </h2>

                                    <pre
                                        className="
                                            bg-black
                                            p-4
                                            rounded-2xl
                                            overflow-auto
                                            max-h-[500px]
                                            text-sm
                                        "
                                        style={{
                                            color: graphColor,
                                        }}
                                    >
                                        {
                                            values.map(
                                                (v, i) =>
                                                    `${i}: ${v}\n`
                                            )
                                        }
                                    </pre>

                                </div>
                            )
                        }

                    </div>

                </div>

            </div>

        </div>
    );
}
