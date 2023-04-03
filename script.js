const blockSize = 20;
const boardWidth = 10;
const boardHeight = 20;
const board = [];
let shape;
let shapeX;
let shapeY;

function setup() {
  createCanvas(blockSize * boardWidth, blockSize * boardHeight);
  for (let y = 0; y < boardHeight; y++) {
    board[y] = [];
    for (let x = 0; x < boardWidth; x++) {
      board[y][x] = 0;
    }
  }
  shape = createRandomShape();
  shapeX = floor(boardWidth / 2) - floor(shape[0].length / 2);
  shapeY = 0;
}

function drawBoard() {
  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      if (board[y][x]) {
        fill(0);
      } else {
        fill(255);
      }
      rect(x * blockSize, y * blockSize, blockSize, blockSize);
      stroke(200);
      strokeWeight(1);
    }
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    if (!collision(-1, 0)) {
      shapeX--;
    }
  } else if (keyCode === RIGHT_ARROW) {
    if (!collision(1, 0)) {
      shapeX++;
    }
  } else if (keyCode === DOWN_ARROW) {
    if (!collision(0, 1)) {
      shapeY++;
    }
  } else if (keyCode === UP_ARROW) {
    const rotatedShape = rotateShape(shape);
    if (!collision(0, 0, rotatedShape)) {
      shape = rotatedShape;
    }
  }
}

function rotateShape(s) {
  const rows = s.length;
  const cols = s[0].length;
  const result = [];

  for (let x = 0; x < cols; x++) {
    result[x] = [];
    for (let y = 0; y < rows; y++) {
      result[x][y] = s[rows - 1 - y][x];
    }
  }
  return result;
}


const shapes = [
  [
    [1, 1, 1],
    [0, 1, 0],
  ],
  [
    [1, 1, 1, 1],
  ],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ],
  [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ],
];

function createRandomShape() {
  const shape = shapes[floor(random(0, shapes.length))];
  return shape;
}

function drawShape() {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        fill(0);
        rect((shapeX + x) * blockSize, (shapeY + y) * blockSize, blockSize, blockSize);
      }
    }
  }
}

// Check for collisions
function collision(offsetX, offsetY, s = shape) {
  for (let y = 0; y < s.length; y++) {
    for (let x = 0; x < s[y].length; x++) {
      if (s[y][x]) {
        const newX = shapeX + x + offsetX;
        const newY = shapeY + y + offsetY;
        if (newX < 0 || newX >= boardWidth || newY >= boardHeight || board[newY][newX]) {
          return true;
        }
      }
    }
  }
  return false;
}

// Lock shape to the board and check for line completion
function lockShapeToBoard() {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        board[shapeY + y][shapeX + x] = 1;
      }
    }
  }

  // Check for completed lines and remove them
  for (let y = boardHeight - 1; y >= 0; ) {
    let isLineComplete = true;
    for (let x = 0; x < boardWidth; x++) {
      if (!board[y][x]) {
        isLineComplete = false;
        break;
      }
    }

    if (isLineComplete) {
      board.splice(y, 1);
      board.unshift(new Array(boardWidth).fill(0));
    } else {
      y--;
    }
  }
}

// Game loop
let prevDropTime = 0;
const dropInterval = 500;

function gameLoop() {
  const currentTime = millis();

  if (currentTime - prevDropTime > dropInterval) {
    if (!collision(0, 1)) {
      shapeY++;
    } else {
      lockShapeToBoard();
      shape = createRandomShape();
      shapeX = floor(boardWidth / 2) - floor(shape[0].length / 2);
      shapeY = 0;

      if (collision(0, 0)) {
        console.log("Game Over!");
        noLoop();
      }
    }
    prevDropTime = currentTime;
  }
}

function draw() {
  background(255);
  drawBoard();
  drawShape();
  gameLoop();
}