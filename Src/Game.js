import {Rect} from "./RectUtils.js";
import { ParticleSource } from "./Particals.js";
import { Mouse,Button } from "./MouseEngine.js";
import { Player,  } from "./Player.js";
import { Boss } from "./Boss.js";
import { GoldKey,DeathBrick,Powerup } from "./Squares.js";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d")
export let currentKey = new Map();
export let multiplyer = 1;
export let powerUpMultiplyer = 300;
export let RandomNumDeathBrick = 0; 
export let NumToMatchDeathBrick = 0;
let PowerupRandomNum = Math.floor(Math.random()*powerUpMultiplyer+1)
let NumToMatchPowerUp = Math.floor(Math.random()*powerUpMultiplyer+1)
export let mode = "menu";
let time = document.getElementById("time")
let elapsedTime = 0;
let LEVEL_Data = [];
let LEVELON = 0;
export let Shake = false;
export let roundedTime = Math.round(elapsedTime)
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
export const bufferLength = analyser.frequencyBinCount;
export const dataArray = new Uint8Array(bufferLength);
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

function MakePowerupsAndBricks() {
    console.log(RandomNumDeathBrick,NumToMatchDeathBrick)
    if (RandomNumDeathBrick === NumToMatchDeathBrick) {
        deathBricks.push(new DeathBrick());
        NumToMatchDeathBrick = Math.floor(Math.random() * multiplyer+1)
    } else {
        RandomNumDeathBrick = Math.floor(Math.random() * multiplyer+1);
    }
    if (PowerupRandomNum === NumToMatchPowerUp) {
        powerups.push(new Powerup());
        NumToMatchPowerUp = Math.floor(Math.random()*powerUpMultiplyer+1)
    } else {
        NumToMatchPowerUp = Math.floor(Math.random() * powerUpMultiplyer+1);

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
                    multiplyer = LEVEL_Data.levels[player.levelON].DeathBricksSpawnRate+1;    
                    console.log("Multi " + multiplyer);
                    player.levelON = buttonName.id.slice(5, 100)-1;
                    boss.speed = LEVEL_Data.levels[player.levelON].boss[0].speed;
                    boss.damage = LEVEL_Data.levels[player.levelON].boss[0].damage;
                    goldKey.TimeToShow = data.levels[player.levelON].TimeToWin;
                    player.GameWidth = data.levels[player.levelON].player[0].startingSize;
                    player.GameHeight = data.levels[player.levelON].player[0].startingSize;
                    document.getElementById("LevelSelector").style.visibility = "hidden";
                    player.mode = "startGame"
            })
        }
    }
  })
  .catch(error => {
    // Handle any errors that occur during the fetch
    console.error('Error:', error);
  });
}
export let deathBricks = []
let powerups = []
export let player = new Player();
let goldKey = new GoldKey();
let boss = new Boss();
let particalEngine = new ParticleSource();
let mouse = new Mouse();
let SpeedUpgradeButton = new Button();
let BackButton = new Button();
function GameInit() {
    RandomNumDeathBrick = Math.floor(Math.random() * multiplyer+1); 
    NumToMatchDeathBrick = Math.floor(Math.random()* multiplyer+1)
    PowerupRandomNum = Math.floor(Math.random()*powerUpMultiplyer+1);
    NumToMatchPowerUp = Math.floor(Math.random()*powerUpMultiplyer+1)
}
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
    if (player.mode === "menu") {
        document.getElementById("menu").style.visibility = "visible"
        document.getElementById("time").style.visibility = "hidden"
        FragsELEMENT.style.visibility = "visible"
        player.init();
        GameInit();

    }
    if (player.mode != "menu") {
        document.getElementById("menu").style.visibility = "hidden"
        FragsELEMENT.style.visibility = "hidden"

    }
    if (player.mode === "startGame") {
        elapsedTime = 0;
        deathBricks = [];
        powerups = [];
        shards = []
        player.LevelFrags = 0;
        player.reset();
        boss.reset();
        goldKey.visable = true;
        currentKey.clear();
        player.mode = "game";
    }
    if (player.mode === "game") {    
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
            deathBricks[i].draw(ctx);
        }
        for (let i = 0; i < powerups.length; i++) {
            powerups[i].update();
            powerups[i].draw(ctx);
        }

    }
    if (player.mode === "levelSelector") {
        document.getElementById("LevelSelector").style.visibility = "visible"
    }
    if (player.mode === "store") {
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
            player.mode = "menu"
        }
 
        document.getElementById("Store").style.visibility = "visible"
    }
    if (player.mode === "About") {
        BackButton.draw(ctx,"Back",canvas.width/2+650,10,100,70,"black",6);
        ctx.fillStyle = "black"  
        if (mouse.clickOn(BackButton) === true) {
            player.mode = "menu"
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
        player.mode = "levelSelector"
        document.getElementById("LevelSelector").style.visibility = "visible"
    })
    document.getElementById("About").addEventListener("click",function(){
        player.mode = "About"
    })
    document.getElementById("StoreButton").addEventListener("click",function(){
        player.mode = "store"
    })
    document.getElementById("Start").addEventListener("click",function(){
        player.mode = "levelSelector"
    })
    keyboardInit();
    loop()
}
init();