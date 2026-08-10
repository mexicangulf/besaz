import {Vec2, type Application } from "..";
import {type BehaviourClass, defualtBehaviourClass} from "../script";

export abstract class DisplayObject<T extends BehaviourClass = BehaviourClass> {

    public id: string = "NOID";
    public pos: Vec2 = Vec2.zero;
    public z: number = 0;
    public angle: number = 0;
    public scaleX: number = 1;
    public scaleY: number = 1;
    public visible: boolean = true;

    private behaviour: BehaviourClass  = new defualtBehaviourClass(this);

    abstract render(ctx: CanvasRenderingContext2D): void;

    // public async attachScript(path: string, type: ProgramType = "Typescript") {

    //     this.script = new Script(path, type);

    //     await this.script.init(this, () => {

    //         this.update = (app: Application, dt: number) => {
    //             this.script!.update(app, dt);
    //         };
    //         this.fixedUpdate = (app: Application, dt: number) => {
    //             this.script!.fixedUpdate(app, dt);
    //         }

    //         this.onStart = async (app: Application) => {
    //             await this.script!.onStart(app);
    //         }

    //     });

    // };

    // public attachScriptSync(path: string, type: ProgramType = "Typescript") {

    //     this.script = new Script(path, type);

    //     this.script.initSync(this, () => {

    //         this.update = (app: Application, dt: number) => {
    //             this.script!.update(app, dt);
    //         };
    //         this.fixedUpdate = (app: Application, dt: number) => {
    //             this.script!.fixedUpdate(app, dt);
    //         }

    //         this.onStart = async (app: Application) => {
    //             await this.script!.onStart(app);
    //         }

    //     });

    // };

    public attachScript(constructor: new (_sprite: any) => T) {
        this.overrideScript(new constructor(this));
    };

    public overrideScript(script: BehaviourClass) {

        this.behaviour = script;

        this.update = (app: Application, dt: number) => {
            this.behaviour!.update(app, dt);
        };

        this.fixedUpdate = (app: Application, dt: number) => {
            this.behaviour!.updateFixed(app, dt);
        };

        this.onStart = async (app: Application, object: any) => {
            await this.behaviour!.onStart(app, object);
        }

    };

    public update = (_app: Application, _dt: number) => {};
    public fixedUpdate = (_app: Application, _dt: number) => {};
    public onStart = async (_app: Application, _object: any) => {};

    get x() {
        return this.pos.x;
    }

    get y() {
        return this.pos.y;
    }

    get script(): T {
        return (this.behaviour as T);
    }

};