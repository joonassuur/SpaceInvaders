/*initialize variables*/
var c = document.querySelector("canvas");
var wrapper = document.querySelector(".wrapper");
    c.height = wrapper.offsetHeight-5;
    c.width = wrapper.offsetWidth-5;
var ctx = c.getContext("2d");

var alienArr = [];
var projectileArr = [];
var playerPos = 400;
const projectileInitialPos = 495;
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
                let y = projectileInitialPos;
                projectileArr.push(new Objects.Projectile(x, y))
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
    }

}

//add aliens to the array and draw aliens in rows
//row 1
for (let i = 20; i < c.offsetWidth; i += 50) {
    alienArr.push(new Objects.Alien(i, 10, 0.1, "#000"));
}
//row 2
for (let i = 45; i < c.offsetWidth; i += 50) {
    alienArr.push(new Objects.Alien(i, 35, 0.1, "#000"));
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
    for (let i = 0; i<projectileArr.length; i++) {
        projectileArr[i].updateProjectile();
    }
    for (let i = 0; i<alienArr.length; i++) {
        alienArr[i].updateAlien();
    }
}animate();

