/* eslint-disable quotes */
/* eslint-disable eqeqeq */
/* eslint-disable no-else-return */
/* eslint-disable operator-linebreak */
const gridCells = Array.from(document.querySelectorAll(".grid-cell"));
const player1Modal = document.getElementById("player-1");
const player2Modal = document.getElementById("player-2");
const modal = document.querySelector(".modal");
const submitButton = document.querySelector(".submit-button");
const closeButton = document.querySelector(".close-modal");
const start = document.querySelector(".start");
const restart = document.querySelector(".restart");
const grid = document.querySelector(".grid");
const result = document.querySelector(".result"); 

start.addEventListener("click", () => {
  modal.showModal();
});

closeButton.addEventListener("click", () => {
  modal.close();
});

function addPointerEvents() {
  grid.classList.add("no-pointer-events");
  restart.classList.add("no-pointer-events");
}

function removePointerEvents() {
  grid.classList.remove("no-pointer-events");
  restart.classList.remove("no-pointer-events");
}

submitButton.addEventListener("click", () => {
  currentPlayers.setPlayer1(player1Modal);
  currentPlayers.setPlayer2(player2Modal);
  removePointerEvents();
});

const currentPlayers = (() => {
  let player1;
  let player2;
  const setPlayer1 = (name1) => player1 = player(name1.value, "X");
  const setPlayer2 = (name2) => player2 = player(name2.value, "O");
  const getPlayer1 = () => player1;
  const getPlayer2 = () => player2;
  return {setPlayer1, setPlayer2, getPlayer1, getPlayer2};
})()

function createPlayers(p1,p2) {
  player1 = player(p1.value,"X");
  player2 = player(p2.value,"O");
}

const roundDetails = (() => {
  let currentPlayer;
  let turns = 0;
  const setCurrentPlayer = (player) => currentPlayer = player;
  const getCurrentPlayer = () => currentPlayer; 
  const setTurns = () => {
    turns += 1;
  };
  const getTurns = () => turns;
  return { setTurns, getTurns, setCurrentPlayer, getCurrentPlayer };
})();

const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];
  const update = (position, symbol) => board.splice(position, 1, symbol);
  const checkForWinner = (symbol) => {
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
  const display = () => {
    for (let i = 0; i < board.length; i += 1) {
      gridCells[i].textContent = board[i];
    }
  };
  return { update, checkForWinner, display };
})();

const player = (name, symbol) => {
  const getName = () => name;
  const getSymbol = () => symbol;
  return { getName, getSymbol };
};

window.addEventListener("load", setInitialState );

function setInitialState(){
  gameBoard.display();
  addPointerEvents();
}

function findWinner () {
  if (!gameBoard.checkForWinner(roundDetails.getCurrentPlayer().getSymbol()) && roundDetails.getTurns() == 9){
    result.textContent = "It's a tie!";
  }else if (gameBoard.checkForWinner(roundDetails.getCurrentPlayer().getSymbol()) && roundDetails.getCurrentPlayer().getSymbol() == "X"){
    result.textContent ="Result: " + roundDetails.getCurrentPlayer().getName().toUpperCase() + " WINS!";
  }else if (gameBoard.checkForWinner(roundDetails.getCurrentPlayer().getSymbol()) && roundDetails.getCurrentPlayer().getSymbol() == "O"){
    result.textContent ="Result: " + roundDetails.getCurrentPlayer().getName().toUpperCase() + " WINS!";
  }
} 

function findCurrentPlayer () {
  if (roundDetails.getCurrentPlayer() == currentPlayers.getPlayer1()){
    roundDetails.setCurrentPlayer(currentPlayers.getPlayer2())
  }else{
    roundDetails.setCurrentPlayer(currentPlayers.getPlayer1())
  }
}

function getPosition(e) {
  return e.target.dataset.pos;
}

function markCell (e,symbol,position) {
  if (e.target.textContent == ""){
    e.target.textContent = symbol;
    roundDetails.setTurns();
    gameBoard.update(position, symbol);
    gameBoard.display();
  }else{
    findCurrentPlayer();
  }
}

function playRound(e) {
  findCurrentPlayer();
  const position = getPosition(e);
  const symbol = roundDetails.getCurrentPlayer().getSymbol();
  markCell(e,symbol,position);
  findWinner();
}

gridCells.forEach((gridCell) => {
  gridCell.addEventListener("click", playRound);
});