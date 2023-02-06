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
const displayTurn = document.querySelector(".announce-turn"); 

start.addEventListener("click", () => {
  modal.showModal();
});

closeButton.addEventListener("click", () => {
  modal.close();
  player1Modal.value = "";
  player2Modal.value = "";
});

function removePointerEvents() {
  grid.classList.add("no-pointer-events");
  restart.classList.add("no-pointer-events");
}

function addPointerEvents() {
  grid.classList.remove("no-pointer-events");
  restart.classList.remove("no-pointer-events");
}

submitButton.addEventListener("click", () => {
  currentPlayers.setPlayer1(player1Modal);
  currentPlayers.setPlayer2(player2Modal);
  start.classList.add("no-pointer-events");
  start.classList.remove("start-after-refresh");
  addPointerEvents();
  roundDetails.setCurrentPlayer(currentPlayers.getPlayer1());
  displayTurn.textContent = "It's "+ roundDetails.getCurrentPlayer().getName()+"'s "+ "turn!";
});

restart.addEventListener("click",restartGame)

function restartGame() {
  roundDetails.resetTurns();
  gameBoard.resetBoard();
  gameBoard.display();
  restart.classList.remove("start-after-refresh");
  grid.classList.remove("no-pointer-events");
  result.textContent = "Result: "
  roundDetails.setCurrentPlayer(currentPlayers.getPlayer1());
  displayTurn.textContent = "It's "+ roundDetails.getCurrentPlayer().getName()+"'s "+ "turn!";
}

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
  return { update, checkForWinner, display, resetBoard };
})();

const player = (name, symbol) => {
  const getName = () => name;
  const getSymbol = () => symbol;
  return { getName, getSymbol };
};

window.addEventListener("load", setInitialState);

function setInitialState(){
  gameBoard.display();
  removePointerEvents();
  start.classList.add("start-after-refresh");
}

function findWinner () {
  if (!gameBoard.checkForWinner(roundDetails.getCurrentPlayer().getSymbol()) && roundDetails.getTurns() == 9){
    restart.classList.add("start-after-refresh");
    grid.classList.add("no-pointer-events");
    displayTurn.textContent = "";
    result.textContent = "Result: It's a tie!";
    return true
  }else if (gameBoard.checkForWinner(roundDetails.getCurrentPlayer().getSymbol()) && roundDetails.getCurrentPlayer().getSymbol() == "X"){
    restart.classList.add("start-after-refresh");
    grid.classList.add("no-pointer-events");
    displayTurn.textContent = "";
    result.textContent ="Result: " + roundDetails.getCurrentPlayer().getName() + " wins!";
    return true
  }else if (gameBoard.checkForWinner(roundDetails.getCurrentPlayer().getSymbol()) && roundDetails.getCurrentPlayer().getSymbol() == "O"){
    restart.classList.add("start-after-refresh");
    grid.classList.add("no-pointer-events");
    displayTurn.textContent = "";
    result.textContent ="Result: " + roundDetails.getCurrentPlayer().getName() + " wins!";
    return true;
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
    roundDetails.setTurns();
    gameBoard.update(position, symbol);
    gameBoard.display();
  }else{
    findCurrentPlayer(); /*If the cell is already marked then it changes the current player so that
                           when gridCell event listener is triggered again it will swap back to the correct player  */
  }
}

function announceTurn(){
  if (roundDetails.getCurrentPlayer()==currentPlayers.getPlayer1()){
    displayTurn.textContent= "It's "+ currentPlayers.getPlayer2().getName()+"'s "+"turn!";
  }else{
    displayTurn.textContent= "It's "+ currentPlayers.getPlayer1().getName()+"'s "+"turn!";
  }
}

function playRound(e) {
  if(roundDetails.getTurns() == 0){
    const position = getPosition(e);
    const symbol = roundDetails.getCurrentPlayer().getSymbol();
    markCell(e,symbol,position);
    announceTurn()
  }else{
    findCurrentPlayer();
    const position = getPosition(e);
    const symbol = roundDetails.getCurrentPlayer().getSymbol();
    markCell(e,symbol,position);
    if(findWinner()){
      return;
    }
    announceTurn();
  }
  
}

gridCells.forEach((gridCell) => {
  gridCell.addEventListener("click", playRound);
});