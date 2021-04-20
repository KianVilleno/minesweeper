function createBombs(numberOfBombs) {
  let bombs = 0;
  while (bombs != numberOfBombs) {
    let cell =
      field.matrix[floor(random(field.rows))][floor(random(field.cols))];
    if (!cell.bomb) {
      bombs++;
      cell.bomb = true;
    }
  }
}

function mousePressed() {
  if (gameState) {
    for (let i = 0; i < field.rows; i++) {
      for (let j = 0; j < field.cols; j++) {
        let cell = field.matrix[i][j];
        let x = cell.x;
        let y = cell.y;
        let volume = cell.size;
        if (
          mouseX > x &&
          mouseX < x + volume &&
          mouseY > y &&
          mouseY < y + volume
        ) {
          moves++;
          revealCell(cell);
        }
      }
    }
  }
}

function checkForWinner() {
  let overall = field.rows * field.cols;
  let bombs = 0;
  let cellsrevealed = 0;

  for (let i = 0; i < field.rows; i++) {
    for (let j = 0; j < field.cols; j++) {
      let cell = field.matrix[i][j];
      if (cell.bomb) bombs++;
      if (cell.revealed) cellsrevealed++;
    }
  }

  let winning_state = overall - bombs;

  if (cellsrevealed == winning_state) gameWon();
}

function gameWon() {
  console.log("You Win!");
  moves_label.hide();
  bomb_count_label.hide();
  tryagain_label.show();
  you_win_label.show();
  gameState = false;
  for (let i = 0; i < field.rows; i++) {
    for (let j = 0; j < field.cols; j++) {
      cell = field.matrix[i][j];
      cell.color = "#c4fb6d";
      cell.revealed = true;
      cell.value = checkNeighbors(cell);
    }
  }
}

function revealCell(cell) {
  cell.revealed = true;
  if (!cell.bomb) {
    cell.color = "#d4b5b0";
    cell.value = checkNeighbors(cell);

    if (cell.value == 0) {
      floodFill(cell);
    }
  } else {
    GameOver(cell);
  }
  checkForWinner();
}

function GameOver(c) {
  console.log("bomb!");
  gameState = false;
  for (let i = 0; i < field.rows; i++) {
    for (let j = 0; j < field.cols; j++) {
      cell = field.matrix[i][j];
      cell.color = "#ffbcbc";
      cell.revealed = true;
      cell.value = checkNeighbors(cell);
    }
  }
  c.color = "#fa1616";
  moves_label.hide();
  bomb_count_label.hide();
  tryagain_label.show();
}

function floodFill(cell) {
  //current cell c_
  let c_i = cell.i;
  let c_j = cell.j;

  let neighborCount = 0;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      //neightbor n_
      let n_i = c_i + i;
      let n_j = c_j + j;

      if (n_i >= 0 && n_i < field.rows && n_j >= 0 && n_j < field.cols) {
        let neighbor = field.matrix[n_i][n_j];

        if (!neighbor.bomb && !neighbor.revealed) {
          revealCell(neighbor);
        }
      }
    }
  }
}

function checkNeighbors(cell) {
  //current cell c_
  let c_i = cell.i;
  let c_j = cell.j;

  let neighborCount = 0;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      //neightbor n_
      let n_i = c_i + i;
      let n_j = c_j + j;

      if (n_i >= 0 && n_i < field.rows && n_j >= 0 && n_j < field.cols) {
        let neighbor = field.matrix[n_i][n_j];

        if (neighbor.bomb) {
          neighborCount++;
        }
      }
    }
  }

  return neighborCount;
}

class MATRIX {
  constructor(rows, cols, size) {
    this.rows = rows;
    this.cols = cols;
    this.size = size;
    this.matrix = new Array(this.rows);
    this.createMatrix();
  }
  createMatrix() {
    for (let i = 0; i < this.matrix.length; i++) {
      this.matrix[i] = new Array(this.cols);
    }

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j] = new CELL(i, j, this.size);
      }
    }
  }
  show() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j].show();
      }
    }
  }

  countBombs() {
    let bombs_count = 0;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.matrix[i][j].bomb == true) {
          bombs_count++;
        }
      }
    }
    return bombs_count;
  }
}

class CELL {
  constructor(i, j, size) {
    this.i = i;
    this.j = j;
    this.x = i * size;
    this.y = j * size;
    this.size = size;
    this.color = "#eeee";

    this.value = 0;
    this.bomb = false;
    this.revealed = false;
  }
  show() {
    fill(this.color);
    strokeWeight(2);
    stroke("#383e56");
    rect(this.x, this.y, this.size, this.size);

    if (this.bomb && this.revealed) {
      fill("#f69e7b");
      noStroke();
      ellipse(
        this.x + this.size / 2,
        this.y + this.size / 2,
        this.size / 2,
        this.size / 2
      );
    }

    if (this.value && this.revealed && !this.bomb) {
      noStroke();
      fill("black");
      textSize(20);
      textAlign(CENTER, CENTER);
      text(this.value, this.x, this.y, this.size, this.size);
    }
  }
}

function AI() {
  let cell = field.matrix[floor(random(field.rows))][floor(random(field.cols))];
  if (!cell.bomb && !cell.revealed) {
    revealCell(cell);
  } else {
    AI();
  }
}

function restartGame() {
  moves = 0;
  moves_label.show();
  you_win_label.hide();
  bomb_count_label.show();
  tryagain_label.hide();
  bomb_count_label.html(`bombs: ${field.countBombs()}`);
  moves_label.html(`moves: ${moves}`);
  newGame();
  gameState = true;
}
