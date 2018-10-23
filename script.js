/*initialize variables*/
var c = document.querySelector("canvas");
var wrapper = document.querySelector(".wrapper");
    c.height = wrapper.offsetHeight-5;
    c.width = wrapper.offsetWidth-5;
var ctx = c.getContext("2d");

//canvas text


var alienProjectileCombArr = [[],[]];
var playerPos = 400;
const projectileInitialPosY = 495;
var lastPress = 0;
var pressedKey = {
    left:false,
    right:false,
    spacebar: false
}

let Objects = {
    /* draw the player */
    player: function() {
        if (pressedKey.right == true) {
            playerPos+=8
        } else if (pressedKey.left == true) {
            playerPos-=8
        }
        ctx.fillStyle = "#003399";
        ctx.beginPath();
        ctx.arc(playerPos,500,10,0,2*Math.PI);
        ctx.fill();
    },
    /* draw the projectiles */
    Projectile: function(x, y) {
        this.x = x;
        this.y = y;
        this.drawProjectile = function() {
            ctx.fillStyle = "#ff0000";
            ctx.fillRect(this.x, this.y, 2, 6);
        }
        this.updateProjectile = function() {
            this.y -= 6;
            this.drawProjectile();
        }
    },
    /* add the projectiles to the array on spacebar key down */
    shootProjectiles: function() {
        if (pressedKey.spacebar == true) {
            var now = Date.now();
            if (now - lastPress < 300) {
                return;
            } else {
                let x = playerPos;
                let y = projectileInitialPosY;
                alienProjectileCombArr[1].push(new Objects.Projectile(x, y))
            }
            lastPress = now;
        } else {
            return false;
        }
    },
    /* draw the aliens */
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
    Asd: function(x) {
        this.x = x;
        this.logFunc = function() {
            console.log(this.x)
        }

    }
}

//add aliens to the array and draw aliens in rows
//row 1
for (let i = 20; i < c.offsetWidth; i += 50) {
    alienProjectileCombArr[0].push(new Objects.Alien(i, -40, 0.1, "#000"));
}
for (let i = 45; i < c.offsetWidth; i += 50) {
    alienProjectileCombArr[0].push(new Objects.Alien(i, -15, 0.1, "#000"));
}
//row 2
for (let i = 20; i < c.offsetWidth; i += 50) {
    alienProjectileCombArr[0].push(new Objects.Alien(i, 10, 0.1, "#000"));
}
//row 3
for (let i = 45; i < c.offsetWidth; i += 50) {
    alienProjectileCombArr[0].push(new Objects.Alien(i, 35, 0.1, "#000"));
}



/* keypress events */
document.onkeydown = function(e) {    
    switch (e.keyCode) {
        case 37: //left arrow
            pressedKey.left = true;
            pressedKey.right = false;
            break;
        case 39: //right arrow
            pressedKey.right = true;
            pressedKey.left = false;
            break;
    }
};

document.onkeypress = function(e) {    
    switch (e.keyCode) {
        case 32: //spacebar
            pressedKey.spacebar = true;
            break;
    }
};

document.onkeyup = function(e) {
    pressedKey.left = false;
    pressedKey.right = false;
    if(e.keyCode == 32) {
        pressedKey.spacebar = false;
    }
};




/* animation */
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    Objects.player();  
    Objects.shootProjectiles(); 
    for (let i = 0; i<alienProjectileCombArr[1].length; i++) {
        alienProjectileCombArr[1][i].updateProjectile();
    }
    for (let i = 0; i<alienProjectileCombArr[0].length; i++) {
        alienProjectileCombArr[0][i].updateAlien();

    }
    //remove projectile from array if it goes off screen
    for (let i=0; i<alienProjectileCombArr[1].length; i++) {
        if (alienProjectileCombArr[1][i].y < 0) {
            alienProjectileCombArr[1].splice(i, 1);
        }
    }

    // i = projectile, j = alien
    for (let i = 0; i < alienProjectileCombArr[1].length;i++) {
        if(alienProjectileCombArr[1][i] != undefined) {
            for (let j = 0; j<alienProjectileCombArr[0].length;j++) {


                if(Math.floor(alienProjectileCombArr[0][j].y) >= Math.floor(alienProjectileCombArr[1][i].y - 30)) {
                    if(Math.floor(alienProjectileCombArr[0][j].x) <= Math.floor(alienProjectileCombArr[1][i].x + 10) && Math.floor(alienProjectileCombArr[0][j].x) >= Math.floor(alienProjectileCombArr[1][i].x - 10) ) {
                        alienProjectileCombArr[0].splice(j, 1);
                    }  
                }  


            }
        }
    }
    ctx.font = "14px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText("Space: shoot",10,500);
    ctx.fillText("Arrow left and arrow right: move",10,520);

}animate();

