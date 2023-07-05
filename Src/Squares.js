import { Rect } from "./RectUtils.js";
import { roundedTime, bufferLength, dataArray } from "./Game.js";
import { player } from "./Game.js";
export class GoldKey {
    constructor(ctx) {
        this.bounds = new Rect(200, 200,25,25);
        this.visable = true;
        this.TimeToShow = 15
    }
    draw(ctx) {
        if (roundedTime >= this.TimeToShow) {
            if (this.visable === true) {
                ctx.strokeStyle = "gold"
                ctx.lineWidth = 7
                ctx.fillStyle = "black"
                ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
                ctx.strokeRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
            }
        }
    }
    update() {
        if (roundedTime >= this.TimeToShow) {
            if (this.visable === true) {
                if (player.bounds.intersects(this.bounds) || this.bounds.intersects(player.bounds)) {
                    this.visable = false;
                    player.Frags += player.LevelFrags
                    if (player.LEVELON >= LEVELS_Unlocked) {
                        LEVELS_Unlocked += 1
                    }
                    LEVEL_Data.levels[LEVELS_Unlocked].Unlocked = true
                    JSON();
                    mode = "menu"

                }
            }
        }
    }
}
export class Powerup {
    constructor() {
        this.bounds = new Rect(Math.floor(Math.random() * canvas.width-100)+100, Math.floor(Math.random() * canvas.height-100)+100,25,25);
        this.visable = true;
        this.coin = new Audio();
        this.coin.src = "./Assets/Coin.wav"
    }
    draw(ctx) {
            if (this.visable === true) {
                ctx.fillStyle = "green"
                ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
            }
    }
    update() {
        if (this.visable === true) {
            if (player.bounds.intersects(this.bounds) || this.bounds.intersects(player.bounds)) {
                player.bounds.w /= 1.5
                player.bounds.h /= 1.5
                player.tempSpeed *= 1.2
                this.coin.play();
                this.visable = false;
            }
        }
    }
}
export class DeathBrick {
    constructor() {
        this.random = Math.floor(Math.random() * 25)+5
        this.roundedY = 0;
        this.bounds = new Rect(Math.floor(Math.random() * canvas.width-100)+100,Math.floor(Math.random() * canvas.height-100)+100,15,15);
    }
    draw(ctx) {
        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * (100);
            this.roundedY = Math.floor(Math.round(y)/10)
            ctx.fillStyle = "#316a96"
            ctx.fillRect(this.bounds.x-(this.roundedY/2),this.bounds.y-(this.roundedY/2),this.bounds.w+this.roundedY,this.bounds.h+this.roundedY)
        }
    }
    update() {
    }
}