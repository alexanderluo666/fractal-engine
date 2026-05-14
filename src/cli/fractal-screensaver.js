const chars = " .,:;i1tfLCG08@";

function mandel(x, y) {

    let zx = 0;
    let zy = 0;
    let i = 0;

    while (zx * zx + zy * zy < 4 && i < 60) {

        const xt = zx * zx - zy * zy + x;

        zy = 2 * zx * zy + y;
        zx = xt;

        i++;
    }

    return i;
}

function render() {

    const w = 100;
    const h = 40;

    let out = "\x1b[H\x1b[2J"; // smooth terminal clear

    for (let y = 0; y < h; y++) {

        let line = "";

        for (let x = 0; x < w; x++) {

            const cx = -2.5 + (x / w) * 3.5;
            const cy = -1.2 + (y / h) * 2.4;

            const v = mandel(cx, cy);

            const t = v / 60;

            const idx = Math.min(
                chars.length - 1,
                Math.floor(t * chars.length)
            );

            line += chars[idx] || " ";
        }

        out += line + "\n";
    }

    console.log(out);
}

setInterval(render, 80);
