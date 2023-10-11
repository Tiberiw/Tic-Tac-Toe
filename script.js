
/* Player Factory Function */
const playerFactory = (name, sign) => {

    let playerNa = name
    const getName = () => playerNa;
    const getSign = () => sign;
    const setName = (newName) => { playerNa = newName};

    return {getName, getSign, setName};
}

/* Gamelogic Module */
const Gamelogic = (function(){

    let gameMode = "normal";
    /* Node for the turn text field */
    const displayTurnField = document.querySelector('.turn');

    const homeButton = document.querySelector('button.home');

    /* Reset Game Button */
    const resetButton = document.querySelector('button.reset');     

    /* GET  The 2 players. In the future input their names */
    const player1 = playerFactory("PlayerX", "X");
    const player2 = playerFactory("PlayerO", "O");

    /* Refference to the current player */
    let currentPlayer = player1;

    /* Play Status and Rounds Played */
    let play = true;
    let roundsPlayed = 0;


    const sendButton = document.querySelector('button[type="submit"]');
    const divInput = document.querySelector('div.getNames');
    const divGameType = document.querySelector('div.input-game');
    const aiButton = document.querySelector('button.vs-ai');
    const playerButton = document.querySelector('button.vs-player');

    const inputNames = () => {

        displayTurnField.textContent = "Choose names:"
        Gameboard.boardContainer.style.display = "none";
        divInput.style.display = "flex";
        document.querySelector('input#playerx').value = "";
        document.querySelector('input#playero').value = "";
        sendButton.addEventListener('click', (e) => {
            e.preventDefault();
            let playerXName = document.querySelector('input#playerx').value;
            let playerOName = document.querySelector('input#playero').value;

            if(playerXName == "")
                playerXName = "X";
            if(playerOName == "")
                playerOName = "O";

            player1.setName(playerXName);
            player2.setName(playerOName);

            divInput.style.display = "none";
            Gameboard.boardContainer.style.display = "grid";
            resetButton.style.display = "inline";
            
            init();
        });
    }

    const inputNamesAI = () => {
        displayTurnField.textContent = "Choose your name:"
        Gameboard.boardContainer.style.display = "none";
        divInput.style.display = "flex";

        let userInput = document.querySelector('input#playerx')
        userInput.value = "";
        let aiInput = document.querySelector('input#playero')
        aiInput.value = "A.I.";
        /* BAAA */
        // document.querySelector('label#playero').style.display = "none"
        // aiInput.style.display = "none";


        sendButton.addEventListener('click', (e) => {
            e.preventDefault();
            let playerXName = document.querySelector('input#playerx').value;
            let playerOName = "A.I.";

            if(playerXName == "")
                playerXName = "X";
            if(playerOName == "")
                playerOName = "O";

            player1.setName(playerXName);
            player2.setName(playerOName);

            divInput.style.display = "none";
            Gameboard.boardContainer.style.display = "grid";
            resetButton.style.display = "inline";
            
            init();
        });


    }

    const inputGameType = () => {
        divGameType.style.display = "grid";
        resetButton.style.display = "none";
        displayTurnField.textContent = "Choose Game Type:"
        divInput.style.display = "none";
        Gameboard.boardContainer.style.display = "none";

        aiButton.addEventListener('click', () => {
            divGameType.style.display = "none";
            gameMode = "A.I.";
            inputNamesAI();
        });

        playerButton.addEventListener('click', () => {
            divGameType.style.display = "none";
            gameMode = "normal";
            inputNames();
        });
    }

    /* Gameboard Module */
    const Gameboard = (function(){

        const boardContainer = document.querySelector('.board');
        const board = [];

        /* Initialise the board */
        const initBoard = () => {
                boardContainer.innerHTML = "";
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
        const setCellSign = (row,column,sign) => { board[row*3 + column].textContent = sign; board[row*3 + column].classList.add(sign) ; };
    
        const getCellSign = (row,column) => board[row*3 + column].textContent;
    
        return {setCellSign, getCellSign, board, initBoard, checkStatus, boardContainer};
    
    })();

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
        const string = `${winner.getName()} won!`
        displayTurnField.textContent = string;
    }

    /* Display Draw */
    const displayDraw = () => {
        const string = "It's a draw!"
        displayTurnField.textContent = string;
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
            cell.classList.remove("O");
            cell.classList.remove("X");
        })
        roundsPlayed = 0;
        play = true;
    }

    const run = () => {
       
        homeButton.addEventListener('click', () => {
            reset();
            Gameboard.boardContainer.innerHTML = "";
            inputGameType();
        });
        inputGameType();
    }


    return {run};

})()

Gamelogic.run();

