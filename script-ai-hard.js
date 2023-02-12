const gridCells = Array.from(document.querySelectorAll(".grid-cell"));
const restart = document.querySelector(".restart");
const grid = document.querySelector(".grid");
const result = document.querySelector(".result"); 
const displayTurn = document.querySelector(".announce-turn"); 

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
let board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const update = (position, symbol) => board.splice(position, 1, symbol);
const checkForWinner = (array,symbol) => {
    if (
    (array[0] == symbol && array[1] == symbol && array[2] == symbol) ||
    (array[3] == symbol && array[4] == symbol && array[5] == symbol) ||
    (array[6] == symbol && array[7] == symbol && array[8] == symbol)
    ) {
    return true;
    } else if (
    (array[0] == symbol && array[4] == symbol && array[8] == symbol) ||
    (array[2] == symbol && array[4] == symbol && array[6] == symbol)
    ) {
    return true;
    } else if (
    (array[0] == symbol && array[3] == symbol && array[6] == symbol) ||
    (array[1] == symbol && array[4] == symbol && array[7] == symbol) ||
    (array[2] == symbol && array[5] == symbol && array[8] == symbol)
    ) {
    return true;
    } else {
    return false;
    }
};
const resetBoard = () => board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const resetDisplay = () => {
    gridCells.forEach(cell => cell.textContent = "");
}
const getBoard = () => board;
return { update, checkForWinner, resetDisplay, resetBoard, getBoard };
})();

const findWinner = (() => {
    const gameWinner = () => {
        if ((!gameBoard.checkForWinner(gameBoard.getBoard(),"X") && !gameBoard.checkForWinner(gameBoard.getBoard(),"O"))  && roundDetails.getTurns() == 9){
            restart.classList.add("start-after-refresh");
            grid.classList.add("no-pointer-events");
            displayTurn.textContent = "";
            result.textContent = "Result: It's a tie!";
            return true
        }else if (gameBoard.checkForWinner(gameBoard.getBoard(),"X")){
            restart.classList.add("start-after-refresh");
            grid.classList.add("no-pointer-events");
            displayTurn.textContent = "";
            result.textContent ="Result: YOU win!";
            return true
        }else if (gameBoard.checkForWinner(gameBoard.getBoard(),"O")){
            restart.classList.add("start-after-refresh");
            grid.classList.add("no-pointer-events");
            displayTurn.textContent = "";
            result.textContent ="Result: AI wins!";
            return true;
        }
        }

    const minMaxWinner = (state) => {
        if (gameBoard.checkForWinner(state,"X") || gameBoard.checkForWinner(state,"O")){
            return true;
        }else{
            return false ;
        }
    } 
    return {gameWinner, minMaxWinner};
})()
    
function emptyIndexes(state){
    return state.filter(s => s != "O" && s != "X");
  }

function minimax(state,symbol){
    const availableSpots = emptyIndexes(state);
    if (findWinner.minMaxWinner(state) && symbol == "X"){
        return {score: -10};
    }else if (findWinner.minMaxWinner(state) && symbol == "O"){
        return {score: 10};
    }
    else if (availableSpots.length == 0){
        return {score: 0};
    }

    let moves = [];

    for (let i = 0; i<availableSpots.length; i+=1){
        const move= {};
        move.index = state[availableSpots[i]];
    
        state[availableSpots[i]] = symbol;

        if(symbol == "X"){
            let result = minimax(state,"O")
            move.score = result.score;
        }else if (symbol == "O"){
            let result = minimax(state,"X")
            move.score = result.score;
        }
        state[availableSpots[i]] = move.index;
        moves.push(move);
    }

    let bestMove;
    if(symbol == "O"){
        let bestScore = 10000;
        for (let i = 0; i< moves.length; i+=1){
            if (moves[i].score < bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }else if (symbol == "X"){
        let bestScore = -10000;
        for (let i = 0; i< moves.length; i+=1){
            if (moves[i].score > bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

window.addEventListener("load", setInitialState);

function setInitialState(){
    displayTurn.textContent = "It's YOUR turn!";
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

function markCell (e,position) {
    roundDetails.setTurns();
    gameBoard.update(position, "X");
    e.target.textContent = "X";
}

function markAiChoice(){
    roundDetails.setTurns();
    const bestChoice = minimax(gameBoard.getBoard(),"O").index;
    gridCells[bestChoice].textContent= "O";
    gameBoard.update(bestChoice,"O");
}

function markPlayerChoice(e){
    const position = getPosition(e);
    markCell(e,position);
}

function playRound(e) {
    if (e.target.textContent!= ""){
      return;
    }
      markPlayerChoice(e)
      grid.classList.add("no-pointer-events");
      if(findWinner.gameWinner()){
          return;
      }
      setTimeout(() =>{  /* Add delay to computer's choice for extra realism */
          markAiChoice();
          grid.classList.remove("no-pointer-events");
          if(findWinner.gameWinner()){
              return;
          }
          announceTurn();
      },100);
      if(findWinner.gameWinner()){
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
    gameBoard.resetDisplay();
    restart.classList.remove("start-after-refresh");
    grid.classList.remove("no-pointer-events");
    result.textContent = "Result: "
    displayTurn.textContent = "It's YOUR turn!";
}    

restart.addEventListener("click" , restartGame);