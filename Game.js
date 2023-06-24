import {Rect} from "./RectUtils.js"
let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")
let currentKey = new Map();
let multiplyer = 10
let powerUpMultiplyer = 300;
let RandomNumDeathBrick = Math.floor(Math.random() * multiplyer); 
let NumToMatchDeathBrick = Math.floor(Math.random()* multiplyer)
let PowerupRandomNum = Math.floor(Math.random()*powerUpMultiplyer)
let NumToMatchPowerUp = Math.floor(Math.random()*powerUpMultiplyer)
class Boss {
    constructor() {
        this.bounds = new Rect(1000,200,20,20);
        this.speed = 1;
        this.size = 25;
        this.intersected = false
        this.direction = 1
        //1 = up
        //2 = down
        //3 = left
        //4 = right
    }
    draw() {
        ctx.fillStyle = "red"
        ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
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
        console.log(this.intersected)
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
}
class Player {
    constructor() {
        this.bounds = new Rect(25,25,15,15);
        this.speed = 2;
        this.size = 25;
    }
    draw() {
        ctx.fillStyle = "black"
        ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
    }
    update() {
        this.bounds.w = this.size
        this.bounds.h = this.size
        this.size += 0.02
        this.speed += 0.001
        if (currentKey.get("w")) {
            this.bounds.y -= this.speed;
        }
        if (currentKey.get("s")) {
            this.bounds.y += this.speed;
        }
        if (currentKey.get("a")) {
            this.bounds.x -= this.speed;
        }
        if (currentKey.get("d")) {
            this.bounds.x += this.speed;
        }
        for (let i = 0; i < deathBricks.length; i++) {
            if (deathBricks[i].bounds.intersects(this.bounds) || this.bounds.intersects(deathBricks[i].bounds)) {
                alert("You Died!")
                location.reload();
            }
        }
    }
}
class Powerup {
    constructor() {
        this.bounds = new Rect(Math.floor(Math.random() * canvas.width-100)+100, Math.floor(Math.random() * canvas.height-100)+100,25,25);
        this.visable = true;
    }

    draw() {
            if (this.visable === true) {
                ctx.fillStyle = "green"
                ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
            }
    }
    update() {
        if (this.visable === true) {
            if (player.bounds.intersects(this.bounds) || this.bounds.intersects(player.bounds)) {
                player.size /= 1.5
                player.speed /= 1.5
                this.visable = false;
            }
            if (boss.bounds.intersects(this.bounds) || this.bounds.intersects(boss.bounds)) {
                boss.bounds.w /= 1.5
                boss.bounds.h /= 1.5
                boss.speed /= 1.5
                this.visable = false;
            }
        }
    }
}
class DeathBrick {
    constructor() {
        this.random = Math.floor(Math.random() * 25)+5
        this.bounds = new Rect(Math.floor(Math.random() * canvas.width-100)+100,Math.floor(Math.random() * canvas.height-100)+100,10,10);
    }
    draw() {
        ctx.fillStyle = "blue"
        ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
    }
    update() {
    }
}
function MakePowerupsAndBricks() {
    if (RandomNumDeathBrick === NumToMatchDeathBrick) {
        deathBricks.push(new DeathBrick());
        NumToMatchDeathBrick = Math.floor(Math.random() * multiplyer)
    } else {
        RandomNumDeathBrick = Math.floor(Math.random() * multiplyer);
    }
    if (PowerupRandomNum === NumToMatchPowerUp) {
        powerups.push(new Powerup());
        NumToMatchPowerUp = Math.floor(Math.random()*powerUpMultiplyer)
    } else {
        PowerupRandomNum = Math.floor(Math.random() * powerUpMultiplyer);
    }
}
let deathBricks = []
let powerups = []
let player = new Player();
let boss = new Boss();
function keyboardInit() {
    window.addEventListener("keydown", function (event) {
        currentKey.set(event.key, true);
    });
    window.addEventListener("keyup", function (event) {
        currentKey.set(event.key, false);
    });
}
let time = document.getElementById("time")
let elapsedTime = 0;
function loop() {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    elapsedTime += 0.0166
    time.innerHTML = Math.round(elapsedTime)
    player.draw();
    boss.draw();
    player.update();
    boss.update();

    MakePowerupsAndBricks();
    for (let i = 0; i < deathBricks.length; i++) {
        deathBricks[i].update();
        deathBricks[i].draw();
    }
    for (let i = 0; i < powerups.length; i++) {
        powerups[i].update();
        powerups[i].draw();
    }
    requestAnimationFrame(loop)
}
function init() {
    keyboardInit();
    loop()
}
init();