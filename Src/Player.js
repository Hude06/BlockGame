import {currentKey, deathBricks, mode} from "./Game.js";
import { Rect } from "./RectUtils.js";
export class Player {
    constructor() {
        this.levelON = 0;
        this.mode = "menu"
        this.bounds = new Rect(200,300,18,18);
        this.speed = 2;
        this.size = 50;
        this.helth = 100
        this.alive = true;
        this.Frags = 0;
        this.LevelFrags = 0;
        this.invicable = false;
        this.dash = true;
        this.tempSpeed = 2;
        this.die = new Audio();
        this.GameWidth = 18;
        this.GameHeight = 18;
        this.die.src = "./Assets/explosion.wav"
    }
    draw(ctx) {
        ctx.fillStyle = "#5a473e"
        ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
        ctx.fillStyle = "green"
        ctx.fillRect(20,10+5,this.helth*2,40)
        ctx.strokeStyle = "black"
        ctx.lineWidth = 5
        ctx.strokeRect(20,15,200,40)
    }
    init() {
        this.bounds.w = this.GameWidth;
        this.bounds.h = this.GameHeight;
        this.tempSpeed = this.speed;
    } 
    update() {
        this.bounds.w += 0.02;
        this.bounds.h += 0.02;

        if (currentKey.get("w") ) {
            this.bounds.y -= this.tempSpeed;
        }
        if (currentKey.get("s")) {
            this.bounds.y += this.tempSpeed;
        }
        if (currentKey.get("a")) {
            this.bounds.x -= this.tempSpeed;
        }
        if (currentKey.get("d")) {
            this.bounds.x += this.tempSpeed;
        }
        for (let i = 0; i < deathBricks.length; i++) {
            if (deathBricks[i].bounds.intersects(this.bounds) || this.bounds.intersects(deathBricks[i].bounds)) {
                    this.die.play();
                    this.alive = false;
                    currentKey.clear();
            }
        }
        if (this.alive === false) {
            alert("You Died!")
            this.mode = "menu";
        }
        if ( this.bounds.y < 0 ) {
            this.bounds.y = 0.5;
        }
        if ( this.bounds.x < 0 ) {
            this.bounds.x = 0.5;
        }
        if ( this.bounds.y > canvas.height-20 ) {
            this.bounds.y = canvas.height-20;
        }
        if ( this.bounds.x > canvas.width-this.bounds.w) {
            this.bounds.x = canvas.width-this.bounds.w;
        }
    }
    reset() {
        this.bounds.x = 200;
        this.bounds.y = 300;
        this.bounds.w = this.GameWidth;
        this.bounds.h = this.GameHeight;
        this.tempSpeed = this.speed;
        this.size = 18;
        this.helth = 100;
        this.alive = true;
    }
}