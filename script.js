// initialize variables
var c = document.querySelector("canvas");
var wrapper = document.querySelector(".wrapper");
    c.height = wrapper.offsetHeight-5;
    c.width = wrapper.offsetWidth;
var ctx = c.getContext("2d");

var alienProjectileCombArr = [[],[],[]];
var playerPos = 400;
const projectileInitialPosY = 495;
var lastPress = 0;
let lastShot = 0;
let score = 0;
var pressedKey = {
    left:false,
    right:false,
    spacebar: false
}
let gotHit;

let Objects = {
    // draw the player 
    player: function() {
        if (pressedKey.right == true) {
            if(playerPos >= c.width-15) {
                playerPos+=0
            } else {
                playerPos+=5
            }
        } else if (pressedKey.left == true) {
            if(playerPos <= 15) {
                playerPos-=0
            } else {
                playerPos-=5
            }
        } 
        ctx.fillStyle = "#003399";
        ctx.beginPath();
        ctx.arc(playerPos,500,10,0,2*Math.PI);
        ctx.fill();
    },
    // draw the projectiles 
    Projectile: function(x, y) {
        this.x = x;
        this.y = y;

        // player projectiles
        this.drawProjectile = function() {
            ctx.fillStyle = "#ff0000";
            ctx.fillRect(this.x, this.y, 2, 6);
        }
        this.updateProjectile = function() {
            this.y -= 6;
            this.drawProjectile();
        }

        // alien projectiles
        this.drawProjectileAlien = function() {
            ctx.fillStyle = "#009900";
            ctx.fillRect(this.x, this.y, 2, 6);
        }
        this.updateProjectileAlien = function() {
            this.y += 6;
            this.drawProjectileAlien();
        }
    },
    // make player shoot, add the projectiles to the array on spacebar key down 
    shootProjectiles: function() {
        if (pressedKey.spacebar == true) {
            let now = Date.now();
            if (now - lastPress < 300) {
                return;
            } else {
                let x = playerPos;
                let y = projectileInitialPosY;
                alienProjectileCombArr[1].push(new Objects.Projectile(x, y));
            }
            lastPress = now;
        } else {
            return;
        }
    },
    // make aliens shoot
    aliensShoot: function() {
        let now = Date.now();
        if (now - lastShot < 1000) {
            return;
        } else {
            for (let i = 0; i<alienProjectileCombArr[0].length;i++) {
                if(alienProjectileCombArr[0][i] != undefined) {
                    let alien = alienProjectileCombArr[0];
                    let ranAlien = alien[Math.floor((Math.random() * alien.length) + 0)];
                    let x = ranAlien.x;
                    let y = ranAlien.y;
                    alienProjectileCombArr[2].push(new Objects.Projectile(x, y));
                    break;
                } 
            }
        }
        lastShot = now;
    },
    // draw the aliens
    Alien: function(x, y, dy, color) {
        this.x = x;
        this.y = y;
        this.dy = dy;
        this.color = color;
    
        this.drawAlien = function() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x,this.y,10,0,2*Math.PI);
            ctx.fill();
        }
        this.updateAlien = function() {
            this.y += this.dy;
            this.drawAlien();
        }
    },
    // keep score
    score: function() {
        ctx.font = "14px Arial";
        ctx.fillStyle = "#000";
        ctx.fillText("Score: " + score,820,590);
    }


}

// add aliens to the array and draw aliens in rows

// row 1
for (let i = 20; i < c.offsetWidth-5; i += 50) {
    alienProjectileCombArr[0].push(new Objects.Alien(i, -40, 0.1, "#000"));
}
// row 2
for (let i = 45; i < c.offsetWidth-5; i += 50) {
    alienProjectileCombArr[0].push(new Objects.Alien(i, -15, 0.1, "#000"));
}
// row 3
for (let i = 20; i < c.offsetWidth-5; i += 50) {
    alienProjectileCombArr[0].push(new Objects.Alien(i, 10, 0.1, "#000"));
}
// row 4
for (let i = 45; i < c.offsetWidth-5; i += 50) {
    alienProjectileCombArr[0].push(new Objects.Alien(i, 35, 0.1, "#000"));
}

// keypress events 
document.onkeydown = function(e) {    
    switch (e.keyCode) {
        case 37: // left arrow
            pressedKey.left = true;
            pressedKey.right = false;
            break;
        case 39: // right arrow
            pressedKey.right = true;
            pressedKey.left = false;
            break;
    }
};

document.onkeypress = function(e) {    
    switch (e.keyCode) {
        case 32: // spacebar
            pressedKey.spacebar = true;
            break;
    }
};

document.onkeyup = function(e) {
    switch (e.keyCode) {
        case 32: // spacebar
            pressedKey.spacebar = false;
            break;
        case 37: // left arrow
            pressedKey.left = false;
            break;
        case 39: // right arrow
            pressedKey.right = false;
            break;
    }
};

for (let i = 0; i< document.querySelectorAll(".yes").length; i++) {
    document.querySelectorAll(".yes")[i].onclick = function() {
        location.reload();
    }
}


// animations 
function animate() {
    if(gotHit) {
        document.querySelector(".alertLost").style.display = "block";
        return;
    } 
    if (alienProjectileCombArr[0].length === 0) {
        document.querySelector(".alertWin").style.display = "block";
        return;
    }
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    // animate player, create projectile objects and keep score
    Objects.player();  
    Objects.shootProjectiles(); 
    Objects.score();
    Objects.aliensShoot();

    // animate projectiles
    for (let i = 0; i<alienProjectileCombArr[1].length; i++) {
        alienProjectileCombArr[1][i].updateProjectile();
    }
    // animate aliens
    for (let i = 0; i<alienProjectileCombArr[0].length; i++) {
        alienProjectileCombArr[0][i].updateAlien();
    }
    // remove projectile from array if they go off screen
    for (let i=0; i<alienProjectileCombArr[1].length; i++) {
        if (alienProjectileCombArr[1][i].y < 0) {
            alienProjectileCombArr[1].splice(i, 1);
        }
    }

    //alien projectile animations
    for (let i=0; i<alienProjectileCombArr[2].length; i++) {
        alienProjectileCombArr[2][i].updateProjectileAlien();
        if (alienProjectileCombArr[2][i].y > c.height) {
            alienProjectileCombArr[2].splice(i, 1);
        }
    }

    // player's projectiles colliding with aliens
    // projectile and alien collision system. Remove alien and projectile upon impact
    // i = projectile, j = alien
    for (let i = 0; i < alienProjectileCombArr[1].length;i++) {
        if(alienProjectileCombArr[1][i] != undefined) {
            for (let j = 0; j<alienProjectileCombArr[0].length;j++) {
                let alienY = alienProjectileCombArr[0][j].y;
                let alienX = alienProjectileCombArr[0][j].x;
                let projectileY = alienProjectileCombArr[1][i].y;
                let projectileX = alienProjectileCombArr[1][i].x;
                if(Math.floor(alienY) >= Math.floor(projectileY - 10)) {
                    if(Math.floor(alienX) <= Math.floor(projectileX + 13) && Math.floor(alienX) >= Math.floor(projectileX - 13) ) {
                        alienProjectileCombArr[0].splice(j, 1);
                        alienProjectileCombArr[1].splice(i, 1);
                        score+=1;
                    }  
                }

            }
        }
    }

    // alien's projectiles colliding with the player
    for(let i = 0; i<alienProjectileCombArr[2].length; i++) {
        if(alienProjectileCombArr[2][i] != undefined) { 
            let projectileY = alienProjectileCombArr[2][i].y;
            let projectileX = alienProjectileCombArr[2][i].x;

            if(Math.floor(projectileInitialPosY) <= Math.floor(projectileY + 10) && Math.floor(projectileInitialPosY) >= Math.floor(projectileY - 10)) {
                if(Math.floor(playerPos) <= Math.floor(projectileX + 13) && Math.floor(playerPos) >= Math.floor(projectileX - 13) ) {
                    gotHit = true;
                }  
            }

        }
    }

    // draw text in the bottom of the screen
    ctx.font = "14px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("Space: shoot",10,570);
    ctx.fillText("Arrow left and arrow right: move",10,590);

    
}animate()

