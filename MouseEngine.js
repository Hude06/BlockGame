import { Rect } from "./RectUtils.js"
export class Button {
    constructor() {
        this.scale = 2
        this.bounds = new Rect(canvas.width/2-this.scale*100,10,200,40)
    }
    draw(ctx,text,scale) {
        this.scale = scale;
        this.bounds.x = (canvas.width/2-this.scale*100)
        this.bounds.w = this.scale * 200;
        this.bounds.h = this.scale * 50;
        ctx.fillStyle = "white"
        ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
        ctx.fillStyle = "black"
        ctx.font = text.length*this.scale + "px serif";
        ctx.fillText(text, this.bounds.x+text.length*this.scale*4.3, this.bounds.y+text.length*this.scale*2);
    }
}
export class Mouse {
    constructor() {
        this.bounds = new Rect(10,10,10,10)
        this.clicked = false;
    }
    draw() {
        // ctx.fillStyle = "white"
        // ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
        console.log(this.clicked)
    }
    clickOn(button) {
        if (button.bounds.intersects(this.bounds) || this.bounds.intersects(button.bounds)) {
            if (this.clicked === true) {
                return true
            }
        }

    }
}