import type {Application } from "..";
import {Script, type ProgramType} from "../script";

export abstract class DisplayObject {

    public id: string = "";
    public x: number = 0;
    public y: number = 0;
    public angle: number = 0;
    public scaleX: number = 1;
    public scaleY: number = 1;
    public visible: boolean = true;
    private script: Script | undefined = undefined;
    // private script;

    abstract render(ctx: CanvasRenderingContext2D): void;

    public async attachScript(path: string, type: ProgramType = "Typescript") {

        this.script = new Script(path, type);

        await this.script.init(this, () => {

            this.update = (app: Application, dt: number) => {
                this.script!.update(app, dt);
            };
            this.fixedUpdate = (app: Application, dt: number) => {
                this.script!.fixedUpdate(app, dt);
            }

            this.onStart = (app: Application) => {
                this.script!.onStart(app);
            }

        });

    };

    public overrideScript(script: Script) {

        this.script = script;

        this.update = (app: Application, dt: number) => {
            this.script!.update(app, dt);
        };

        this.fixedUpdate = (app: Application, dt: number) => {
            this.script!.fixedUpdate(app, dt);
        };

        this.onStart = (app: Application) => {
            this.script!.onStart(app);
        }

    };

    public update = (app: Application, dt: number) => {app;dt};
    public fixedUpdate = (app: Application, dt: number) => {app;dt};
    public onStart = (app: Application) => {app};

};