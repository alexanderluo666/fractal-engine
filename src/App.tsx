import { useMemo, useState } from 'react';

import { iterateFunction } from './math/iterate';
import { functions } from './math/functions';

import GraphCanvas from './components/GraphCanvas';

export default function App() {

    const [selectedFunction, setSelectedFunction] =
        useState('cosine');

    const [start, setStart] = useState(0.5);

    const [steps, setSteps] = useState(20);

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
        <div
            style={{
                padding: 24,
                maxWidth: 900,
                margin: '0 auto',
                fontFamily: 'sans-serif',
                color: 'white',
                background: '#0a0a0a',
                minHeight: '100vh',
            }}
        >

            <h1
                style={{
                    fontSize: 40,
                    marginBottom: 8,
                }}
            >
                Fractal Engine 🚀
            </h1>

            <p
                style={{
                    color: '#888',
                    marginBottom: 32,
                }}
            >
                Dynamical Systems Playground
            </p>

            <div
                style={{
                    background: '#151515',
                    padding: 24,
                    borderRadius: 16,
                    marginBottom: 24,
                }}
            >

                {/* Function Selector */}

                <div style={{ marginBottom: 24 }}>

                    <label>
                        Function
                    </label>

                    <br />

                    <select
                        value={selectedFunction}
                        onChange={(e) =>
                            setSelectedFunction(
                                e.target.value
                            )
                        }
                        style={{
                            marginTop: 8,
                            padding: 12,
                            width: '100%',
                            borderRadius: 8,
                            background: '#222',
                            color: 'white',
                            border: '1px solid #333',
                        }}
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

                {/* Start Value */}

                <div style={{ marginBottom: 24 }}>

                    <label>
                        Start Value:
                        {' '}
                        {start.toFixed(2)}
                    </label>

                    <br />

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
                        style={{
                            width: '100%',
                            marginTop: 8,
                        }}
                    />

                </div>

                {/* Steps */}

                <div style={{ marginBottom: 24 }}>

                    <label>
                        Steps:
                        {' '}
                        {steps}
                    </label>

                    <br />

                    <input
                        type="range"
                        min="1"
                        max="300"
                        value={steps}
                        onChange={(e) =>
                            setSteps(
                                Number(e.target.value)
                            )
                        }
                        style={{
                            width: '100%',
                            marginTop: 8,
                        }}
                    />

                </div>

                {/* Logistic r */}

                {
                    selectedFunction === 'logistic' && (

                        <div
                            style={{
                                marginBottom: 24,
                            }}
                        >

                            <label>
                                r Value:
                                {' '}
                                {r.toFixed(2)}
                            </label>

                            <br />

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
                                style={{
                                    width: '100%',
                                    marginTop: 8,
                                }}
                            />

                        </div>
                    )
                }

            </div>

            {/* Current Value */}

            <div
                style={{
                    background: '#151515',
                    padding: 24,
                    borderRadius: 16,
                    marginBottom: 24,
                }}
            >

                <h2
                    style={{
                        marginTop: 0,
                    }}
                >
                    Current Value
                </h2>

                <div
                    style={{
                        fontSize: 32,
                        color: '#00ff88',
                        fontWeight: 'bold',
                    }}
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
                style={{
                    background: '#151515',
                    padding: 24,
                    borderRadius: 16,
                    marginBottom: 24,
                }}
            >

                <h2
                    style={{
                        marginTop: 0,
                    }}
                >
                    Visualization
                </h2>

                <GraphCanvas values={values} />

            </div>

            {/* Sequence */}

            <div
                style={{
                    background: '#151515',
                    padding: 24,
                    borderRadius: 16,
                }}
            >

                <h2
                    style={{
                        marginTop: 0,
                    }}
                >
                    Sequence
                </h2>

                <pre
                    style={{
                        background: '#111',
                        color: '#00ff88',
                        padding: 16,
                        borderRadius: 8,
                        overflowX: 'auto',
                        maxHeight: 400,
                    }}
                >
                    {
                        values.map((v, i) =>
                            `${i}: ${v}\n`
                        )
                    }
                </pre>

            </div>

        </div>
    );
}
