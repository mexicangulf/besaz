import {DisplayObject} from "./object";

export class Group extends DisplayObject {

    public children: DisplayObject[] = [];

    constructor () {
        super();
    }

    public addChild(child: DisplayObject) {
        this.children.push(child);
        return this;
    }

    render(ctx: CanvasRenderingContext2D): void {
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        for(const child of this.children) {
            child.render(ctx);
        }

        ctx.save();

    }

};