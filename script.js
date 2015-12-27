(function () {
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;
})();

//Music Loop

var music = new Audio('music.mp3')
music.loop = true
music.addEventListener('ended', function() {
	this.currentTime = 0;
	this.play();
}, false);
music.play();

//Initial Variables

var canvas = document.getElementById("canvas"),
ctx = canvas.getContext("2d"),
width = 500,
height = 500,
keys = [],
friction = 0.8,
gravity = 0.3;
canvas.width = width;
canvas.height = height;
var player;
var boxes = [];
var dimensions = [];
var counter;
var blinkCnt;
var musicOn = true;
var score;

function startGame() {
	boxes = [];
	player = {
		x: 120,
		y: 30,
		width: 16,
		height: 16,
		speed: 5,
		velX: 0,
		velY: 0,
		jumping: false,
		grounded: false
	};
	blinkCnt = 100;
	console.log("INIT");
    score = 0;
	counter = 50;
	// dimensions
	dimensions.push({
		x: 0,
		y: -100,
		width: 0,
		height: height + 100
	});
	
	dimensions.push({
		x: width,
		y: -100,
		width: 10,
		height: height + 100
	});

	//first block

	boxes.push({
		x: 120,
		y: 50,
		width: 80,
		height: 20
	});
	
	boxes.push({
		x: Math.random() * width,
		y: 0,
		width: 80,
		height: 20
	});
	
	boxes.push({
		x: Math.random() * width,
		y: 0,
		width: 80,
		height: 20
	});
	
	boxes.push({
		x: Math.random() * width,
		y: 0,
		width: 80,
		height: 20
	});
	
	gameState();
}

function menuState() {
	console.log("Menu!");





	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, width, height);
	ctx.fillStyle = "white";
	ctx.font = "50px Comfortaa";
	ctx.textAlign = "center";
	ctx.fillText("Fall!", width / 2, height / 3);
	ctx.font = "30px Comfortaa";
	ctx.fillText("-Press Space-", width / 2, height / 2);
	ctx.font = "15px Comfortaa";
	ctx.fillText("Use WASD to move your character", width / 2, height / 1.75);
	ctx.fillText("Press M to mute/play music", width / 2, height / 1.65);
	ctx.fillText("Made by Ironbizmark", width / 2, height / 1.1);


    
    if(score != null) {
        ctx.textAlign = "left";
        ctx.font = "15px Comfortaa";
        ctx.fillText("Last Score: " + score, 10, 20);
    }


	if(keys[32]) {
		startGame();
	} else {
		requestAnimationFrame(menuState); 
	}
}

function toggleMusic() {
	if(musicOn) {
		music.pause();
		musicOn = false;
	} else {
		music.play();
		musicOn = true;
	}
}

function checkKeys() {
	if (keys[87] || keys[32]) {
		player.y -= 0.1;
        // up arrow or space
        if (!player.jumping && player.grounded) {
        	player.jumping = true;
        	player.grounded = false;
        	player.velY = -player.speed * 2;

        }
    }
    if (keys[68]) {
        // right arrow
        if (player.velX < player.speed) {             
        	player.velX++;         
        }     
    }     

    if (keys[65]) {         // left arrow         
    	if (player.velX > -player.speed) {
    		player.velX--;
    	}
    }
}


function gameState() {
    // check keys

    console.log("PLAY!!");
    
    checkKeys();

    player.velX *= friction;
    player.velY += gravity;

    

    player.grounded = false;

    for(var i = 0; i < boxes.length; i++) {
    	if(boxes[i].y > height) {
    		boxes.splice(i,1);
    	}

    	boxes[i].y++;

    }

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "black";
    ctx.beginPath();

    for (var i = 0; i < boxes.length; i++) {
    	ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);

    	var dir = colCheck(player, boxes[i]);

    	if (dir === "l" || dir === "r") {
    		player.velX = 0;
    		player.jumping = false;
    	} else if (dir === "b") {
    		player.grounded = true;
    		player.jumping = false;
    		player.y+= 1.1;
    	} else if (dir === "t") {
    		player.velY *= -1;
    		player.y += 2; 
    	}

    }




    for (var i = 0; i < dimensions.length; i++) {
    	ctx.rect(dimensions[i].x, dimensions[i].y, dimensions[i].width, dimensions[i].height);

    	var dir = colCheck(player, dimensions[i]);

    	if (dir === "l" || dir === "r") {
    		player.velX = 0;
    		player.jumping = false;
    	} else if (dir === "b") {
    		player.grounded = true;
    		player.jumping = false;
    	} else if (dir === "t") {
    		player.velY *= -1;
    		player.y-= 2;
    	}

    }

    //SPAWN BLOCK

    if(counter <= 0 ) {
    	boxes.push({
    		x: Math.random() * width,
    		y: -25,
    		width: 80,
    		height: 20
    	});
        score++;
    	counter = 50;
    } else {
    	counter--;
    }

    //PlAYER STUFF

    if(player.grounded){
    	player.velY = 0;
    }

    player.x += player.velX;
    player.y += player.velY;

    

    drawPlayer();

    ctx.font = "15px Comfortaa";
    ctx.fillText(score, 10, 20);

    //Let's loop it!

    if(player.y > height) {
    	menuState();
    } else {
    	requestAnimationFrame(gameState);
    }
}

function drawPlayer() {
    // body
    ctx.fill();
    ctx.fillStyle = "gray";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // EYES
    if (blinkCnt < 10) {
    	blinkCnt--;
    	if (blinkCnt === 0) {
    		blinkCnt = 100;
    	}
		// closed eyes
		ctx.fillStyle = "gray";
		ctx.fillRect(player.x + player.width/2.0 - 3.5 - 3, player.y + 2, 6, 6);
		ctx.fillRect(player.x + player.width/2.0 + 3.5 - 3, player.y + 2, 6, 6);
	} else {
		blinkCnt--;

		// open eyes
		ctx.fillStyle = "white";
		ctx.fillRect(player.x + player.width/2.0 - 3.5 - 3, player.y + 2, 6, 6);
		ctx.fillRect(player.x + player.width/2.0 + 3.5 - 3, player.y + 2, 6, 6);

		// pupils
		ctx.fillStyle = "black";
		var dx = 0;
		if (player.velX > 0) {
			dx = 1;
		} else if (player.velX < 0) {
			dx = -1;
		}
		ctx.fillRect(player.x + player.width/2.0 - 3.5 - 1 + dx, player.y + 4, 2, 2);
		ctx.fillRect(player.x + player.width/2.0 + 3.5 - 1 + dx, player.y + 4, 2, 2);
	}

	ctx.fillStyle = "black"

    // mouth while jumping
    if (player.jumping === true) {
    	ctx.fillRect(player.x + 6, player.y + 11, 4, 4);
    } else {
    	ctx.fillRect(player.x + 5,  player.y + 13, 6, 1);
    	ctx.fillRect(player.x + 5,  player.y + 11, 1, 2);
    	ctx.fillRect(player.x + 10, player.y + 11, 1, 2);
    }

    return;
}

function colCheck(shapeA, shapeB) {
    // get the vectors to check against
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
    vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
        // add the half widths and half heights of the objects
        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        colDir = null;

    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {         // figures out on which side we are colliding (top, bottom, left, or right
    	var oX = hWidths - Math.abs(vX);
    	var oY = hHeights - Math.abs(vY);         
    	if (oX >= oY) {
    		if (vY > 0) {
    			colDir = "t";
    			shapeA.y += oY;
    		} else {
    			colDir = "b";
    			shapeA.y -= oY;
    		}
    	} else {
    		if (vX > 0) {
    			colDir = "l";
    			shapeA.x += oX;
    		} else {
    			colDir = "r";
    			shapeA.x -= oX;
    		}
    	}
    }
    return colDir;
}

document.body.addEventListener("keydown", function (e) {
	keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function (e) {
	keys[e.keyCode] = false;
	if(e.keyCode == 77) {
		toggleMusic();
	}
});

window.addEventListener("load", function () {
	menuState();
});