import type {Application} from ".";
import type {DisplayObject} from "./display/object";

export type ProgramType = "Typescript" | "WebAssembly";

export let ModuleCache: Map<string, any> = new Map();

export class Script {

    public path: string;
    public type: ProgramType;
    public behaviour: any = undefined;

    constructor(path: string, type: ProgramType = "Typescript") {
        
        this.path = path;
        this.type = type;

    };

    public async init(sprite: DisplayObject, onload: CallableFunction = () => {}) {
        if(this.type == "Typescript") {

            if(ModuleCache.has(this.path)) {
                const module = ModuleCache.get(this.path);
                this.behaviour = new module.default(sprite);
                
                if(onload)
                    onload();

                return;
            };

            const name = this.path.split("/").slice(-1);
            const path = this.path.split("/").slice(0, -1).join("/");

            let module;

            if(path) {
                module = await import(/* @vite-ignore */ `/behaviour/${path}/${name}`);
            } else {
                module = await import(/* @vite-ignore */ `/behaviour/${name}`);
            }

            ModuleCache.set(this.path, module);

            this.behaviour = new module.default(sprite);

            if(onload)
                onload();
            
        }
    };

    // this is an extra check that i have to get rid of
    public update(app: Application, dt: number) {
        if(this.behaviour !== undefined)
            this.behaviour.update(app, dt);
    }

    public fixedUpdate(app: Application, dt: number) {
        if(this.behaviour !== undefined)
            this.behaviour.fixedUpdate(app, dt);
    };

    public async onStart(app: Application) {
        if(this.behaviour !== undefined)
            await this.behaviour.onStart(app);
    };

};

export interface BehaviourClass {

    update(app: Application, dt: number): void;
    updateFixed(_: Application, dt: number): void;
    onStart(app: Application): void;

}