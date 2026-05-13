import { useMemo, useState } from 'react';

import { iterateFunction } from './math/iterate';
import { functions } from './math/functions';

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
                maxWidth: 700,
                margin: '0 auto',
                fontFamily: 'sans-serif',
            }}
        >

            <h1>Fractal Engine 🚀</h1>

            <hr />

            <div style={{ marginBottom: 24 }}>

                <label>
                    Function:
                </label>

                <br />

                <select
                    value={selectedFunction}
                    onChange={(e) =>
                        setSelectedFunction(e.target.value)
                    }
                    style={{
                        marginTop: 8,
                        padding: 8,
                        width: '100%',
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
                        setStart(Number(e.target.value))
                    }
                    style={{
                        width: '100%',
                        marginTop: 8,
                    }}
                />

            </div>

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
                    max="200"
                    value={steps}
                    onChange={(e) =>
                        setSteps(Number(e.target.value))
                    }
                    style={{
                        width: '100%',
                        marginTop: 8,
                    }}
                />

            </div>

            {
                selectedFunction === 'logistic' && (

                    <div style={{ marginBottom: 24 }}>

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
                                setR(Number(e.target.value))
                            }
                            style={{
                                width: '100%',
                                marginTop: 8,
                            }}
                        />

                    </div>
                )
            }

            <hr />

            <h2>
                Current Value:
                {' '}
                {
                    values[
                        values.length - 1
                    ].toFixed(6)
                }
            </h2>

            <pre
                style={{
                    background: '#111',
                    color: '#0f0',
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
    );
}
