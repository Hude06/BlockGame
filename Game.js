import {Rect} from "./RectUtils.js"
import { ParticleSource } from "./Particals.js";
let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")
let currentKey = new Map();
let multiplyer = 6
let powerUpMultiplyer = 300;
let RandomNumDeathBrick = Math.floor(Math.random() * multiplyer); 
let NumToMatchDeathBrick = Math.floor(Math.random()* multiplyer)
let PowerupRandomNum = Math.floor(Math.random()*powerUpMultiplyer)
let NumToMatchPowerUp = Math.floor(Math.random()*powerUpMultiplyer)
let mode = "menu";
let time = document.getElementById("time")
let elapsedTime = 0;
let LEVEL_Data = [];
let LEVELON = 0;
let Shake = false;
let roundedTime = Math.round(elapsedTime)
class Boss {
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
    draw() {
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
        this.bounds.x = 1000
        this.bounds.y = 200
        this.intersected = false
        this.direction = 1
    }
}
class Player {
    constructor() {
        this.bounds = new Rect(200,300,15,15);
        this.speed = 2;
        this.size = 25;
        this.helth = 100
        this.alive = true;
        this.Frags = 0;
        this.invicable = false;
        this.dash = true;
    }
    draw() {
        ctx.fillStyle = "#5a473e"
        ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
        ctx.fillStyle = "green"
        ctx.fillRect(20,10+5,this.helth*2,40)
        ctx.strokeStyle = "black"
        ctx.lineWidth = 5
        ctx.strokeRect(20,15,200,40)
    }
    update() {
        this.bounds.w += 0.02
        this.bounds.h += 0.02
        if (currentKey.get("w") ) {
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
        if (this.dash === true) {
            if (currentKey.get("Shift")) {
                this.speed = 8
                this.invicable = true
                this.dash = false
                setTimeout(() => {
                    this.speed = 2
                    this.invicable = false
                }, 125);
                setTimeout(() => {
                    this.dash = true
                }, 1500);
            }
        }
        console.log(this.dash)

        if (this.invicable === false) {
            for (let i = 0; i < deathBricks.length; i++) {
                if (deathBricks[i].bounds.intersects(this.bounds) || this.bounds.intersects(deathBricks[i].bounds)) {
                    setTimeout(() => {
                        this.alive = false;
                        currentKey.clear();
                    }, 50);
                }
            }
        }
        if (this.alive === false) {
            alert("You Died!")
            mode = "menu";
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
        this.bounds.w = 15
        this.bounds.h = 15
        this.speed = 2;
        this.size = 25;
        this.helth = 100;
        this.alive = true;
    }
}
let LEVELS_Unlocked = 0;
class GoldKey {
    constructor() {
        this.bounds = new Rect(200, 200,25,25);
        this.visable = true;
        this.TimeToShow = 15
    }

    draw() {
        if (roundedTime >= this.TimeToShow) {
            if (this.visable === true) {
                ctx.fillStyle = "#f6ad0f"
                ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
            }
        }
    }
    update() {
        if (roundedTime >= this.TimeToShow) {
            if (this.visable === true) {
                if (player.bounds.intersects(this.bounds) || this.bounds.intersects(player.bounds)) {
                    this.visable = false;
                    LEVELS_Unlocked += 1
                    if (LEVELON === 1) {
                        LEVEL_Data.levels[LEVELS_Unlocked].Unlocked = true
                    }
                    JSON();
                    mode = "menu"

                }
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
                player.bounds.w /= 1.5
                player.bounds.h /= 1.5
                player.speed *= 1.2
                Shake = true
                setTimeout(() => {
                    Shake = false;
                }, 200);
                  
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
        ctx.fillStyle = "#316a96"
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
function JSON() {
    fetch('levels.json')
  .then(response => response.json())
  .then(data => {
    LEVEL_Data = data;
    for (let i = 0; i < data.levels.length; i++) {
            const buttonName = document.createElement('button')
            if (data.levels[i].Unlocked) {
                console.log(data.levels[i].Unlocked)
                buttonName.id = data.levels[LEVELS_Unlocked].name
                buttonName.innerHTML = LEVELS_Unlocked+1
                console.log(buttonName.id)
                document.getElementById('LevelSelector').appendChild(buttonName);
                document.getElementById(buttonName.id).style.top += i*data.levels.length*30 + "px";
                document.getElementById(buttonName.id).style.background = "red";
                document.getElementById(buttonName.id).style.marginTop += i*5 + "px";
                document.getElementById(buttonName.id).addEventListener("click",function(){              LEVELON = buttonName.id.slice(5, 100)-1;
                    boss.speed = LEVEL_Data.levels[LEVELON].boss[0].speed;
                    boss.damage = LEVEL_Data.levels[LEVELON].boss[0].damage;
                    goldKey.TimeToShow = data.levels[LEVELON].TimeToWin;
                    player.bounds.w = data.levels[LEVELON].player[0].startingSize;
                    player.bounds.h = data.levels[LEVELON].player[0].startingSize;
                    document.getElementById("LevelSelector").style.visibility = "hidden";
                    mode = "startGame"
            })
        }
    }
  })
  .catch(error => {
    // Handle any errors that occur during the fetch
    console.error('Error:', error);
  });
}
let deathBricks = []
let powerups = []
let player = new Player();
let goldKey = new GoldKey();
let boss = new Boss();
let particalEngine = new ParticleSource();
function keyboardInit() {
    window.addEventListener("keydown", function (event) {
        currentKey.set(event.key, true);
    });
    window.addEventListener("keyup", function (event) {
        currentKey.set(event.key, false);
    });
}
function loop() {
    roundedTime = Math.round(elapsedTime)
    ctx.clearRect(0,0,canvas.width,canvas.height)
    if (mode === "menu") {
        document.getElementById("menu").style.visibility = "visible"
        document.getElementById("time").style.visibility = "hidden"
    }
    if (mode != "menu") {
        document.getElementById("menu").style.visibility = "hidden"
    }
    if (mode === "startGame") {
        elapsedTime = 0;
        deathBricks = [];
        powerups = [];
        player.reset();
        boss.reset();
        goldKey.visable = true;
        currentKey.clear();
        mode = "game";
    }
    if (mode === "game") {       
        ctx.save(); 
        document.getElementById("time").style.visibility = "visible"
        elapsedTime += 0.0166
        time.innerHTML = Math.round(elapsedTime)
        //DRAW
        if (Shake) {
            var dx = Math.random()*30;
            var dy = Math.random()*30;
            ctx.translate(dx, dy);
        }
        particalEngine.draw_particles(ctx,238, 134, 149)
        goldKey.draw(ctx);
        goldKey.update();
        player.draw(ctx);
        boss.draw(ctx);
        ctx.restore();
        //UPDATE
        particalEngine.update_particles();
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

    }
    if (mode === "levelSelector") {
        document.getElementById("LevelSelector").style.visibility = "visible"
    }
    requestAnimationFrame(loop)
}
function init() {
    JSON();
    document.getElementById("LevelSelectorButton").addEventListener("click",function(){
        mode = "levelSelector"
        document.getElementById("LevelSelector").style.visibility = "visible"
    })
    document.getElementById("Start").addEventListener("click",function(){
        mode = "levelSelector"
    })
    keyboardInit();
    loop()
}
init();