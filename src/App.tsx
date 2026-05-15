import React, {
    useEffect,
    useRef,
    useState
} from 'react';

type FractalType =
    | 'mandelbrot'
    | 'julia'
    | 'burning'
    | 'tricorn';

export default function App() {

    const canvasRef =
        useRef<HTMLCanvasElement | null>(null);

    const animationRef =
        useRef<number>(0);

    const zoomExpRef =
        useRef(0);

    const xRef =
        useRef(-0.5);

    const yRef =
        useRef(0);

    const draggingRef =
        useRef(false);

    const lastMouseRef =
        useRef({ x: 0, y: 0 });

    const tempCanvasRef =
        useRef<HTMLCanvasElement | null>(null);

    const tempCtxRef =
        useRef<CanvasRenderingContext2D | null>(null);

    const [type, setType] =
        useState<FractalType>('mandelbrot');

    function handleTypeChange(
        e: React.ChangeEvent<HTMLSelectElement>
    ) {
        setType(e.target.value as FractalType);
    }

    useEffect(() => {

        const canvas =
            canvasRef.current;

        if (!canvas) return;

        const ctx =
            canvas.getContext('2d');

        if (!ctx) return;

        const W = 1000;
        const H = 700;

        canvas.width = W;
        canvas.height = H;

        // ⚡ create temp canvas ONCE (fix lag spike)
        const tempCanvas =
            document.createElement('canvas');

        tempCanvas.width = W;
        tempCanvas.height = H;

        const tempCtx =
            tempCanvas.getContext('2d');

        if (!tempCtx) return;

        tempCanvasRef.current = tempCanvas;
        tempCtxRef.current = tempCtx;

        const SCALE = 1.5;

        const RW = Math.floor(W / SCALE);
        const RH = Math.floor(H / SCALE);

        const imageData =
            ctx.createImageData(RW, RH);

        const pixels =
            imageData.data;

        function onMouseDown(e: MouseEvent) {
            draggingRef.current = true;
            lastMouseRef.current = {
                x: e.clientX,
                y: e.clientY
            };
        }

        function onMouseUp() {
            draggingRef.current = false;
        }

        function onMouseMove(e: MouseEvent) {

            if (!draggingRef.current) return;

            const dx =
                e.clientX - lastMouseRef.current.x;

            const dy =
                e.clientY - lastMouseRef.current.y;

            lastMouseRef.current = {
                x: e.clientX,
                y: e.clientY
            };

            const scale =
                Math.exp(-zoomExpRef.current);

            xRef.current -= dx * scale * 0.004;
            yRef.current -= dy * scale * 0.004;
        }

        function onWheel(e: WheelEvent) {

            e.preventDefault();

            // 🔥 FIX: stronger zoom response
            const delta =
                e.deltaY > 0 ? -0.4 : 0.4;

            const rect =
                canvas.getBoundingClientRect();

            const mx =
                e.clientX - rect.left;

            const my =
                e.clientY - rect.top;

            const scaleBefore =
                Math.exp(-zoomExpRef.current);

            const wx =
                (mx - W / 2)
                * scaleBefore
                * 0.004
                + xRef.current;

            const wy =
                (my - H / 2)
                * scaleBefore
                * 0.004
                + yRef.current;

            zoomExpRef.current += delta;

            const scaleAfter =
                Math.exp(-zoomExpRef.current);

            xRef.current =
                wx -
                (mx - W / 2)
                * scaleAfter
                * 0.004;

            yRef.current =
                wy -
                (my - H / 2)
                * scaleAfter
                * 0.004;
        }

        canvas.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('wheel', onWheel, {
            passive: false
        });

        function mandelbrot(x:number,y:number){
            let zx=0,zy=0,i=0;
            while(zx*zx+zy*zy<4&&i<180){
                const xt=zx*zx-zy*zy+x;
                zy=2*zx*zy+y;
                zx=xt;
                i++;
            }
            return i;
        }

        function julia(x:number,y:number){
            let zx=x,zy=y,i=0;
            const cx=-0.8,cy=0.156;
            while(zx*zx+zy*zy<4&&i<180){
                const xt=zx*zx-zy*zy+cx;
                zy=2*zx*zy+cy;
                zx=xt;
                i++;
            }
            return i;
        }

        function burning(x:number,y:number){
            let zx=0,zy=0,i=0;
            while(zx*zx+zy*zy<4&&i<180){
                zx=Math.abs(zx);
                zy=Math.abs(zy);
                const xt=zx*zx-zy*zy+x;
                zy=2*zx*zy+y;
                zx=xt;
                i++;
            }
            return i;
        }

        function tricorn(x:number,y:number){
            let zx=0,zy=0,i=0;
            while(zx*zx+zy*zy<4&&i<180){
                const xt=zx*zx-zy*zy+x;
                zy=-2*zx*zy+y;
                zx=xt;
                i++;
            }
            return i;
        }

        function palette(i:number){
            const t=i/180;
            return [
                127+127*Math.sin(6.283*t),
                127+127*Math.sin(6.283*(t+0.33)),
                127+127*Math.sin(6.283*(t+0.66))
            ];
        }

        function render() {

            const scale =
                Math.exp(-zoomExpRef.current);

            for(let py=0;py<RH;py++){
                for(let px=0;px<RW;px++){

                    const x =
                        (px-RW/2)
                        *scale*0.004
                        +xRef.current;

                    const y =
                        (py-RH/2)
                        *scale*0.004
                        +yRef.current;

                    let iter=0;

                    if(type==='mandelbrot')
                        iter=mandelbrot(x,y);
                    else if(type==='julia')
                        iter=julia(x,y);
                    else if(type==='burning')
                        iter=burning(x,y);
                    else
                        iter=tricorn(x,y);

                    const [r,g,b]=palette(iter);

                    const idx=(py*RW+px)*4;

                    pixels[idx]=r;
                    pixels[idx+1]=g;
                    pixels[idx+2]=b;
                    pixels[idx+3]=255;
                }
            }

            // ⚡ reuse temp canvas (NO recreation = NO lag spikes)
            const tctx = tempCtxRef.current!;
            const tempCanvas = tempCanvasRef.current!;

            tctx.putImageData(imageData,0,0);

            ctx.imageSmoothingEnabled=false;
            ctx.clearRect(0,0,W,H);

            ctx.drawImage(
                tempCanvas,
                0,0,RW,RH,
                0,0,W,H
            );

            animationRef.current =
                requestAnimationFrame(render);
        }

        render();

        return () => {

            cancelAnimationFrame(animationRef.current);

            canvas.removeEventListener('mousedown', onMouseDown);
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mousemove', onMouseMove);
            canvas.removeEventListener('wheel', onWheel);
        };

    }, [type]);

    return (
        <div className="min-h-screen bg-black text-white p-4">

            <h1 className="text-4xl font-bold mb-4">
                AetherScope
            </h1>

            <select
                value={type}
                onChange={handleTypeChange}
                className="bg-zinc-900 border border-zinc-700 px-4 py-2 rounded mb-4"
            >
                <option value="mandelbrot">Mandelbrot</option>
                <option value="julia">Julia</option>
                <option value="burning">Burning Ship</option>
                <option value="tricorn">Tricorn</option>
            </select>

            <canvas
                ref={canvasRef}
                className="border border-zinc-800 rounded shadow-2xl cursor-grab"
            />

        </div>
    );
}
