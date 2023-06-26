const dead = document.getElementById("deathScreen");
const reason = document.getElementById("reason");
const teaser = document.getElementById("tease");
const canvas = document.getElementById("canvas");

let xRea;
let xTea;

function youDied(why){

    xRea = Math.floor(Math.random() * 5);
    xTea = Math.floor(Math.random() * 5);

    dead.style.visibility = visible;
    canvas.style.visibility = hidden;
    
    if ( xTea === 1 ) { teaser = "Haha Noob" }
    else if ( xTea === 2 ) { teaser = "Get Rekt" }
    else if ( xTea === 3 ) { teaser = "Loser" }
    else if ( xTea === 4 ) { teaser = "Get Good" }
    else if ( xTea === 5 ) { teaser = "Your Bad" }
    
    reason = "Reason: " + varReason;

}