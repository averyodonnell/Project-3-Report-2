var game = document.querySelector(".game");
var character = document.querySelector(".character");
var line1 = document.querySelector(".line1");
var scoreElement = document.getElementById("score");
var pauseButton = document.getElementById("pauseButton");
var startScreen = document.getElementById("startScreen");
var playButton = document.getElementById("playButton");


var gameTime = 0;  
var fallSpeed = 20;
var fallInterval;


var score = 0;
var isPaused = false;
var itemGeneration;
var fallIntervals = [];
var fallingItems = [];


playButton.addEventListener("click", function () {


    startScreen.style.display = "none";
    game.style.display = "block";
    pauseButton.style.display = "inline-block";
    scoreElement.style.display = "block";
    startItemGeneration();
    startGameTimer();
});


function moveCharacterLeft() {
    if (isPaused) return;
    var characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    if (characterLeft > 0) {
        characterLeft -= 8;
        character.style.left = characterLeft + 'px';
        character.style.transform = "scaleX(1)";
    }
}


function moveCharacterRight() {
    if (isPaused) return;
    var characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    if (characterLeft < 620) {
        characterLeft += 8;
        character.style.left = characterLeft + 'px';
        character.style.transform = "scaleX(-1)";
    }
}


function control(e) {
    if (e.key == "ArrowLeft") {
        moveCharacterLeft();
    }
    if (e.key == "ArrowRight") {
        moveCharacterRight();
    }
}


function checkCollision(item) {
    var characterRect = character.getBoundingClientRect();
    var itemRect = item.getBoundingClientRect();
    if (
        itemRect.left < characterRect.right &&
        itemRect.right > characterRect.left &&
        itemRect.bottom > characterRect.top &&
        itemRect.top < characterRect.bottom
    ) {
        return true;
    }
    return false;
}


function checkBottomLine(item) {
    var lineRect = line1.getBoundingClientRect();
    var itemRect = item.getBoundingClientRect();
    if (itemRect.bottom >= lineRect.top) {
        return true;
    }
    return false;
}


function generateItems() {
    var itemLeft = Math.floor(Math.random() * 620);
    var itemBottom = 470;
   
       
       var newItem = document.createElement('img');
       newItem.setAttribute("class", "item");
   
     
       newItem.src = "https://cdn3.iconfinder.com/data/icons/food-1-11/128/food-27-1024.png";
   
       newItem.style.width = "40px";
       newItem.style.height = "40px";
   
       game.appendChild(newItem);  


    newItem.style.left = itemLeft + 'px';
    newItem.style.bottom = itemBottom + 'px';


    var fallingItem = {
        element: newItem,
        bottom: itemBottom,
        interval: null
    };


    fallingItems.push(fallingItem);


    var fallInterval = setInterval(function () {
        if (isPaused) return;


        fallingItem.bottom -= 5;
        newItem.style.bottom = fallingItem.bottom + 'px';


        if (fallingItem.bottom <= 0 || checkCollision(newItem) || checkBottomLine(newItem)) {
            if (game.contains(newItem)) {
                clearInterval(fallInterval);
               


                if (checkCollision(newItem)) {
                    score++;
                    scoreElement.textContent = "Score: " + score;
                    console.log("Score updated to: " + score);
                }


                if (score >= 100) {
                    showYouWonScreen();
                }

            game.removeChild(newItem);
            fallingItems = fallingItems.filter(item => item !== fallingItem);
            }
        }
    }, 20);


    fallingItem.interval = fallInterval;
    function showYouWonScreen() {
        game.style.display = "none";
        youWonScreen.style.display = "block";  
    }
}


function startItemGeneration() {
    itemGeneration = setInterval(generateItems, 1000);
}


function stopItemGeneration() {
    clearInterval(itemGeneration);
}


function gamePause() {
    isPaused = !isPaused;


    if (isPaused) {
        stopItemGeneration();
        pauseButton.textContent = "Resume";
    } else {
        startItemGeneration();
        pauseButton.textContent = "Pause";
    }
}


function speedUpFallRate() {
    gameTime += 20;


 
    if (fallSpeed > 1) {
        fallSpeed -= 1;
    }
    console.log("Game time: " + gameTime + " seconds, fallSpeed: " + fallSpeed);
}


function startGameTimer() {
    setInterval(speedUpFallRate, 5000);
}


document.addEventListener("keydown", control);
pauseButton.addEventListener("click", gamePause);


document.getElementById('restartButton').addEventListener('click', function () {


    score = 0;
    scoreElement.textContent = "Score: 0";
    youWonScreen.style.display = "none";  
    game.style.display = "block";
    startItemGeneration();  
    startGameTimer();  
});
