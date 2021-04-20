let COLS = 10;
let ROWS = 10;
let SIZE = 40;

let moves = 0;

let field;
let gameState = true;

let bomb_count_label;
let moves_label;
let tryagain_label;
let you_win_label;

function setup() {
  if (COLS * SIZE >= window.innerWidth) {
    COLS = Math.floor(window.innerWidth / SIZE) - 1;
    COLS = COLS % 2 === 1 ? COLS - 1 : COLS;
    ROWS = COLS;

    console.log(COLS, ROWS);
  }
  createCanvas(ROWS * SIZE, COLS * SIZE);
  newGame();

  bomb_count_label = createP(`bombs: ${field.countBombs()}`);
  moves_label = createP(`moves: ${moves}`);
  you_win_label = createP(`you win!`);
  tryagain_label = createP(`try again!`);
  you_win_label.hide();
  tryagain_label.hide();
  tryagain_label.mouseClicked(() => {
    restartGame();
  });
}

function newGame() {
  gameState = true;
  //making the field;
  field = new MATRIX(ROWS, COLS, SIZE);
  //creating random bombs;
  // createBombs(
  //   floor(random(Math.floor(COLS * 0.5), Math.floor((COLS * ROWS) / 2)))
  // );

  createBombs(1);
}

function draw() {
  background("#383e56");
  field.show();
  moves_label.html(`moves: ${moves}`);
}
