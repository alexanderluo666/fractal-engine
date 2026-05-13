import { useMemo, useState } from 'react';

import { iterateFunction } from './math/iterate';
import { functions } from './math/functions';

export default function App() {

    const [start, setStart] = useState(0.5);

    const [steps, setSteps] = useState(20);

    const values = useMemo(() => {

        return iterateFunction(
            functions.cosine,
            start,
            steps
        );

    }, [start, steps]);

    return (
        <div style={{ padding: 24 }}>

            <h1>Fractal Engine 🚀</h1>

            <div>

                <label>Start Value:</label>

                <input
                    type="number"
                    value={start}
                    step="0.1"
                    onChange={(e) =>
                        setStart(Number(e.target.value))
                    }
                />

            </div>

            <br />

            <div>

                <label>Steps:</label>

                <input
                    type="number"
                    value={steps}
                    onChange={(e) =>
                        setSteps(Number(e.target.value))
                    }
                />

            </div>

            <br />

            <pre>
                {values.map((v, i) =>
                    `${i}: ${v}\n`
                )}
            </pre>

        </div>
    );
}
