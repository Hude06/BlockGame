import {Rect} from "./RectUtils.js"
import { ParticleSource } from "./Particals.js";
import { Mouse,Button } from "./MouseEngine.js";
let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")
let currentKey = new Map();
let multiplyer = 10
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
let CoinFlip;
let LEVELS_Unlocked = 0;
let shards = []
let FragsELEMENT = document.getElementById("frags")
const audioCtx = new AudioContext();
const analyser = audioCtx.createAnalyser();
const destination = audioCtx.destination;
const music = new Audio();
music.src = "./Assets/Music.mp3";
const source = audioCtx.createMediaElementSource(music);
source.connect(analyser);
analyser.connect(destination);
const distortion = audioCtx.createWaveShaper();
distortion.connect(audioCtx.destination);
analyser.fftSize = 512/8;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
analyser.getByteTimeDomainData(dataArray);
music.addEventListener("canplay", () => {
    music.volume = 0.7
    music.play();
});
music.addEventListener("ended", function() {
    // Restart the playback from the beginning
    music.volume = 0.7
    music.currentTime = 0;
    music.play();
  });
function updateMousePosition(event) {
    // Update the mouse position variables
    let rect = event.target.getBoundingClientRect()
    let x = event.clientX
    let y = event.clientY
    x = x - rect.x
    y = y - rect.y
    x = x*(canvas.width/rect.width)
    y = y*(canvas.height/rect.height)
    mouse.bounds.x = x -5
    mouse.bounds.y = y -5
}
function handleMouseDown(event) {
    if (event.button === 0) {
        mouse.clicked = true;
    }
}
function handleMouseUp(event) {
    if (event.button === 0) {
        mouse.clicked = false;
    }
}
class Shard {
    constructor() {
        this.bounds = new Rect(Math.floor(Math.random() * canvas.width-100)+100, Math.floor(Math.random() * canvas.height-100)+100,25,25);
        this.visable = false;
        this.image = new Image();
        this.image.src = "./Shards.png"
        this.visable = true
    }
    draw() {
        if (this.visable === true) {
            ctx.imageSmoothingEnabled = false;
            ctx.fillStyle = "#ffb700"
            ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w,this.bounds.h)
        }
    }
    update() {
        if (this.visable === true) {
            if (this.bounds.intersects(player.bounds) || player.bounds.intersects(this.bounds)) {
                player.LevelFrags += 1;
                this.visable = false;
            }
        }
    }
}
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
        this.bounds = new Rect(200,300,50,50);
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
        this.die.src = "./Assets/explosion.wav"
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
    init() {
        this.tempSpeed = this.speed;
    } 
    update() {
        this.bounds.w += 0.02
        this.bounds.h += 0.02

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
        this.bounds.w = 18;
        this.bounds.h = 18;
        this.tempSpeed = this.speed;
        this.size = 18;
        this.helth = 100;
        this.alive = true;
    }
}
class GoldKey {
    constructor() {
        this.bounds = new Rect(200, 200,25,25);
        this.visable = true;
        this.TimeToShow = 15
    }
    draw() {
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
                    LEVELS_Unlocked += 1
                    LEVEL_Data.levels[LEVELS_Unlocked].Unlocked = true
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
        this.coin = new Audio();
        this.coin.src = "./Assets/Coin.wav"
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
                player.tempSpeed *= 1.2
                this.coin.play();
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
        this.roundedY = 0;
        this.bounds = new Rect(Math.floor(Math.random() * canvas.width-100)+100,Math.floor(Math.random() * canvas.height-100)+100,15,15);
    }
    draw() {
        ctx.fillStyle = "#316a96"
        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = v * (100);
            this.roundedY = Math.floor(Math.round(y)/30)
            ctx.fillRect(this.bounds.x,this.bounds.y,this.bounds.w+this.roundedY,this.bounds.h+this.roundedY)
        }
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
        CoinFlip = Math.floor(Math.random() * 3)+1
         if (CoinFlip === 2 || 3) {
            powerups.push(new Powerup());
            NumToMatchPowerUp = Math.floor(Math.random()*powerUpMultiplyer)
         };      
         if (CoinFlip === 1) {
            shards.push(new Shard());
            NumToMatchPowerUp = Math.floor(Math.random()*powerUpMultiplyer)
         } 
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
                buttonName.id = data.levels[LEVELS_Unlocked].name
                buttonName.innerHTML = LEVELS_Unlocked+1
                document.getElementById('LevelSelector').appendChild(buttonName);
                document.getElementById(buttonName.id).style.top += i*data.levels.length*30 + "px";
                document.getElementById(buttonName.id).style.background = "red";
                document.getElementById(buttonName.id).style.marginTop += i*5 + "px";
                document.getElementById(buttonName.id).addEventListener("click",function(){              
                    LEVELON = buttonName.id.slice(5, 100)-1;
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
let mouse = new Mouse();
let SpeedUpgradeButton = new Button();
let BackButton = new Button();


function keyboardInit() {
    window.addEventListener("keydown", function (event) {
        currentKey.set(event.key, true);
    });
    window.addEventListener("keyup", function (event) {
        currentKey.set(event.key, false);
    });
}
function loop() {
    analyser.getByteTimeDomainData(dataArray);
    roundedTime = Math.round(elapsedTime)
    ctx.clearRect(0,0,canvas.width,canvas.height)
    FragsELEMENT.innerHTML = ""+Math.round(player.Frags);
    if (mode === "menu") {
        document.getElementById("menu").style.visibility = "visible"
        document.getElementById("time").style.visibility = "hidden"
        FragsELEMENT.style.visibility = "visible"
        player.init();

    }
    if (mode != "menu") {
        document.getElementById("menu").style.visibility = "hidden"
        FragsELEMENT.style.visibility = "hidden"

    }
    if (mode === "startGame") {
        elapsedTime = 0;
        deathBricks = [];
        powerups = [];
        shards = []
        player.LevelFrags = 0;
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
        for (let i = 0; i < shards.length; i++) {
            shards[i].draw();
            shards[i].update();
        }
        player.draw(ctx);
        boss.draw(ctx);
        mouse.draw();
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
    if (mode === "store") {
        ctx.fillStyle = "gray"
        ctx.fillRect(0,0,canvas.width,canvas.height)
        SpeedUpgradeButton.draw(ctx,"Speed +1 , -1$",450,10,700,70,"black",4);        
        if (mouse.clickOn(SpeedUpgradeButton) === true) {
            if (player.Frags > 0) {
                player.speed += 0.2;
                player.Frags = player.Frags -= 0.1;
            } else {
                alert("You need at least One Frag")
            }
        }
        BackButton.draw(ctx,"Back",canvas.width/2+650,10,100,70,"black",6);
        ctx.fillStyle = "black"  
        if (mouse.clickOn(BackButton) === true) {
            mode = "menu"
        }
 
        document.getElementById("Store").style.visibility = "visible"
    }
    if (mode === "About") {
        BackButton.draw(ctx,"Back",canvas.width/2+650,10,100,70,"black",6);
        ctx.fillStyle = "black"  
        if (mouse.clickOn(BackButton) === true) {
            mode = "menu"
        }
        ctx.font = "100px Impact";
        ctx.fillText("How to Play",canvas.width/2,100)  
        ctx.font = "70px Impact";

        ctx.fillText("Controlls",canvas.width/2,200)  

        ctx.font = "35px 'Lato'";
        ctx.fillText("W A S D, Or Arrow Keys to Move",canvas.width/2,250)  

        ctx.fillText("You control a square character in a world where enemy squares are falling from the sky.",canvas.width/2,300)  
        ctx.fillText("Your Goal is to stay alive until you see a gold checkpoin, You goal is to stay alive and comlete the level",canvas.width/2,350)  

    }
    requestAnimationFrame(loop)
}
function init() {
    JSON();
    canvas.addEventListener("mousedown", function(event) {
        handleMouseDown(event);
    });
    canvas.addEventListener("mouseup", function(event) {
        handleMouseUp(event);
    });
    canvas.addEventListener("mousemove", function(event) {
        updateMousePosition(event);
    });
    document.getElementById("LevelSelectorButton").addEventListener("click",function(){
        mode = "levelSelector"
        document.getElementById("LevelSelector").style.visibility = "visible"
    })
    document.getElementById("About").addEventListener("click",function(){
        mode = "About"
    })
    document.getElementById("StoreButton").addEventListener("click",function(){
        mode = "store"
    })
    document.getElementById("Start").addEventListener("click",function(){
        mode = "levelSelector"
    })
    keyboardInit();
    loop()
}
init();