//https://qiita.com/Nekonecode/items/523a9e7214082129935e
class Vector2
{
    constructor(_x = 0, _y = 0)
    {
        this.x = _x;
        this.y = _y;
    }
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    clone() {
        return new Vector2(this.x, this.y);
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    times(num) {
        this.x *= num;
        this.y *= num;
        return this;
    }

    get inverse() {
        return this.clone().times(-1);
    }
    get magnitude() {
        const { x, y } = this;
        return Math.sqrt(x**2 + y**2);
    }
    get normalized() {
        const { x, y, magnitude } = this;
        return new Vector2(x/magnitude, y/magnitude);
    }
    static add(v1, v2) {
        return v1.clone().add(v2);
    }
    static sub(v1, v2) {
        return v1.clone().sub(v2);
    }
      static times(v1, num) {
        return v1.clone().times(num);
    }
    static dot(v1, v2) {
        return (v1.x * v2.x + v1.y * v2.y);
    }
}

//hoge
//fuga