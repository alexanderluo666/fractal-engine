import Complex from './Complex';

export function mandelbrotIterations(
    c: Complex,
    maxIterations: number
): number {

    let z = new Complex(0, 0);

    for (
        let i = 0;
        i < maxIterations;
        i++
    ) {

        z = z
            .multiply(z)
            .add(c);

        if (
            z.magnitudeSquared() > 4
        ) {

            return i;

        }

    }

    return maxIterations;

}
