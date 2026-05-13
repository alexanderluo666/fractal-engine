export function iterateFunction(
    fn: (x: number) => number,
    start: number,
    steps: number
): number[] {

    const values: number[] = [start];

    let x = start;

    for (let i = 0; i < steps; i++) {

        x = fn(x);

        values.push(x);
    }

    return values;
}
