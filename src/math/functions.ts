export const functions = {

    cosine: (x: number) =>
        Math.cos(x),

    sqrt: (x: number) =>
        Math.sqrt(Math.abs(x)),

    logistic:
        (r: number) =>
        (x: number) =>
            r * x * (1 - x),

    tanh: (x: number) =>
        Math.tanh(x),

    atan: (x: number) =>
        Math.atan(x),

    reciprocalShift: (x: number) =>
        1 / (x + 2),

    cosineSquared: (x: number) =>
        Math.cos(x * x),

    dampedSine: (x: number) =>
        Math.sin(x) / 2,

    fixedPointWeird: (x: number) =>
        Math.pow((x + 1) / (x - 1), x),
};
