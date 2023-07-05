import { Rect } from "./RectUtils.js";
import { deathBricks, player, mode } from "./Game.js";
export class Boss {
    constructor() {
        this.bounds = new Rect(1000,200,20,20);
        this.speed = 1;
        this.size = 15;
        this.intersected = false
        this.direction = 1
        this.damage = 2
        //1 = up
        //2 = down
        //3 = left
        //4 = right
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.bounds.x+this.bounds.w/2, this.bounds.y+this.bounds.h/2, this.size, 0, 2 * Math.PI, false);
        ctx.lineWidth = 3;
        ctx.fillStyle = ' #d3473d ';
        ctx.fill();
    }
    update() {
        for (let i = 0; i < deathBricks.length; i++) {
            if (this.bounds.intersects(deathBricks[i].bounds) || deathBricks[i].bounds.intersects(this.bounds)) {
                this.intersected = true;
            } else {
                setTimeout(() => {
                    this.intersected = false
                }, 100);
            }
        }
        if (this.bounds.intersects(player.bounds) || player.bounds.intersects(this.bounds)) {
            player.helth -= this.damage / 10 
            if (player.helth <= 0) {
                player.alive = false
            }
        }
        if (this.intersected === false) {
            if (this.bounds.x >= player.bounds.x) {
                this.bounds.x -= this.speed;
                this.direction = 3
            }
            if (this.bounds.x <= player.bounds.x) {
                this.bounds.x += this.speed;
                this.direction = 4
            }
            if (this.bounds.y >= player.bounds.y) {
                this.bounds.y -= this.speed;
                this.direction = 1
            }
            if (this.bounds.y <= player.bounds.y) {
                this.bounds.y += this.speed;
                this.direction = 2
            }
        } else {
            if (this.direction === 1){
                this.bounds.y += this.speed;
            }
            if (this.direction === 2){
                this.bounds.y -= this.speed;
            }
            if (this.direction === 3){
                this.bounds.x += this.speed;
            }
            if (this.direction === 4){
                this.bounds.x -= this.speed;
            }
        }
}
    reset() {
        this.bounds.x = 1000;
        this.bounds.y = 200;
        this.intersected = false;
        this.direction = 1;
    }
}