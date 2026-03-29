import {Vec2, type Application } from "..";
import {Script, type ProgramType} from "../script";

export abstract class DisplayObject {

    public id: string = "NOID";
    public pos: Vec2 = Vec2.zero;
    public angle: number = 0;
    public scaleX: number = 1;
    public scaleY: number = 1;
    public visible: boolean = true;
    public script: Script | undefined = undefined;
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

            this.onStart = async (app: Application) => {
                await this.script!.onStart(app);
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

        this.onStart = async (app: Application) => {
            await this.script!.onStart(app);
        }

    };

    public update = (app: Application, dt: number) => {app;dt};
    public fixedUpdate = (app: Application, dt: number) => {app;dt};
    public onStart = async (app: Application) => {app};

    get x() {
        return this.pos.x;
    }

    get y() {
        return this.pos.y;
    }

};