import { useMemo, useState } from 'react';

import { iterateFunction } from './math/iterate';
import { functions } from './math/functions';

import GraphCanvas from './components/GraphCanvas';

export default function App() {

    const [selectedFunction, setSelectedFunction] =
        useState('cosine');

    const [start, setStart] = useState(0.5);

    const [steps, setSteps] = useState(50);

    const [r, setR] = useState(3.7);

    const values = useMemo(() => {

        let fn: (x: number) => number;

        switch (selectedFunction) {

            case 'sqrt':
                fn = functions.sqrt;
                break;

            case 'logistic':
                fn = functions.logistic(r);
                break;

            default:
                fn = functions.cosine;
        }

        return iterateFunction(
            fn,
            start,
            steps
        );

    }, [selectedFunction, start, steps, r]);

    return (

        <div className="min-h-screen bg-black text-white p-6">

            <div className="max-w-7xl mx-auto">

                {/* Header */}

                <div className="mb-8">

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

                <div
                    className="
                        grid
                        grid-cols-1
                        lg:grid-cols-3
                        gap-6
                    "
                >

                    {/* Left Panel */}

                    <div
                        className="
                            bg-zinc-900/80
                            backdrop-blur
                            rounded-3xl
                            p-6
                            border
                            border-zinc-800
                        "
                    >

                        <h2
                            className="
                                text-2xl
                                font-bold
                                mb-6
                            "
                        >
                            Controls
                        </h2>

                        {/* Function */}

                        <div className="mb-6">

                            <label
                                className="
                                    block
                                    mb-2
                                    text-zinc-300
                                "
                            >
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

                            </select>

                        </div>

                        {/* Start */}

                        <div className="mb-6">

                            <div
                                className="
                                    flex
                                    justify-between
                                    mb-2
                                "
                            >
                                <span>
                                    Start Value
                                </span>

                                <span
                                    className="
                                        text-green-400
                                    "
                                >
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
                                        Number(
                                            e.target.value
                                        )
                                    )
                                }
                                className="w-full"
                            />

                        </div>

                        {/* Steps */}

                        <div className="mb-6">

                            <div
                                className="
                                    flex
                                    justify-between
                                    mb-2
                                "
                            >
                                <span>
                                    Steps
                                </span>

                                <span
                                    className="
                                        text-cyan-400
                                    "
                                >
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
                                        Number(
                                            e.target.value
                                        )
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

                                    <div
                                        className="
                                            flex
                                            justify-between
                                            mb-2
                                        "
                                    >
                                        <span>
                                            r Value
                                        </span>

                                        <span
                                            className="
                                                text-pink-400
                                            "
                                        >
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
                                                Number(
                                                    e.target.value
                                                )
                                            )
                                        }
                                        className="w-full"
                                    />

                                </div>
                            )
                        }

                    </div>

                    {/* Right Side */}

                    <div className="lg:col-span-2">

                        {/* Current Value */}

                        <div
                            className="
                                bg-zinc-900/80
                                rounded-3xl
                                p-6
                                border
                                border-zinc-800
                                mb-6
                            "
                        >

                            <h2
                                className="
                                    text-xl
                                    text-zinc-400
                                    mb-2
                                "
                            >
                                Current Value
                            </h2>

                            <div
                                className="
                                    text-5xl
                                    font-black
                                    text-green-400
                                "
                            >
                                {
                                    values[
                                        values.length - 1
                                    ].toFixed(6)
                                }
                            </div>

                        </div>

                        {/* Graph */}

                        <div
                            className="
                                bg-zinc-900/80
                                rounded-3xl
                                p-6
                                border
                                border-zinc-800
                            "
                        >

                            <h2
                                className="
                                    text-2xl
                                    font-bold
                                    mb-4
                                "
                            >
                                Visualization
                            </h2>

                            <GraphCanvas
                                values={values}
                            />

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}
