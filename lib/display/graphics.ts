import type { BehaviourClass} from "../script";
import {DisplayObject} from "./object";

type DrawCommand = (ctx: CanvasRenderingContext2D) => void;

// PixiJS inspired class
// also this is the only GPT class genrated in this library
// only beacuse I am running out of time
// and I can't write like I'm running out of time
export class Graphics<T extends BehaviourClass = BehaviourClass>
extends DisplayObject<T> {

    private commands: DrawCommand[] = [];

    private fillStyle: string | null = null;
    private strokeStyle: string | null = null;
    private lineWidth: number = 1;

    public beginFill(color: string) {
        this.fillStyle = color;
        return this;
    }

    public beginStroke(color: string, width: number = 1) {
        this.strokeStyle = color;
        this.lineWidth = width;
        return this;
    }

    public endFill() {
        this.fillStyle = null;
        return this;
    }

    public clear() {
        this.commands = [];
        return this;
    }

    public drawRect(x: number, y: number, w: number, h: number) {

        const fill = this.fillStyle;
        const stroke = this.strokeStyle;
        const lw = this.lineWidth;

        this.commands.push((ctx) => {

            ctx.beginPath();
            ctx.rect(x, y, w, h);

            if(fill) {
                ctx.fillStyle = fill;
                ctx.fill();
            }

            if(stroke) {
                ctx.strokeStyle = stroke;
                ctx.lineWidth = lw;
                ctx.stroke();
            }

        });

        return this;
    }

    public drawCircle(x: number, y: number, r: number) {

        const fill = this.fillStyle;
        const stroke = this.strokeStyle;
        const lw = this.lineWidth;

        this.commands.push((ctx) => {

            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);

            if(fill) {
                ctx.fillStyle = fill;
                ctx.fill();
            }

            if(stroke) {
                ctx.strokeStyle = stroke;
                ctx.lineWidth = lw;
                ctx.stroke();
            }

        });

        return this;
    }

    public drawLine(x1: number, y1: number, x2: number, y2: number) {

        const stroke = this.strokeStyle || "black";
        const lw = this.lineWidth;

        this.commands.push((ctx) => {

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);

            ctx.strokeStyle = stroke;
            ctx.lineWidth = lw;
            ctx.stroke();

        });

        return this;
    }

    public render(ctx: CanvasRenderingContext2D) {

        ctx.save();

        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle || 0);

        for(const cmd of this.commands) {
            cmd(ctx);
        }

        ctx.restore();

    }

}