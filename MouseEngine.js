import { Rect } from "./RectUtils.js"
export class Button {
    constructor() {
        this.bounds = new Rect(canvas.width/2-this.scale*100,10,200,40)
    }
    draw(ctx,text,x,y,w,h,color) {
        this.bounds.x = x;
        this.bounds.y = y;
        this.bounds.w = w;
        this.bounds.h = h;
        ctx.fillStyle = "white";
        ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);
        
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        
        // Adjust font size to fit within the button
        let fontSize = 30; // Initial font size
        ctx.font = fontSize + "px sans-serif";
        let textWidth = ctx.measureText(text).width;
        
        while (textWidth > this.bounds.w) {
          fontSize--; // Decrease font size
          ctx.font = fontSize + "px sans-serif";
          textWidth = ctx.measureText(text).width;
        }
        
        // Center the text vertically and horizontally
        const textX = this.bounds.x + this.bounds.w / 2;
        const textY = this.bounds.y + this.bounds.h / 2 + fontSize / 5;
        
        ctx.fillText(text, textX, textY);
        
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
    }
    clickOn(button) {
        if (button.bounds.intersects(this.bounds) || this.bounds.intersects(button.bounds)) {
            if (this.clicked === true) {
                return true
            }
        }

    }
}