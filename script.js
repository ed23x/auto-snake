const boardSize = 20;
const gameBoard = document.getElementById('game-board');
let snake = [{x: 10, y: 10}];
let food = {x: 5, y: 5};
let dx = 1, dy = 0;
let gameRunning = true;

function initBoard() {
  for (let i = 0; i < boardSize * boardSize; i++) {
    const square = document.createElement('div');
    gameBoard.appendChild(square);
  }
}

function updateBoard() {
  document.querySelectorAll('#game-board > div').forEach(div => div.className = '');
  snake.forEach(part => {
    const index = part.y * boardSize + part.x;
    gameBoard.children[index].classList.add('snake');
  });
  const foodIndex = food.y * boardSize + food.x;
  gameBoard.children[foodIndex].classList.add('food');
}

function moveSnake() {
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    placeFood();
  } else {
    snake.pop();
  }
  if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize || snake.slice(1).some(part => part.x === head.x && part.y === head.y)) {
    gameRunning = false;
  }
}

function placeFood() {
  let newFoodPos;
  do {
    newFoodPos = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize)
    };
  } while (snake.some(part => part.x === newFoodPos.x && part.y === newFoodPos.y));
  food = newFoodPos;
}

function aiBot() {
  const head = snake[0];
  let newDx = dx;
  let newDy = dy;

  function willCollide(nextX, nextY) {
    return (nextX < 0 || nextX >= boardSize || nextY < 0 || nextY >= boardSize || snake.slice(1).some(part => part.x === nextX && part.y === nextY));
  }

  if (food.x > head.x && !willCollide(head.x + 1, head.y)) {
    newDx = 1; newDy = 0;
  } else if (food.x < head.x && !willCollide(head.x - 1, head.y)) {
    newDx = -1; newDy = 0;
  } else if (food.y > head.y && !willCollide(head.x, head.y + 1)) {
    newDx = 0; newDy = 1;
  } else if (food.y < head.y && !willCollide(head.x, head.y - 1)) {
    newDx = 0; newDy = -1;
  }

  if (willCollide(head.x + newDx, head.y + newDy)) {
    if (!willCollide(head.x, head.y + 1)) {
      newDx = 0; newDy = 1;
    } else if (!willCollide(head.x, head.y - 1)) {
      newDx = 0; newDy = -1;
    } else if (!willCollide(head.x + 1, head.y)) {
      newDx = 1; newDy = 0;
    } else if (!willCollide(head.x - 1, head.y)) {
      newDx = -1; newDy = 0;
    }
  }
  dx = newDx;
  dy = newDy;
}

function gameLoop() {
  if (gameRunning) {
    aiBot();
    moveSnake();
    updateBoard();
    setTimeout(gameLoop, 200);
  } else {
    alert("Game Over!");
  }
}

initBoard();
placeFood();
updateBoard();
gameLoop();
