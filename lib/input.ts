export class Input {

    public mouseX: number = 0;
    public mouseY: number = 0;
    public touch: { x: number, y: number, id: number }[] = [];

    constructor() {}

    private mouseHandler = (e: MouseEvent) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    };

    private touchHandler = (e: TouchEvent) => {
        
        this.touch = [];

        for (let i = 0; i < e.touches.length; i++) {
            const t = e.touches[i];

            this.touch.push({
                x: t.clientX,
                y: t.clientY,
                id: t.identifier
            });
        }

    };

    private touchEndHandler = () => {
        this.touch = [];
    };

    public init() {
        
        document.addEventListener("mousemove", this.mouseHandler);

        document.addEventListener("touchstart", this.touchHandler, { passive: true });
        document.addEventListener("touchmove", this.touchHandler, { passive: true });
        document.addEventListener("touchend", this.touchEndHandler);
        document.addEventListener("touchcancel", this.touchEndHandler);

    }
    
}