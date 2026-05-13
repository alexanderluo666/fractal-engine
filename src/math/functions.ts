export const functions = {

    cosine: (x: number) =>
        Math.cos(x),

    sqrt: (x: number) =>
        Math.sqrt(Math.abs(x)),

    logistic:
        (r: number) =>
        (x: number) =>
            r * x * (1 - x),
};
