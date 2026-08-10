import { Vec2 } from "../vector";
import {DisplayObject} from "./object";
import type {BehaviourClass} from "../script";

function simple_random_id_genrator() {
    return `${Math.random()}`.split(".").join("");
}

export class Sprite<T extends BehaviourClass = BehaviourClass>
 extends DisplayObject<T> {

    public id: string;
    public angle: number = 0;
    public texture: HTMLImageElement;
    public pos: Vec2 = Vec2.zero;
    public imageFilter = "";

    public loadingWidth: number;
    public loadingHeight: number;

    constructor(
        x: number,
        y: number,
        // for some reason the library stops working if i remove these
        // I don't want to turn erasble only syntax off
        texture: HTMLImageElement,
        angle?: number,

        loadingWidth: number = 0,
        loadingHeight: number = 0,

        id?: string) {

        super();

        this.pos = new Vec2(x, y);

        this.texture = texture;

        if(angle) {
            this.angle = angle;
        }

        this.loadingWidth = loadingWidth;
        this.loadingHeight = loadingHeight;

        if(id) 
            this.id = id;
        else
            this.id = "NOID";

    };

    public randomId(namespace: string, idx?: string) {
        this.id = namespace + idx + simple_random_id_genrator();
    };

    public move(dx: number, dy: number) {
        this.pos = this.pos.add(new Vec2(dx, dy));
    }

    public render(ctx: CanvasRenderingContext2D): void {

        const img = this.texture;

        if(!img) return;

        try {
            ctx.save();

            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle || 0);

            const w = img.width;
            const h = img.height;

            ctx.filter = this.imageFilter;
            ctx.drawImage(
                img,
                -w*this.scaleX/2,
                -h*this.scaleY/2,
                w*this.scaleX,
                h*this.scaleY
            );

            ctx.filter = "";
            ctx.restore();

        } catch(error) {
            console.log(`rendering sprite failed: `);
            console.log(error);
        }

    }

    static Clone(sprite: Sprite, cloneId: boolean = false): Sprite {

        // NOT IMPLEMENTED
        cloneId;

        const newSprite = new Sprite(sprite.x,
            sprite.y,
            sprite.texture,
            sprite.angle,
        );

        return newSprite;

    };

    get w() {
        if(!this.texture) {
            return this.loadingWidth*this.scaleX;
        }
        return this.texture.width*this.scaleX;
    }

    get h() {
        if(!this.texture) {
            return this.loadingHeight*this.scaleY;
        }
        return this.texture.height*this.scaleY;
    }

};