/* eslint-disable quotes */
/* eslint-disable eqeqeq */
/* eslint-disable no-else-return */
/* eslint-disable operator-linebreak */
const gridCells = Array.from(document.querySelectorAll(".grid-cell"));
const player1 = document.getElementById("player-1");
const player2 = document.getElementById("player-2");
const modal = document.querySelector(".modal");
const submitButton = document.querySelector(".submit-button");
const closeButton = document.querySelector(".close-modal");
const start = document.querySelector(".start");

start.addEventListener("click", () => {
  modal.showModal();
});

closeButton.addEventListener("click", () => {
  modal.close();
});

submitButton.addEventListener("click", () => {
  gameDetails.setNames(player1, player2);
});

const gameDetails = (() => {
  let player1Name = "";
  let player2Name = "";
  let turns = 0;
  const setNames = (player1, player2) => {
    player1Name = player1.value;
    player2Name = player2.value;
  };
  const setTurns = () => {
    turns += 1;
  };
  const getNames = () => [player1Name, player2Name];
  const getTurns = () => turns;
  return { setNames, setTurns, getNames, getTurns };
})();

const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];
  const update = (position, symbol) => board.splice(position, 1, symbol);
  const findWinner = (symbol) => {
    if (
      (board[0] == symbol && board[1] == symbol && board[2] == symbol) ||
      (board[3] == symbol && board[4] == symbol && board[5] == symbol) ||
      (board[6] == symbol && board[7] == symbol && board[8] == symbol)
    ) {
      return true;
    } else if (
      (board[0] == symbol && board[4] == symbol && board[8] == symbol) ||
      (board[2] == symbol && board[4] == symbol && board[6] == symbol)
    ) {
      return true;
    } else if (
      (board[0] == symbol && board[3] == symbol && board[6] == symbol) ||
      (board[1] == symbol && board[4] == symbol && board[7] == symbol) ||
      (board[2] == symbol && board[5] == symbol && board[8] == symbol)
    ) {
      return true;
    } else {
      return false;
    }
  };
  const checkMoveAvailability = () => board.some((pos) => pos == "");
  const display = () => {
    for (let i = 0; i < board.length; i += 1) {
      gridCells[i].textContent = board[i];
    }
  };
  return { update, findWinner, checkMoveAvailability, display };
})();

const player = (name, symbol) => {
  let mostRecentChoice = "";
  const getName = () => name;
  const setChoice = (position) => {
    mostRecentChoice = position;
  };
  const getChoice = () => mostRecentChoice;
  const getSymbol = () => symbol;
  return { getName, getChoice, setChoice, getSymbol };
};

window.addEventListener("load", gameBoard.display);

/* gridCells.forEach((gridCell) => {
  gridCell.addEventListener("click", getChoice);
}); */

function getPosition(e) {
  return e.target.dataset.pos;
}

function playRound(e) {
  const position = getPosition(e);
  player.setChoice(position);
  const symbol = player.getSymbol();
  gameBoard.update(position, symbol);
  displayBoard();
}
