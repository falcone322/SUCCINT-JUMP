//board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

//crab
let crabWidth = 60;
let crabHeight = 60;
let crabX = boardWidth/2 - crabWidth/2;
let crabY = boardHeight*7/8 - crabHeight;
let crabRightImg;
let crabLeftImg;

let crab = {
    img : null,
    x : crabX,
    y : crabY,
    width : crabWidth,
    height : crabHeight
}

//physics
let velocityX = -5; 
let velocityY = -5; 
let initialVelocityY = -4; 
let gravity = 0.1;

//platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let score = 0;
let maxScore = 0;
let gameOver = false;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //draw crab
    // context.fillStyle = "green";
    // context.fillRect(crab.x, crab.y, crab.width, crab.height);

    //load images
    crabRightImg = new Image();
    crabRightImg.src = "./crab-right1.png";
    crab.img = crabRightImg;
    crabRightImg.onload = function() {
        context.drawImage(crab.img, crab.x, crab.y, crab.width, crab.height);
    }

    crabLeftImg = new Image();
    crabLeftImg.src = "./crab-left1.png";

    platformImg = new Image();
    platformImg.src = "./platform1.png";

    velocityY = initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveCrab);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //crab
    crab.x += velocityX;
    if (crab.x > boardWidth) {
        crab.x = 0;
    }
    else if (crab.x + crab.width < 0) {
        crab.x = boardWidth;
    }

    velocityY += gravity;
    crab.y += velocityY;
    if (crab.y > board.height) {
        gameOver = true;
    }
    context.drawImage(crab.img, crab.x, crab.y, crab.width, crab.height);

    //platforms
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (velocityY < 0 && crab.y < boardHeight*3/4) {
            platform.y -= initialVelocityY; //slide platform down
        }
        if (detectCollision(crab, platform) && velocityY >= 0) {
            velocityY = initialVelocityY; //jump
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    // clear platforms and add new platform
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift(); //removes first element from the array
        newPlatform(); //replace with new platform on top
    }

    //score
    updateScore();
    context.fillStyle = "black";
    context.font = "16px sans-serif";
    context.fillText(score, 5, 20);

    if (gameOver) {
        context.fillText("Crab fell :( Save him! (press 'space')", boardWidth/7, boardHeight*7/8);
    }
}

function moveCrab(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") { //move right
        velocityX = 4;
        crab.img = crabRightImg;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") { //move left
        velocityX = -4;
        crab.img = crabLeftImg;
    }
    else if (e.code == "Space" && gameOver) {
        //reset
        crab = {
            img : crabRightImg,
            x : crabX,
            y : crabY,
            width : crabWidth,
            height : crabHeight
        }

        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        gameOver = false;
        placePlatforms();
    }
}

function placePlatforms() {
    platformArray = [];

    //starting platforms
    let platform = {
        img : platformImg,
        x : boardWidth/2,
        y : boardHeight - 50,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);

    // platform = {
    //     img : platformImg,
    //     x : boardWidth/2,
    //     y : boardHeight - 150,
    //     width : platformWidth,
    //     height : platformHeight
    // }
    // platformArray.push(platform);

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * boardWidth*3/4); //(0-1) * boardWidth*3/4
        let platform = {
            img : platformImg,
            x : randomX,
            y : boardHeight - 75*i - 150,
            width : platformWidth,
            height : platformHeight
        }
    
        platformArray.push(platform);
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth*3/4); //(0-1) * boardWidth*3/4
    let platform = {
        img : platformImg,
        x : randomX,
        y : -platformHeight,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function updateScore() {
    let points = Math.floor(50*Math.random()); //(0-1) *50 --> (0-50)
    if (velocityY < 0) { //negative going up
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
        }
    }
    else if (velocityY >= 0) {
        maxScore -= points;
    }
}