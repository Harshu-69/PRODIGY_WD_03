const boxes = document.querySelectorAll(".box");
const resetGameBtn = document.querySelector(".resetBtn");
const winnerText = document.querySelector(".winner");
const msgContainer = document.querySelector(".msgContainer");
const newBtnContainer = document.querySelector(".newBtn");
const gameContainer = document.querySelector("#container");

const newGameBtn = document.createElement("button");
const changeModeBtn = document.createElement("button");
const modePicker = document.createElement("div");
const friendModeBtn = document.createElement("button");
const aiModeBtn = document.createElement("button");

const winningPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const HUMAN = "O";
const AI = "X";
let isGameOver = false;
let currentTurn = "O";
let gameMode = null; // "friend" | "ai"

newGameBtn.innerText = "New Game";
changeModeBtn.innerText = "Change Mode";
friendModeBtn.innerText = "Play With Friend";
aiModeBtn.innerText = "Play With AI";

modePicker.style.display = "none";
modePicker.style.margin = "12px auto";
modePicker.style.textAlign = "center";
modePicker.style.display = "flex";
modePicker.style.justifyContent = "center";
modePicker.style.gap = "10px";

friendModeBtn.style.padding = "8px 12px";
aiModeBtn.style.padding = "8px 12px";

modePicker.append(friendModeBtn, aiModeBtn);
if (gameContainer) {
  gameContainer.parentNode.insertBefore(modePicker, gameContainer);
}

const getBoard = () => Array.from(boxes).map((box) => box.innerText);

const enableBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
    box.classList.remove("winning");
    box.style.color = "";
  });
};

const disableBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = true;
  });
};

const showNewGameBtn = () => {
  if (!newBtnContainer.contains(newGameBtn)) {
    newBtnContainer.append(newGameBtn);
  }
};

const hideNewGameBtn = () => {
  if (newBtnContainer.contains(newGameBtn)) {
    newGameBtn.remove();
  }
};

const showChangeModeBtn = () => {
  if (!newBtnContainer.contains(changeModeBtn)) {
    newBtnContainer.append(changeModeBtn);
  }
};

const getWinnerInfo = (board) => {
  for (const pattern of winningPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return { winner: board[a], pattern };
    }
  }
  return null;
};

const isTie = (board) => board.every((cell) => cell !== "");

const endGame = (message, pattern = null) => {
  isGameOver = true;
  winnerText.innerText = message;
  msgContainer.classList.remove("hide");

  if (pattern) {
    pattern.forEach((index) => boxes[index].classList.add("winning"));
  }

  disableBoxes();
  showNewGameBtn();
};

const evaluateGameState = () => {
  const board = getBoard();
  const winnerInfo = getWinnerInfo(board);

  if (winnerInfo) {
    endGame(`Winner is ${winnerInfo.winner}`, winnerInfo.pattern);
    return true;
  }

  if (isTie(board)) {
    endGame("Game is Tie");
    return true;
  }

  return false;
};

const getBestMove = (board) => {
  for (let i = 0; i < board.length; i++) {
    if (board[i] !== "") continue;
    board[i] = AI;
    if (getWinnerInfo(board)?.winner === AI) {
      board[i] = "";
      return i;
    }
    board[i] = "";
  }

  for (let i = 0; i < board.length; i++) {
    if (board[i] !== "") continue;
    board[i] = HUMAN;
    if (getWinnerInfo(board)?.winner === HUMAN) {
      board[i] = "";
      return i;
    }
    board[i] = "";
  }

  if (board[4] === "") return 4;

  const corners = [0, 2, 6, 8].filter((idx) => board[idx] === "");
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];

  const edges = [1, 3, 5, 7].filter((idx) => board[idx] === "");
  return edges.length ? edges[Math.floor(Math.random() * edges.length)] : -1;
};

const aiMove = () => {
  if (isGameOver || gameMode !== "ai") return;

  const board = getBoard();
  const move = getBestMove(board);
  if (move === -1) return;

  boxes[move].innerText = AI;
  boxes[move].style.color = "#1abc9c";
  boxes[move].disabled = true;

  if (!evaluateGameState()) {
    currentTurn = HUMAN;
  }
};

const onBoxClick = (box) => {
  if (isGameOver || !gameMode || box.innerText !== "") {
    return;
  }

  if (gameMode === "friend") {
    box.innerText = currentTurn;
    box.style.color = currentTurn === "O" ? "#27ae60" : "#1abc9c";
    box.disabled = true;

    if (evaluateGameState()) return;

    currentTurn = currentTurn === "O" ? "X" : "O";
    return;
  }

  if (gameMode === "ai") {
    if (currentTurn !== HUMAN) return;

    box.innerText = HUMAN;
    box.style.color = "#27ae60";
    box.disabled = true;

    if (evaluateGameState()) return;

    currentTurn = AI;
    setTimeout(aiMove, 250);
  }
};

const resetGame = () => {
  isGameOver = false;
  currentTurn = "O";
  enableBoxes();
  msgContainer.classList.add("hide");
  winnerText.innerText = "";
  hideNewGameBtn();

  if (!gameMode) {
    disableBoxes();
  }
};

const chooseMode = (mode) => {
  gameMode = mode;
  modePicker.style.display = "none";
  resetGame();
};

const showModePicker = () => {
  gameMode = null;
  modePicker.style.display = "flex";
  resetGame();
};

boxes.forEach((box) => {
  box.addEventListener("click", () => onBoxClick(box));
});

friendModeBtn.addEventListener("click", () => chooseMode("friend"));
aiModeBtn.addEventListener("click", () => chooseMode("ai"));

resetGameBtn.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", resetGame);
changeModeBtn.addEventListener("click", showModePicker);

showChangeModeBtn();
showModePicker();
