export default class Complex {

    re: number;

    im: number;

    constructor(
        re: number,
        im: number
    ) {

        this.re = re;
        this.im = im;

    }

    add(other: Complex): Complex {

        return new Complex(
            this.re + other.re,
            this.im + other.im
        );

    }

    multiply(other: Complex): Complex {

        return new Complex(

            this.re * other.re -
            this.im * other.im,

            this.re * other.im +
            this.im * other.re
        );

    }

    magnitudeSquared(): number {

        return (
            this.re * this.re +
            this.im * this.im
        );

    }

}
