const gridCells = Array.from(document.querySelectorAll(".grid-cell"));
const restart = document.querySelector(".restart");
const grid = document.querySelector(".grid");
const result = document.querySelector(".result"); 
const displayTurn = document.querySelector(".announce-turn"); 

const player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;
    return { getName, getSymbol };
  };

const currentPlayers = (() => {
    let player1;
    let player2;
    const setPlayer1 = (name1) => player1 = player(name1, "X");
    const setPlayer2 = (name2) => player2 = player(name2, "O");
    const getPlayer1 = () => player1;
    const getPlayer2 = () => player2;
    return {setPlayer1, setPlayer2, getPlayer1, getPlayer2};
  })()
  
  function createPlayers() {
    const player1 = player("You","X");
    const player2 = player("AI","O");
    currentPlayers.setPlayer1("You");
    currentPlayers.setPlayer2("AI");
  }

const roundDetails = (() => {
    let turns = 0;
    const setTurns = () => {
      turns += 1;
    };
    const resetTurns = () => turns = 0;
    const getTurns = () => turns;
    return { setTurns, getTurns,resetTurns };
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

function findWinner(){
    if (!gameBoard.checkForWinner(currentPlayers.getPlayer1().getSymbol()) && roundDetails.getTurns() == 9){
      restart.classList.add("start-after-refresh");
      grid.classList.add("no-pointer-events");
      displayTurn.textContent = "";
      result.textContent = "Result: It's a tie!";
      return true
    }else if (gameBoard.checkForWinner(currentPlayers.getPlayer1().getSymbol())){
      restart.classList.add("start-after-refresh");
      grid.classList.add("no-pointer-events");
      displayTurn.textContent = "";
      result.textContent ="Result: YOU win!";
      return true
    }else if (gameBoard.checkForWinner(currentPlayers.getPlayer2().getSymbol())){
      restart.classList.add("start-after-refresh");
      grid.classList.add("no-pointer-events");
      displayTurn.textContent = "";
      result.textContent ="Result: AI wins!";
      return true;
    }
  } 

window.addEventListener("load", setInitialState);

function setInitialState(){
    gameBoard.display();
    createPlayers();
    displayTurn.textContent = "It's YOUR turn!";
}

function getAiChoice(){
    let i;
    do{
         i = Math.floor(Math.random(0,1)*9); /* Generates a random number from 0 to 8 until it finds an empty cell in board with it's index as that number and then returns the number */
    }while (gameBoard.getBoard()[i] != "")
    return i;
}

function getPosition(e) {
return e.target.dataset.pos;
}

function announceTurn(){
if (displayTurn.textContent == "It's YOUR turn!"){
    displayTurn.textContent= "It's AI's turn!";
}else if (displayTurn.textContent= "It's AI's turn!"){
    displayTurn.textContent= "It's YOUR turn!";
}
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

function markAiChoice () {
    let choice = getAiChoice();
    let symbol = currentPlayers.getPlayer2().getSymbol();
    roundDetails.setTurns();
    gameBoard.update(choice, symbol);
    gameBoard.display();
}

function markPlayerChoice(e){
    const position = getPosition(e);
    let symbol = currentPlayers.getPlayer1().getSymbol();
    markCell(e,symbol,position);
}

function playRound(e) {
    markPlayerChoice(e)
    grid.classList.add("no-pointer-events");
    if(findWinner()){
        return;
    }
    setTimeout(() =>{  /* Add delay to computer's choice for extra realism */
        markAiChoice();
        grid.classList.remove("no-pointer-events");
        if(findWinner()){
            return;
        }
        announceTurn();
    },900);
    if(findWinner()){
        return;
    }
    announceTurn();
}


gridCells.forEach((gridCell) => {
gridCell.addEventListener("click", playRound);
});

function restartGame() {
  roundDetails.resetTurns();
  gameBoard.resetBoard();
  gameBoard.display();
  restart.classList.remove("start-after-refresh");
  grid.classList.remove("no-pointer-events");
  result.textContent = "Result: "
  displayTurn.textContent = "It's YOUR turn!";
}

restart.addEventListener("click", restartGame);