
// Declaration of required global variables.
const width = 600;
const height = 800;
const fps = 10;
const tileSize = 20;
let canvas;
let ctx;
let snake;
let food;
let score;
let isPaused;
let interval;
var  fpsInterval, startTime, now, then, elapsed;


// Adding an event listener for key presses.
window.addEventListener("keydown",function(evt){
    console.log(evt.key)
    if(evt.key === " "){

        isPaused = !isPaused;
        showPaused();

    }
    else if(evt.key === "ArrowUp"){

        if(snake.velY != 1 && snake.x >=0 && snake.x<=width && snake.y>=0 && snake.y <=height)
            snake.dir(0,-1);

    }
    else if(evt.key === "ArrowDown"){

        if(snake.velY != -1 && snake.x >=0 && snake.x<=width && snake.y>=0 && snake.y <=height)
            snake.dir(0,1);

    }
    else if(evt.key === "ArrowLeft"){

        if(snake.velX != 1 && snake.x >=0 && snake.x<=width && snake.y>=0 && snake.y <=height)
            snake.dir(-1,0);

    }
    else if(evt.key === "ArrowRight"){

        if(snake.velX != -1 && snake.x >=0 && snake.x<=width && snake.y>=0 && snake.y <=height)
            snake.dir(1,0);

    }

});

// Determining a random spawn location on the grid.
function spawnLocation(){

    // Breaking the entire canvas into a grid of tiles.
    let rows = width/tileSize;
    let cols = height/tileSize;

    let xPos = Math.floor(Math.random() * rows) * tileSize;
    let yPos = Math.floor(Math.random() * cols) * tileSize;

    return {x: xPos,y: yPos};

}

// Showing the score of the player.
function showScore(){

    ctx.textAlign = "center";
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("SCORE: " + score,width-90,30);

}

// Showing if the game is paused.
function showPaused(){

    ctx.textAlign = "center";
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("PAUSED",width/2,height/2);

}

// Treating the snake as an object.
class Snake{

    // Initialization of object properties.
    constructor(pos,color){

        this.x = pos.x;
        this.y = pos.y;
        this.tail = [];
        this.velX = 1;
        this.velY = 0;
        this.color = color;

    }

    // Drawing the snake on the canvas.
    draw(){

        // Drawing the head of the snake.
        ctx.beginPath();
        ctx.rect(this.x,this.y,tileSize,tileSize);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();

        // Drawing the tail of the snake.
        for(var i=0;i<this.tail.length;i++){

            ctx.beginPath();
            ctx.rect(this.tail[i].x,this.tail[i].y,tileSize,tileSize);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.closePath();

        }


    }

    // Moving the snake by updating position.
    move(){

        // Movement of the tail.    
        for(var i=this.tail.length-1;i>0;i--){

            this.tail[i] = this.tail[i-1];

        }

        // Updating the start of the tail to acquire the position of head.
        if(this.tail.length != 0)
            this.tail[0] = {x: this.x, y: this.y};

        // Movement of the head.   
        this.x += this.velX * tileSize;
        this.y += this.velY * tileSize;

    }

    // Changing the direction of movement of the snake.
    dir(dirX,dirY){

        this.velX = dirX;
        this.velY = dirY;

    }

    // Determining whether the snake has eaten a piece of food.
    eat(){

        if(Math.abs(this.x - food.x) < tileSize && Math.abs(this.y - food.y) < tileSize){
            
            // Adding to the tail.
            this.tail.push({});

            return true;
        }

        return false;

    }

    // Checking if the snake has died.
    die(){

        

        for(var i=0;i<this.tail.length;i++){
            if(Math.abs(this.x - this.tail[i].x) < tileSize && Math.abs(this.y - this.tail[i].y) < tileSize){
                console.log(i+ "  "+this.x+','+this.y,"     "+this.tail[i].x+","+this.tail[i].y)
                return true;
            }
                

        }

        return false;

    }

    border(){
        if(this.x + tileSize > width && this.velX!=-1 || this.x <  0 && this.velX !=1)
            this.x= width-this.x 
        else if(this.y + tileSize > height && this.velY!=-1 || this.velY!=1 &&this.y < 0)
            this.y= height-this.y
    }

}

// Treating the food as an object.
class Food{

    // Initialization of object properties.
    constructor(pos,color){

        this.x = pos.x;
        this.y = pos.y;
        this.color = color;

    }

    // Drawing the food on the canvas.
    draw(){

        ctx.beginPath();
        ctx.rect(this.x,this.y,tileSize,tileSize);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();

    }

}

// Initialization of the game objects.
function init(){

    window.resizeTo(500,500);
    canvas = document.getElementById("game-area");
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext("2d");
    console.log(canvas);

    isPaused = false;
    score = 0;
    snake = new Snake(spawnLocation(),"#39ff14");
    food = new Food(spawnLocation(),"red");

}

// Updating the position and redrawing of game objects.
function update(){


    requestAnimationFrame(update);
    now = Date.now();
    elapsed = now - then;


    if (elapsed > fpsInterval) {

        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);

        // Put your drawing code here
        // Checking if game is paused.
        if(isPaused){
            return;
        }

        // Clearing the canvas for redrawing.
        ctx.clearRect(0,0,width,height);
        if(snake.die()){

            alert("GAME OVER!!!");
            init();
            window.location.reload();

        }
        snake.border();
        if(snake.eat()){

            score += 10;
            food = new Food(spawnLocation(),"red");

        }




        food.draw();
        snake.draw();
        snake.move();
        showScore();


    }


}

// The actual game function.
function game(){

    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    init();

    // The game loop.
    update();


}

game();