export class Vec2 {

    public x: number;
    public y: number;

    static zero = new Vec2(0, 0);
    static one = new Vec2(1, 1);
    static up = new Vec2(0, 1);
    static down = new Vec2(0, -1);
    static right = new Vec2(1, 0);
    static left = new Vec2(-1, 0);

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static addVectors(a: Vec2, b: Vec2) {
        return new Vec2(a.x + b.x, a.y + b.y);
    }

    static subVectors(a: Vec2, b:Vec2) {
        return new Vec2(a.x - b.x, a.y - b.y);
    };

    static mulVector(a: Vec2, f: number) {
        return new Vec2(a.x * f, a.y * f);
    }

    static divVector(a: Vec2, f: number) {
        return new Vec2(a.x / f, a.y / f);
    }

    static dot(a: Vec2, b: Vec2) {
        return a.x * b.x + a.y * b.y;
    }

    static distance(a: Vec2, b: Vec2) {
        Vec2.subVectors(b, a).magnitude;
    };

    static angle(a: Vec2, b: Vec2) {
        return Math.acos(Vec2.dot(a, b)/(a.magnitude*b.magnitude)); 
    }

    static moveTowards(a: Vec2, b: Vec2, d: number) {
        const x = Math.min(b.x - a.x, d);
        const y = Math.min(b.y - a.y, d);
        return a.add(new Vec2(x, y));
    }

    static lerp(a: Vec2, b: Vec2, t: number) {
        return a.add(b.sub(a).mul(t));
    };

    static refleft(a: Vec2, b: Vec2) {
        // To be implemented
    }

    public add(b: Vec2) {
        return Vec2.addVectors(this, b);
    }

    public sub(b: Vec2) {
        return Vec2.subVectors(this, b);
    }

    public mul(f: number) {
        return Vec2.mulVector(this, f);
    }

    public div(f: number) {
        return Vec2.divVector(this, f);
    }

    public dot(b: Vec2) {
        return Vec2.dot(this, b);
    }

    public inverse() {
        return new Vec2(-this.x, -this.y);
    }

    get magnitude() {
        return Math.sqrt(this.x**2 + this.y**2);
    }

    get sqrMagnitude() {
        return this.x**2 + this.y**2;
    }

}