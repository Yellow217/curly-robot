var GAME = {
    width: 600,
    height: 870,
    iflost: false,
    Backgroundcolor: "#FFBA00",
    background: new Image(),
}

var InfoWindow = {
    width: 250,
    height: GAME.height,
    x: GAME.width,
    Backgroundcolor: "blue",
    textcolor: "white",
    y: 155,
}

var canvas = document.getElementById("canvas");
canvas.width = GAME.width + InfoWindow.width;
canvas.height = GAME.height;

var canvasContext = canvas.getContext("2d");
var PLAYER = {
    x: 270,
    y: 700,
    width: 42,
    height: 21,
    color: "#EE9A4D",
    score: 0,
    lives: 3,
    xDirection: 10,
    hero: new Image(),
    live: new Image()
}


var ENEMY = {
    width: 222,
    height: 122,

}

function drawENEMY() {
    if (ENEMY.nlo) {
        canvasContext.drawImage(ENEMY.nlo, (GAME.width - ENEMY.width) / 2, 0, ENEMY.width, ENEMY.height);
    }
}

var nlo = new Image();
nlo.src = 'img/nlo.png';
nlo.onload = function () {
    ENEMY.nlo = nlo;
}

var background = new Image();
background.src = 'img/bg.png';
background.onload = function () {
    GAME.background = background;
}

var meteor = new Image();
meteor.src = 'img/meteor.png';
meteor.onload = function () {
    METEOR.meteor = meteor;
}

var hero = new Image();
hero.src = 'img/hero.png';
hero.onload = function () {
    PLAYER.hero = hero;
}

var live = new Image();
live.src = 'img/live.png';
live.onload = function () {
    PLAYER.live = live;
}

var maxSize = 50;
var maxSpeed = 20;
var minSpeed = 10;
var minSize = 30;


var METEOR = {
    x: Math.floor(Math.random() * (GAME.width - maxSize * 2) + maxSize),
    width: Math.floor(Math.random() * maxSize + minSize),
    speedy: Math.floor(Math.random() * maxSpeed + minSpeed),
    y: -maxSize,
}

function drawMeteor() {
    var i = 0;
    do {
        if (METEOR.meteor) {
            canvasContext.drawImage(METEOR.meteor, METEORS[i].x, METEORS[i].y, METEORS[i].width, METEORS[i].width * 1.7);
        }
        i++;
    }
    while (i < countOfMeteors)
}

var METEORS = [];
var countOfMeteors = 3;
METEORS.length = countOfMeteors
var meteorSize = 20;

function InitMeteors() {
    var i = 0;
    do {
        var initX = Math.floor(Math.random() * (GAME.width - meteorSize));
        var initSpeed = Math.floor(Math.random() * 20 + 5);
        METEORS[i] = {
            x: initX,
            y: -20,
            speedy: initSpeed,
            width: 20,
        }
        console.log(i);
        i++;
    }
    while (i < countOfMeteors)
}
InitMeteors()
function drawBackground() {
    if (GAME.background) {
        canvasContext.drawImage(GAME.background, 0, 0);
    }
}

function drawPlayer() {
    if (PLAYER.hero) {
        canvasContext.drawImage(PLAYER.hero, PLAYER.x, PLAYER.y);
    }
}

function drawLives() {
    if (PLAYER.live) {
        for (let i = 0; i < PLAYER.lives; i++) {
            canvasContext.drawImage(PLAYER.live, InfoWindow.x + i * 35, InfoWindow.y);

        }
    }
}

function respawnMeteor(i) {
    var METEOR = METEORS[i];
    METEOR.width = Math.floor(Math.random() * maxSize + minSize);
    METEOR.y = -METEOR.width;
    METEOR.x = Math.floor(Math.random() * (GAME.width - METEOR.width * 2) + METEOR.width);
    METEOR.speedy = Math.floor(Math.random() * maxSpeed + minSpeed);
}

function updateMeteor() {
    var i = 0;
    do {
        var METEOR = METEORS[i]
        METEOR.y += METEOR.speedy;
        var losePositionY = METEOR.y + METEOR.width >= PLAYER.y;
        var losePositionX = (METEOR.x - METEOR.width <= PLAYER.x + PLAYER.width) && (METEOR.x + METEOR.width >= PLAYER.x);
        var scoreUpdete = METEOR.y >= GAME.height;
        if (scoreUpdete) {
            respawnMeteor(i);
            PLAYER.score++;
            console.log(PLAYER.score);

        }
        if (losePositionX && losePositionY) {
            respawnMeteor(i);
            PLAYER.lives -= 1;
            console.log("lives: " + PLAYER.lives);
            if (PLAYER.lives === 0) {
                GAME.iflost = true;
            }
        }
        i++;
    }
    while (i < countOfMeteors)
}

function initEventListeners() {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("keydown", onCanvasKeyDown);
}

function onCanvasKeyDown(event) {
    if (event.key === "ArrowLeft") {
        PLAYER.x = PLAYER.x - PLAYER.xDirection;
    }
    if (event.key === "ArrowRight") {
        PLAYER.x = PLAYER.x + PLAYER.xDirection;
    }
    if (PLAYER.x < 0) {
        PLAYER.x = 0
    }
    if (PLAYER.x + PLAYER.width > GAME.width) {
        PLAYER.x = GAME.width - PLAYER.width;
    }
}

function onMouseMove(event) {
    if ((event.clientX + PLAYER.width < GAME.width) && (event.clientX - PLAYER.width / 2 > 0)) {
        PLAYER.x = event.clientX - PLAYER.width / 2;
    } else {
        if ((event.clientX + PLAYER.width > GAME.width)) {
            PLAYER.x = GAME.width - PLAYER.width;
        } else {
            PLAYER.x = 0;
        }
    }
}

function drawFrame() {
    canvasContext.clearRect(0, 0, GAME.width, GAME.height);
    drawBackground();
    drawPlayer();
    drawENEMY();
    drawMeteor();
    drawInfoWindow();

}

function Play() {
    if (GAME.iflost === false) {
        drawFrame();
        updateMeteor();
        requestAnimationFrame(Play);
    }
    else {
        drawFrame();
        alert("You DEAD")
    }
}
function drawInfoWindow() {
    canvasContext.fillStyle = InfoWindow.Backgroundcolor;
    canvasContext.beginPath();
    canvasContext.rect(InfoWindow.x, 0, InfoWindow.width, InfoWindow.height);
    canvasContext.fill();
    canvasContext.fillStyle = InfoWindow.textcolor;
    canvasContext.font = "30px serif";
    canvasContext.fillText("Your score :", InfoWindow.x + 10, 50);
    canvasContext.fillText(PLAYER.score, InfoWindow.x + 10, 85);
    canvasContext.fillText("Your time to live :", InfoWindow.x + 10, 120);
    drawLives();
}
initEventListeners();
Play();