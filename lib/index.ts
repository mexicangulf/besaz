declare const __DEBUG_MODE__: boolean;
declare const __IMAGE_TEXTURE_ONLY__: boolean;
declare const __BEHAVIOR_SCRIPTING_ENABLED__: boolean;

import {DisplayObject, Sprite} from "./display";
import {Input} from "./input";
export * from "./display";
export * from "./script";
export * from "./vector";

export type Layers = "UI" | "GAME" | "DEBUG";

export type Ticker = (app: Application, dt: number) => void;
export type Point = [number, number];

export class Application {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private lastTime: number = 0;

    public ui: any;

    private layers: Map<Layers, DisplayObject[]> = new Map();
    private tickers: Ticker[] = [];

    // create Image sprites used for caching images
    private sources: Map<string, string> = new Map();
    public images: Map<string, HTMLImageElement> = new Map();
    public allLoaded: boolean = false;

    private preLoop: Ticker =  () => {};
    private postLoop: Ticker = () => {};

    public fps: number;

    public input = new Input();

    constructor(fps: number, canvas: HTMLCanvasElement) {
        
        this.fps = fps;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;

        this.layers.set("GAME", []);
        this.layers.set("UI", []);
        this.layers.set("DEBUG", []);

        this.input.init();

    };

    public setPreLoop(pre: Ticker) {
        this.preLoop = pre;
    };  

    public setPostLoop(post: Ticker) {
        this.postLoop = post;
    }

    public addTicker(ticker: Ticker) {
        this.tickers.push(ticker);
    };

    private runUpdates(dt: number) {

        for(const object of this.layers.get("GAME")!) {
            object.update(this, dt);
        };

        // TODO: Implement running updates for debug layer objects

    };

    // TODO
    // private runFixedUpdates() {};

    private Internalloop(dt: number) {


        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.preLoop(this, dt);

        for(const ticker of this.tickers) {
            ticker(this, dt);
        };

        if(__BEHAVIOR_SCRIPTING_ENABLED__)
            this.runUpdates(dt);

        this.drawLayers();

        this.postLoop(this, dt);

    };

    static createSprite(texture: any, x=0, y=0) {
        return new Sprite(x, y, texture);
    }

    public drawPoints(
        points: Point[],
        mode: "stroke" | "fill",
        closed: boolean = false,
        color: string = "red"
    ) {

        if (points.length === 0) return;

        this.ctx.save();

        this.ctx.beginPath();
        this.ctx.moveTo(...points[0]);

        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(...points[i]);
        }

        if (closed)
            this.ctx.closePath();

        if (mode === "stroke") {
            this.ctx.strokeStyle = color;
            this.ctx.stroke();
        } else {
            this.ctx.fillStyle = color;
            this.ctx.fill();
        }

        this.ctx.restore();
    }

    public drawArc(
        x: number,
        y: number,
        radius: number,
        startAngle: number,
        endAngle: number,
        color: string = "black",
        mode: "stroke" | "fill"
    ) {

        this.ctx.save();

        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, startAngle, endAngle);

        if(mode == "fill") {
            this.ctx.fillStyle = color;
            this.ctx.fill();
        } else {
            this.ctx.strokeStyle = color;
            this.ctx.stroke();
        }

        this.ctx.restore();

    }
    
    public DEBUG_drawPoints(points: Point[], mode: "stroke" | "fill",
        closed: boolean = false,
        color: string = "red"
    ) {
        if(__DEBUG_MODE__)
            this.drawPoints(points, mode, closed, color);
    };

    public DEBUG_drawArc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    color: string = "black",
    mode: "stroke" | "fill"

    ) {
        if(__DEBUG_MODE__)
            this.drawArc(x, y, radius, startAngle, endAngle, color, mode);
    };

    public async addObjectAsync(object: DisplayObject, layer: Layers) {
        if(__BEHAVIOR_SCRIPTING_ENABLED__)
            await object.onStart(this);
        this.layers.get(layer)!.push(object);
    }

    public async addGameObjectAsync(object: DisplayObject) {
        await this.addObjectAsync(object, "GAME");
        return object;
    }
    

    public addObject(object: DisplayObject, layer: Layers) {
        if(__BEHAVIOR_SCRIPTING_ENABLED__)
            object.onStart(this);
        this.layers.get(layer)!.push(object);
    }

    public addGameObject(object: DisplayObject) {
        this.addObject(object, "GAME");
        return object;
    }

    public removeObject(id: string, layer: Layers) {
        const l = this.layers.get(layer);
        const idx = l!.findIndex((obj) => obj.id == id);
        if(idx == -1) {return}
        this.layers.get(layer)?.splice(idx, 1);
    };

    public removeGameObject(id: string) {
        const l = this.layers.get("GAME");
        const idx = l!.findIndex((obj) => obj.id == id);
        if(idx == -1) {return}
        this.layers.get("GAME")!.splice(idx, 1);
    };

    public addUIElement(object: DisplayObject) {
        this.addObject(object, "UI");
    };

    public draw(objects: DisplayObject[]) {

        for(const object of objects) {
            object.render(this.ctx);
        }

    }

    public drawLayers() {

        this.draw(this.layers.get("GAME")!);
        this.draw(this.layers.get("UI")!);
        if(__DEBUG_MODE__)
            this.draw(this.layers.get("DEBUG")!);

    };

    public findById(id: string, layer: Layers = "GAME") {
        return this.layers.get(layer)!.find((object) => object.id == id);
    };

    private loadImage(key: string, src: string): Promise<void> {

        let image = this.images.get(key)!;
        image.src = src;

        return new Promise((resolve, _) => {
            image.onload = () => {
                this.images.set(key, image);
                resolve();
            }
        });

    };

    private async loadAll() {

        let promises = [];

        for(const [key, src] of this.sources.entries()) {
            promises.push(this.loadImage(key, src));
        };

        await Promise.all(promises);

        this.loop();

    }

    public preLoadImage(key: string, src: string) {
        this.sources.set(key, src);
        this.images.set(key, new Image());
    };

    public loop() {
        const step = (time: number) => {
            const dt = time - this.lastTime;
            this.lastTime = time;

            this.Internalloop(dt);

            requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    }

    public start() {
        if(this.sources.size > 0) {
            this.loadAll();
        } else {
            this.loop();
        }
    }


};