/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


*/


var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var trees_x;
var collectables;
var canyons;
var flagpole;

var game_score;
var lives;
var platforms;
var jumpSound;


/* 1ST EXTENXION*/
/* ------------------
Allows me to load and play sound files (such as "mp3, wav and etc") 
when the player jump, collect a coin or dies. I took the sounds 
from "https://downloads.khinsider.com/mario"and add it in the assets 
files.
--------------------*/
function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    
    coinsound = loadSound('assets/coin.mp3');
    coinsound.setVolume(0.1);
    
    lifesound = loadSound('assets/life.mp3');
    lifesound.setVolume(0.1);
}


function setup()
{
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    lives = 3;
    startGame();

}

function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    push(); //background scroll
    translate(scrollPos, 0);
    //plumming func
    if(isPlummeting == true){
        gameChar_y+=10;
    }
    
	// Draw clouds
    drawClouds();
	// Draw mountains
    drawMountains();

	// Draw trees
    drawTrees();
    // Draw flagpole
    renderFlagpole();
    // Draw platforms
    for(var i = 0; i < platforms.length;i++){
        platforms[i].draw();  
    } 

	// Draw canyons.
    for(var i = 0; i < canyons.length; i++){
        checkCanyon(canyons[i]);
        drawCanyon(canyons[i]);
    }

	// Draw collectable items.
    for(var i = 0; i < collectables.length; i++){
        if(!collectables[i].isFound){
            checkCollectable(collectables[i]);
            drawCollectable(collectables[i]);
        }
    }
    pop();  //scrolling pop to make background move
    
	drawGameChar(); // Draw game character.
    drawLives(); // DrawLives
    
    //draw score
    fill(255);
    noStroke();
    text("Score: " + game_score, 10, 20);
    
    // End Game No lives or flag reach
    if(lives < 1 || flagpole.isReached){
        lifesound.play(); 
        push();
        fill(255,255,0);
        textSize(20);
        stroke(5);
        text("GAME OVER Press space to continue", (width/2)-100, (height/2));
        pop();
        
        if(keyCode == 32){
            lives = 3;
            startGame();
        }
        return false;
    }

	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    if(gameChar_y < floorPos_y){
        var isContact = false;
        for(var i = 0; i < platforms.length; i++){
            if(platforms[i].checkContact(gameChar_world_x, gameChar_y)){
                isContact = true;
                break;
            }
        }
        if(isContact == false){
        gameChar_y+=2;
        isFalling = true;
        }
    }
    else{
        isFalling = false;
    }
    
    //Distance to flagPole
    if(!flagpole.isReached){
        checkFlagpole();
    }
    

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// ---------------------
// Key control functions
// ---------------------
// ---------------------


function keyPressed(){

	if(key == 'A' || keyCode == 37)
	{
		isLeft = true;
	}

	else if(key == 'D' || keyCode == 39)
	{
		isRight = true;
	}
    if (keyCode == 32 && gameChar_y == floorPos_y){
        gameChar_y-=100;
        jumpSound.play();
    }

}

function keyReleased()
{

	if(key == 'A' || keyCode == 37)
	{
		isLeft = false;
	}

	else if(key == 'D' || keyCode == 39)
	{
		isRight = false;
	}

}


// ------------------------------
// ------------------------------
// Game character render function
// ------------------------------
// ------------------------------

function drawGameChar()
{
	// draw game character
    //the game character
	if(isLeft && isFalling)
	{
		// add your jumping-left code
        fill(200, 150, 150);
        ellipse(gameChar_x-3, gameChar_y - 55, 35);

        fill(200, 0, 0);
        rect(gameChar_x - 16, gameChar_y - 40, 26, 30);

        fill(200, 150, 150);
        rect(gameChar_x - 23, gameChar_y - 38, 10, 10);
        rect(gameChar_x + 7, gameChar_y - 32, 10, 10);

        fill(255, 0, 0);
        rect(gameChar_x - 19, gameChar_y - 10, 10, 7);
        rect(gameChar_x , gameChar_y - 10, 10, 7);

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        fill(200, 150, 150);
        ellipse(gameChar_x+3, gameChar_y - 55, 35);

        fill(200, 0, 0);
        rect(gameChar_x - 10, gameChar_y - 40, 26, 30);

        fill(200, 150, 150);
        rect(gameChar_x - 17, gameChar_y - 32, 10, 10);
        rect(gameChar_x + 13, gameChar_y - 38, 10, 10);

        fill(255, 0, 0);
        rect(gameChar_x - 10, gameChar_y - 10, 10, 7);
        rect(gameChar_x + 8, gameChar_y - 10, 10, 7);

	}
	else if(isLeft)
	{
		// add your walking left code
        fill(200, 150, 150);
        ellipse(gameChar_x-6, gameChar_y - 50, 35);

        fill(200, 0, 0);
        rect(gameChar_x - 20, gameChar_y - 35, 26, 30);

        fill(255, 0, 0);
        rect(gameChar_x - 20, gameChar_y - 5, 10, 7);
        rect(gameChar_x - 4, gameChar_y - 5, 10, 7);

	}
	else if(isRight)
	{
		// add your walking right code
        fill(200, 150, 150);
        ellipse(gameChar_x+7, gameChar_y - 50, 35);

        fill(200, 0, 0);
        rect(gameChar_x - 5, gameChar_y - 35, 26, 30);

        fill(255, 0, 0);
        rect(gameChar_x + 11, gameChar_y - 5, 10, 7);
        rect(gameChar_x - 5, gameChar_y - 5, 10, 7);

	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        fill(200, 150, 150);
        ellipse(gameChar_x, gameChar_y - 55, 35);

        fill(200, 0, 0);
        rect(gameChar_x - 13, gameChar_y - 40, 26, 30);

        fill(200, 150, 150);
        rect(gameChar_x - 20, gameChar_y - 35, 10, 10);
        rect(gameChar_x + 10, gameChar_y - 35, 10, 10);

        fill(255, 0, 0);
        rect(gameChar_x - 13, gameChar_y - 10, 10, 7);
        rect(gameChar_x + 3, gameChar_y - 10, 10, 7);

	}
	else
	{
		// add your standing front facing code
        fill(200, 150, 150);
        ellipse(gameChar_x, gameChar_y - 50, 35);

        fill(200, 0, 0);
        rect(gameChar_x - 13, gameChar_y - 35, 26, 30);

        fill(255, 0, 0);
        rect(gameChar_x - 13, gameChar_y - 5, 10, 9);
        rect(gameChar_x + 3, gameChar_y - 5, 10, 9);

	}
    
    //If fell dwon the canyon
    checkPlayerDie();
}

// ---------------------------
// ---------------------------
// Background functions
// ---------------------------
// ---------------------------

// Function to draw cloud objects.
function drawClouds(){
    for(var i = 0; i < clouds.length; i++){
        fill(255, 255, 255);
        ellipse(clouds[i].x_pos, clouds[i].y_pos, 80, 80);
        ellipse(clouds[i].x_pos - 40, clouds[i].y_pos, 60, 60);
        ellipse(clouds[i].x_pos + 40, clouds[i].y_pos, 60, 60);

     }
}

// Function to draw mountains objects.
function drawMountains(){
    for(var i = 0; i < mountains.length; i++){
        fill(128, 128, 128);
        triangle(mountains[i], floorPos_y, mountains[i]+125, floorPos_y-350, mountains[i]+225, floorPos_y );
     }
}

// Function to draw trees objects.
function drawTrees(){
    for(var i = 0; i < trees_x.length; i++){
        fill(150,50,0);
        rect(trees_x[i],floorPos_y-50, 10, 50);
        fill(85, 107, 47);
        ellipse(trees_x[i] + 5, floorPos_y-80, 80, 80);
    }
}

// ---------------------------------
// ---------------------------------
// Canyon functions
// ---------------------------------
// ---------------------------------


// Function to draw canyon objects.
function drawCanyon(t_canyon)
{
    noStroke();
    fill(100, 155, 255);
    rect(t_canyon.x_pos, floorPos_y, t_canyon.width, t_canyon.depth);

}

// Function to check character is over a canyon.
function checkCanyon(t_canyon)
{
    if(gameChar_world_x > t_canyon.x_pos && gameChar_world_x < t_canyon.x_pos + t_canyon.width && gameChar_y >= floorPos_y){
        isPlummeting = true;
    }
}

// ----------------------------------
// ----------------------------------
// Collectable items render and check functions
// ----------------------------------
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
    fill(255,215,0);
    ellipse(t_collectable.x_pos, t_collectable.y_pos,t_collectable.size)
    fill(255,255,0);
    ellipse(t_collectable.x_pos, t_collectable.y_pos,t_collectable.size, t_collectable.size)

}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < t_collectable.size){
        t_collectable.isFound = true;
        game_score += 1;
        coinsound.play();
    }

}
// ----------------------------------
// ----------------------------------
// Platform functions
// ----------------------------------
// ----------------------------------


/* 2ST EXTENXION*/
/* ------------------
Allows us to have a little platforms where the player can jump on to with his character.
--------------------*/
 
function createPlatforms(x, y, length){
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function(){ //Draw the platform on the canavs
        fill(255, 0, 255);
        rect(this.x, this.y, this.length, 20);
        
    },
        checkContact: function(gc_x, gc_y){
        if(gc_x > this.x && gc_x< this.x + this.length){
            var d = this.y - gc_y;
            if(d>= 0&& d<5){
                return true;
            }
        }
            return false;
    }
        
    }
return p;
}



// ----------------------------------
// ----------------------------------
// Flgpole items functions
// ----------------------------------
// ----------------------------------

//render flagpole
function renderFlagpole(){
    push();
    strokeWeight(10);
    stroke(50);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y-250);
    fill(255,0,0);
    if(flagpole.isReached){
        rect(flagpole.x_pos, floorPos_y-250, 50, 40);
    }
    else{
        rect(flagpole.x_pos, floorPos_y-45, 50, 40);
    }
    pop();
}
// Distance to flagpole is reached
function checkFlagpole(){
    var d = abs(gameChar_world_x - flagpole.x_pos);
    if(d<10)
        {
            flagpole.isReached = true;
        }
}

// ----------------------------------
// ----------------------------------
// Lives and check functions
// ----------------------------------
// ----------------------------------

//How many lives
function drawLives(){
    if(lives > 0){
        fill(255,25,200);
        textSize(15);
        text("lives: " + lives, width-150, 25);
        for(var i = lives; i > 0; i--){
            ellipse(width-30 * i, 20, 20, 20);
        }
        return;
    }
}

// Enough Lives

function checkPlayerDie(){
    if(gameChar_y > height){
        lives -= 1;
        if(lives > 0){
            startGame();
        }
    }
}

// ----------------------------------
// ----------------------------------
// Start game functions
// ----------------------------------
// ----------------------------------

function startGame(){
    gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    trees_x = [-200,250, 860, 1300, 1600,2000];
    mountains = [-200, 400, 1000, 1400];
    
    canyons = [{x_pos: 150, width: 80, depth: 150},
              {x_pos: 700, width: 70, depth: 150},
              {x_pos: 900, width: 70, depth: 150},
              {x_pos: 1700, width: 80, depth: 150},
              {x_pos: 2100, width: 80, depth: 150}];
    
    clouds = [{x_pos: 100, y_pos: 150}, 
              {x_pos: 600, y_pos: 100}, 
              {x_pos: 800, y_pos: 150},
              {x_pos: 100, y_pos: 175},
              {x_pos: -300, y_pos: 120},
              {x_pos: 1400, y_pos: 175}];
    
    collectables = [{x_pos: 50, y_pos: floorPos_y - 20, isFound: false, size: 30},
                   {x_pos: 350, y_pos: floorPos_y - 20, isFound: false, size: 30},
                   {x_pos: 750, y_pos: floorPos_y - 20, isFound: false, size: 30},
                   {x_pos: 1000, y_pos: floorPos_y - 20, isFound: false, size: 30},
                   {x_pos: 1250, y_pos: floorPos_y - 20, isFound: false, size: 30},
                   {x_pos: 1550, y_pos: floorPos_y - 20, isFound: false, size: 30},
                   {x_pos: 1820, y_pos: floorPos_y - 20, isFound: false, size: 30}];
    
    
    platforms = [];
    
    platforms.push(createPlatforms(100, floorPos_y - 100, 100));
    platforms.push(createPlatforms(500, floorPos_y - 100, 100));
    platforms.push(createPlatforms(1200, floorPos_y - 100, 100));
    platforms.push(createPlatforms(1900, floorPos_y - 100, 100));
    
    game_score = 0; 
    flagpole = {isReached: false, x_pos: 2300}
}