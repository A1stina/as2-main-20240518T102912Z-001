let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let lives = 3;
let score = 0;

const main = document.querySelector("main");

//Player = 2, Wall = 1, Enemy = 3, Point = 0
let maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 5, 1, 0, 0, 0, 5, 0, 1],
  [1, 0, 5, 0, 5, 0, 0, 5, 1, 1],
  [1, 5, 0, 0, 0, 0, 0, 5, 5, 1],
  [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 5, 5, 0, 0, 0, 0, 1, 1, 1],
  [1, 0, 0, 1, 0, 0, 5, 0, 5, 1],
  [1, 5, 5, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

//RANDOMISING ENEMIES
function createEnemies() {
  let row = Math.floor(Math.random() * maze.length);
  let cols = Math.floor(Math.random() * maze[row].length);
  if (maze[row][cols] == 0) {
    maze[row][cols] = 3;
  } else {
    createEnemies();
  }
}
createEnemies();
createEnemies();
createEnemies();

//RANDOMISING MAZE
function ranMaze() {
  const row = Math.floor(Math.random() * maze.length);
  const column = Math.floor(Math.random() * maze[row].length);

  if (maze[row][column] == 0) {
    maze[row][column] = 1;
  } else {
    ranMaze();
  }
}
ranMaze();
ranMaze();
ranMaze();

//Populates the maze in the HTML
for (let y of maze) {
  for (let x of y) {
    let block = document.createElement("div");
    block.classList.add("block");

    switch (x) {
      case 1:
        block.classList.add("wall");
        break;
      case 2:
        block.id = "player";
        let mouth = document.createElement("div");
        mouth.classList.add("mouth");
        block.appendChild(mouth);
        break;
      case 3:
        block.classList.add("enemy");
        break;
      default:
        block.classList.add("point");
        block.style.height = "1vh";
        block.style.width = "1vh";
    }

    main.appendChild(block);
  }
}
function checkPointsColli() {
  const position = player.getBoundingClientRect();
  const points = document.querySelectorAll(".point");
  pointsDeduction = 0;

  for (let i = 0; i < points.length; i++) {
    let pointPosition = points[i].getBoundingClientRect();
    if (
      position.right > pointPosition.left &&
      position.left < pointPosition.right &&
      position.bottom > pointPosition.top &&
      position.top < pointPosition.bottom
    ) {
      points[i].classList.remove("point");
      score++;
      increaseTheScore();
    }
  }

  if (points.length === 0) {
    isLevelComplete();
  }
}

// Score Increment
function increaseTheScore() {
  const countScore = document.querySelector(`.score p`);
  countScore.textContent = score;
  // nexLevel();
}

//Player movement
function keyUp(event) {
  upPressed = false;
  downPressed = false;
  leftPressed = false;
  rightPressed = false;

  if (event.key === "ArrowUp") {
    upPressed = false;
  } else if (event.key === "ArrowDown") {
    downPressed = false;
  } else if (event.key === "ArrowLeft") {
    leftPressed = false;
  } else if (event.key === "ArrowRight") {
    rightPressed = false;
  }
}

function keyDown(event) {
  if (event.key === "ArrowUp") {
    upPressed = true;
  } else if (event.key === "ArrowDown") {
    downPressed = true;
  } else if (event.key === "ArrowLeft") {
    leftPressed = true;
  } else if (event.key === "ArrowRight") {
    rightPressed = true;
  }
}

//Live
function createLives() {
  let livesList = document.createElement(`li`);
  let unorderedList = document.querySelector(`.lives ul`);
  unorderedList.appendChild(livesList);
}

let pauseTheGame = false;
let gameOver = false;
//Track player movement and collision with player
let collisionCheck = false;
function isEnemyCollision() {
  const playerPosition = player.getBoundingClientRect();
  const enemies = document.querySelectorAll(".enemy");

  enemies.forEach((enemy) => {
    const enemyPosition = enemy.getBoundingClientRect();

    const collision =
      playerPosition.left < enemyPosition.right &&
      playerPosition.right > enemyPosition.left &&
      playerPosition.top < enemyPosition.bottom &&
      playerPosition.bottom > enemyPosition.top;

    if (collision) {
      if (lives > 0 && collisionCheck == false) {
        lives--;
        killLives();
        collisionCheck = true;
        player.classList.add(`hit`);
        setTimeout(function () {
          collisionCheck = false;
        }, 1000);
        return;
      } else if (lives == 0 && collisionCheck == false) {
        gameOver = true;
        gameOverMes();
        player.classList.add("dead");
        location.reload;
      }
    }
  });
}

let currLevel = 1;

function nexLevel() {
  console.log(`Its moving to another level`);
  currLevel++;
  console.log(`Its moving to another level: ${currLevel}`);
  createEnemies();
  console.log(`More enemy `);
  ranTheMaze();
  console.log(`Maze ran`);

  gameOver = false;
  player.classList.remove("dead");
}

function isLevelComplete() {
  console.log(`Checking level`);
  if (allPointsFinished()) {
    console.log(`Work`);
  }
}

function allPointsFinished() {
  const allPointsTaken = document.querySelectorAll(`.point`);
  console.log(`Point is taken: ${allPointsTaken.length}`);
  return allPointsTaken.length === 0;
}


// REMOVE LIVES
function killLives() {
  const life = document.querySelector(".lives ul li");
  if (life) {
    life.remove();
    music()
  }
}

//GAME OVER
function gameOverMes() {
  let username = getUsername();
  if (username) {
    saveToLocalStorage(username, score);
    getFromLocalStorage(username, score);
  }

  const allPointTaken = document.querySelectorAll(`.point`);
  if (allPointTaken.length <= 0) {
    alert(`Congrats!!! Level Completed`);
    document.removeEventListener("keydown", keyDown);
    document.removeEventListener("keyup", keyUp);
  } else {
    alert(`Game Over!!! You lost`);
    document.removeEventListener("keydown", keyDown);
    document.removeEventListener("keyup", keyUp);
  }

  setTimeout(() => {
    location.reload();
  }, 1);
}

//Interval for enemy, point
setInterval(function () {
  if (pauseTheGame || gameOver) return;
  checkPointsColli();
  isEnemyCollision();

}, 100);

const player = document.querySelector("#player");
const playerMouth = player.querySelector(".mouth");
let playerTop = 0;
let playerLeft = 0;
setInterval(function () {
  let position = player.getBoundingClientRect();
  if (downPressed) {
    let bottomCollision = position.bottom + 1;
    let bLeftCollisionDec = document.elementFromPoint(
      position.left,
      bottomCollision
    );
    let bRightCollisionDec = document.elementFromPoint(
      position.right,
      bottomCollision
    );

    if (
      !bLeftCollisionDec.classList.contains("wall") &&
      !bRightCollisionDec.classList.contains("wall")
    ) {
      playerTop++;
      player.style.top = playerTop + "px";
    }
    playerMouth.className = "down";
  } else if (upPressed) {
    let topCollision = position.top - 1;
    let topLeftCollisionDec = document.elementFromPoint(
      position.left,
      topCollision
    );
    let topRightCollisionDec = document.elementFromPoint(
      position.right,
      topCollision
    );

    if (
      !topLeftCollisionDec.classList.contains("wall") &&
      !topRightCollisionDec.classList.contains("wall")
    ) {
      playerTop--;
      player.style.top = playerTop + "px";
    }
    playerMouth.className = "up";
  } else if (leftPressed) {
    let leftCollision = position.left - 1;
    let lTopCollisionDec = document.elementFromPoint(
      leftCollision,
      position.top
    );
    let lBottomCollisionDec = document.elementFromPoint(
      leftCollision,
      position.bottom
    );
    if (
      !lTopCollisionDec.classList.contains("wall") &&
      !lBottomCollisionDec.classList.contains("wall")
    ) {
      playerLeft--;
      player.style.left = playerLeft + "px";
    }
    playerMouth.className = "left";
  } else if (rightPressed) {
    let rightCollision = position.right + 1;
    let rTopCollisionDec = document.elementFromPoint(
      rightCollision,
      position.top
    );
    let rBottomCollisionDec = document.elementFromPoint(
      rightCollision,
      position.bottom
    );

    if (
      !rTopCollisionDec.classList.contains("wall") &&
      !rBottomCollisionDec.classList.contains("wall")
    ) {
      playerLeft++;
      player.style.left = playerLeft + "px";
    }
    playerMouth.className = "right";
  }
}, 10);
let gameStarted = false

// START 
const pressToStart = document.querySelector(".start");
function startTheGame() {
  pressToStart.style.display = "none";

  document.addEventListener("keydown", keyDown);
      document.addEventListener("keyup", keyUp);


      document.querySelector("#ubttn").addEventListener("mousedown", function () {
        upPressed = true;
      });
      document.querySelector("#ubttn").addEventListener("mouseup", function () {
        upPressed = true;
      });
      document.querySelector("#dbttn").addEventListener("mousedown", function () {
        downPressed = true;
      });
      document.querySelector("#dbttn").addEventListener("mouseup", function () {
        downPressed = true;
      });
      document.querySelector("#lbttn").addEventListener("mousedown", function () {
        leftPressed = true;
      });
      document.querySelector("#lbttn").addEventListener("mouseup", function () {
        leftPressed = true;
      });
      document.querySelector("#rbttn").addEventListener("mousedown", function () {
        rightPressed = true;
      });
      document.querySelector("#rbttn").addEventListener("mouseup", function () {
        rightPressed = true;
      });
      createLives();
      createLives();
      createLives();
      moveMyEnemy();
    
    }

let death;


pressToStart.addEventListener("click", startTheGame);

//LEADER BOARD
function getUsername() {
  username = window.prompt(`Create a username:`);

  return username;
}

function addUserToTheBoard(username, score) {
  const userList = document.createElement("li");
  const orderedList = document.querySelector("ol");
  if (orderedList) {
    orderedList.appendChild(userList);
    const userNode = document.createTextNode(`${username} : ${score}`);
    userList.appendChild(userNode);
  } else {
    console.error("Ordered list not found");
  }
}

function saveToLocalStorage(username, score) {
  let users = localStorage.getItem("scores");
  users = users ? users.split(",") : [];
  users.push(`${username}:${score}`);
  localStorage.setItem("scores", users.join(","));
}

function getFromLocalStorage() {
  const users = localStorage.getItem("scores");
  if (users) {
    const leadersScores = users.split(",").map((entry) => {
      const [username, score] = entry.split(`:`);
      return { username, score: parseInt(score, 10) };
    });

    leadersScores.sort((a, b) => b.score - a.score);

    const highestScorer = leadersScores.slice(0, 5);
    highestScorer.forEach((users) => {
      addUserToTheBoard(users.username, users.score);
    });
  }
}

window.addEventListener("load", getFromLocalStorage);


function anyCollision(position, classes) {
  const classesElement = document.querySelectorAll(`.${classes}`);

  for (let i = 0; i < classesElement.length; i++) {
    let pos = classesElement[i].getBoundingClientRect();
    if (
      position.right > pos.left &&
      position.left < pos.right &&
      position.bottom > pos.top &&
      position.top < pos.bottom
    ) {
      return classesElement[i];
    }
  }
  return false;
}

function moveMyEnemy() {
  const enemies = document.querySelectorAll(`.enemy`);
  for (let enemy of enemies) {
    moveMyEnemies(enemy);
  }
}

function moveMyEnemies(enemy) {
  let enemiesTop = 0;
  let enemieLeft = 0;

  let enemiesDirection = Math.ceil(Math.random() * 4);

  setInterval(function () {
    let position = enemy.getBoundingClientRect();
    if (enemiesDirection == 1) {
      let bottomCollision = position.bottom + 1;
      let bLeftCollisionDec = document.elementFromPoint(
        position.left,
        bottomCollision
      );
      let bRightCollisionDec = document.elementFromPoint(
        position.right,
        bottomCollision
      );

      if (
        !bLeftCollisionDec.classList.contains("wall") &&
        !bRightCollisionDec.classList.contains("wall")
      ) {
        enemiesTop++;
        enemy.style.top = enemiesTop + "px";
      } else {
        enemiesDirection = Math.ceil(Math.random() * 4);
      }
    } else if (enemiesDirection == 2) {
      let topCollision = position.top - 1;
      let topLeftCollisionDec = document.elementFromPoint(
        position.left,
        topCollision
      );
      let topRightCollisionDec = document.elementFromPoint(
        position.right,
        topCollision
      );

      if (
        !topLeftCollisionDec.classList.contains("wall") &&
        !topRightCollisionDec.classList.contains("wall")
      ) {
        enemiesTop--;
        enemy.style.top = enemiesTop + "px";
      } else {
        enemiesDirection = Math.ceil(Math.random() * 4);
      }
    } else if (enemiesDirection == 3) {
      let leftCollision = position.left - 1;
      let lTopCollisionDec = document.elementFromPoint(
        leftCollision,
        position.top
      );
      let lBottomCollisionDec = document.elementFromPoint(
        leftCollision,
        position.bottom
      );
      if (
        !lTopCollisionDec.classList.contains("wall") &&
        !lBottomCollisionDec.classList.contains("wall")
      ) {
        enemieLeft--;
        enemy.style.left = enemieLeft + "px";
      } else {
        enemiesDirection = Math.ceil(Math.random() * 4);
      }
    } else if (enemiesDirection == 4) {
      let rightCollision = position.right + 1;
      let rTopCollisionDec = document.elementFromPoint(
        rightCollision,
        position.top
      );
      let rBottomCollisionDec = document.elementFromPoint(
        rightCollision,
        position.bottom
      );

      if (
        !rTopCollisionDec.classList.contains("wall") &&
        !rBottomCollisionDec.classList.contains("wall")
      ) {
        enemieLeft++;
        enemy.style.left = enemieLeft + "px";
      } else {
        enemiesDirection = Math.ceil(Math.random() * 4);
      }
    }
  }, 1);
}