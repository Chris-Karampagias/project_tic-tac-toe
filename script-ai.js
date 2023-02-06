const gridCells = Array.from(document.querySelectorAll(".grid-cell"));
const restart = document.querySelector(".restart");
const grid = document.querySelector(".grid");
const result = document.querySelector(".result"); 
const displayTurn = document.querySelector(".announce-turn"); 

function removePointerEvents() {
    grid.classList.add("no-pointer-events");
    restart.classList.add("no-pointer-events");
}

function addPointerEvents() {
    grid.classList.remove("no-pointer-events");
    restart.classList.remove("no-pointer-events");
}

const roundDetails = (() => {
    let currentPlayer;
    let turns = 0;
    const setCurrentPlayer = (player) => currentPlayer = player;
    const getCurrentPlayer = () => currentPlayer; 
    const setTurns = () => {
      turns += 1;
    };
    const resetTurns = () => turns = 0;
    const getTurns = () => turns;
    return { setTurns, getTurns, setCurrentPlayer, getCurrentPlayer, resetTurns };
  })();

const gameBoard = (() => {
let board = ["", "", "", "", "", "", "", "", ""];
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
const resetBoard = () => board = ["", "", "", "", "", "", "", "", ""];
const getBoard = () => board;
return { update, checkForWinner, display, resetBoard, getBoard };
})();

window.addEventListener("load", setInitialState);

function setInitialState(){
    gameBoard.display();
}

function getAiChoice(){
    let i;
    do{
         i = Math.floor(Math.random(0,1)*9);
    }while (gameBoard.getBoard()[i] != "")
    return i;
}


