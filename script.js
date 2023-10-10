
/* Player Factory Function */
const playerFactory = (name, sign) => {

    const getName = () => name;
    const getSign = () => sign;

    return {getName, getSign};
}

/* Gamelogic Module */
const Gamelogic = (function(){

    /* GET  The 2 players. In the future input their names */
    const player1 = playerFactory("Player1", "X");
    const player2 = playerFactory("Player2", "O");

    /* Refference to the current player */
    let currentPlayer = player1;

    /* Play Status and Rounds Played */
    let play = true;
    let roundsPlayed = 0;

    /* Gameboard Module */
    const Gameboard = (function(){

        const boardContainer = document.querySelector('.board');
        const board = [];

        /* Initialise the board */
        const initBoard = () => {
    
                board.splice(0, board.length);

                for(let i = 0; i < 3; i++) 
                    for(let j = 0; j < 3; j++) {
                        const cell = document.createElement('div');
                        cell.classList.add(`cell-${i*3 + j}`);
                        cell.setAttribute("data-row", i);
                        cell.setAttribute("data-column", j);
                        boardContainer.appendChild(cell);
                        board.push(cell);
                }

        }
    

        /* Check The Status of The Board */
        const checkStatus = () => {

            // 0 1 2
            // 3 4 5
            // 6 7 8
            
            /* CHECK ROWS AND COLUMNS */
            for(let i = 0; i < 3; i++) {

                /* ROWS */
                if(board[i*3].textContent === board[i*3 + 1].textContent &&
                    board[i*3 + 1].textContent === board[i*3 + 2].textContent &&
                    board[i*3].textContent !== "") {
                        return true;
                    }
                    
                
                /* COLUMNS */
                if(board[i].textContent === board[i+3].textContent &&
                    board[i+3].textContent === board[i+6].textContent &&
                    board[i].textContent !== "")
                    return true;
            }

            /* CHECK DIAGONALS */
            if(board[0].textContent === board[4].textContent && 
                board[4].textContent === board[8].textContent &&
                board[0].textContent !== "")
                return true;

            if(board[2].textContent === board[4].textContent && 
                board[4].textContent === board[6].textContent &&
                board[2].textContent !== "")
                return true;


            return false;
        }
    
        /* i*3 + j */
        /*Setters and Getters */
        const setCellSign = (row,column,sign) => { board[row*3 + column].textContent = sign };
    
        const getCellSign = (row,column) => board[row*3 + column].textContent;
    
        return {setCellSign, getCellSign, board, initBoard, checkStatus};
    
    })();

    /* Node for the turn text field */
    const displayTurnField = document.querySelector('.turn');

    /* Reset Game Button */
    const resetButton = document.querySelector('button.reset');
    resetButton.addEventListener('click', () => {
        reset();
    });

    /* Change Current Player */
    const changePlayer = () => {
        if(currentPlayer === player1)
            currentPlayer = player2;
        else
            currentPlayer = player1;
    }

    /* Display Player's Turn */
    const displayTurn = () => {
        displayTurnField.textContent = `${currentPlayer.getName()}'s turn!`;
    }

    /* Display Winner */
    const displayWinner = (winner) => {
        displayTurnField.textContent = `${winner.getName()} won!`;
    }

    /* Display Draw */
    const displayDraw = () => {
        displayTurnField.textContent = "It's a draw!";
    }


    /* Initialise Game Logic */
    const init = () => {
        Gameboard.initBoard();
        displayTurn();
        Gameboard.board.forEach( (cell) => {
            cell.addEventListener('click', () => {
                if(Gameboard.getCellSign(Number(cell.getAttribute("data-row")), Number(cell.getAttribute("data-column"))) === "" && play) {

                    /* Set the Board Coresponding to the Right Player */
                    Gameboard.setCellSign(Number(cell.getAttribute("data-row")), Number(cell.getAttribute("data-column")) , currentPlayer.getSign());
                    
                    if(++roundsPlayed >= 5 && Gameboard.checkStatus()) {
                        displayWinner(currentPlayer);
                        play = false;
                    } else if(roundsPlayed === 9) {
                        displayDraw();
                        play = false;
                    } else {
                        changePlayer();
                        displayTurn();
                    }
                    
                    
                }
             
            });
        });
    }

    /* Reset / Restart Game */
    const reset = () => {
        currentPlayer = player1;
        displayTurn();
        Gameboard.board.forEach( (cell) => {
            cell.textContent = "";
        })
        roundsPlayed = 0;
        play = true;
    }

    return {init};

})()

Gamelogic.init();

