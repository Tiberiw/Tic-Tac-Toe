
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
        const setCellSign = (row,column,sign) => { board[row*3 + column].textContent = sign; board[row*3 + column].classList.add(sign); };
    
        const setCellSignIndex = (index,sign) => { board[index].textContent = sign; board[index].classList.add(sign); }

        const getCellSign = (row,column) => board[row*3 + column].textContent;

        const getCellSignIndex = (index) => board[index].textContent;
    
        return {setCellSign, getCellSign, board, initBoard, checkStatus, boardContainer, setCellSignIndex, getCellSignIndex};
    
    })();

    resetButton.addEventListener('click', () => {
        reset();
    });

    const aiBrain = (function() {

        let origBoard = []
        let humanPlayer;
        let aiPlayer;
        const initAiBoard = () => {
            origBoard.splice(0,origBoard.length);
            for(let i = 0; i < 9; i++)
                origBoard.push(i);
            if(player1.getName() === "A.I.")
                aiPlayer = player1.getSign(), humanPlayer = player2.getSign();
            else
                aiPlayer = player2.getSign(), humanPlayer = player1.getSign();
        }

        function emptyIndexies (board) {
            return board.filter( s => s != "O" && s != "X");  
        }

        function winning(board, player) {
            if(
                (board[0] == player && board[1] == player && board[2] == player) ||
                (board[3] == player && board[4] == player && board[5] == player) ||
                (board[6] == player && board[7] == player && board[8] == player) ||
                (board[0] == player && board[3] == player && board[6] == player) ||
                (board[1] == player && board[4] == player && board[7] == player) ||
                (board[2] == player && board[5] == player && board[8] == player) ||
                (board[0] == player && board[4] == player && board[8] == player) ||
                (board[2] == player && board[4] == player && board[6] == player)
            ) {
                return true;
            } else {
                return false;
            }
        }

        function minimax(newBoard, player) {

            let availSpots = emptyIndexies(newBoard);

            if(winning(newBoard,aiPlayer)) {
                return {score:10};
            } else if(winning(newBoard,humanPlayer)) {
                return {score:-10};
            } else if(availSpots.length === 0){
                return {score:0};
            }

            let moves = [];

            for(let i = 0; i < availSpots.length; i++) {
                let move = {};

                move.index = newBoard[availSpots[i]];

                newBoard[availSpots[i]] = player;


                if(player == aiPlayer) {
                    let result = minimax(newBoard,humanPlayer);
                    move.score = result.score;
                }
                else {
                    let result = minimax(newBoard,aiPlayer);
                    move.score = result.score;
                }
    
    
                newBoard[availSpots[i]] = move.index;
    
                moves.push(move);

            }
                
           


            let bestMove;
            if(player === aiPlayer) {
                let bestScore = -100000;
                for(let i = 0; i < moves.length; i++) {
                    if(bestScore < moves[i].score) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                        
                }
            }else {
                let bestScore = 100000;
                for(let i = 0; i < moves.length; i++) {
                    if(bestScore > moves[i].score) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            }
            return moves[bestMove];
        }

        return {initAiBoard, minimax, origBoard};
    })();


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
        if(gameMode === "A.I.") {
            aiBrain.initAiBoard();
        }
        Gameboard.board.forEach( (cell) => {
            cell.addEventListener('click', () => {

                

                if(Gameboard.getCellSign(Number(cell.getAttribute("data-row")), Number(cell.getAttribute("data-column"))) === "" && play) {

                    /* Set the Board Coresponding to the Right Player */
                    Gameboard.setCellSign(Number(cell.getAttribute("data-row")), Number(cell.getAttribute("data-column")) , currentPlayer.getSign());
                    
                    let row = Number(cell.getAttribute("data-row"));
                    let column = Number(cell.getAttribute("data-column"));

                    aiBrain.origBoard[row*3 + column] = currentPlayer.getSign(); 

                    if(++roundsPlayed >= 5 && Gameboard.checkStatus()) {
                        displayWinner(currentPlayer);
                        play = false;
                    } else if(roundsPlayed === 9) {
                        displayDraw();
                        play = false;
                    } else {
                        changePlayer();
                        displayTurn();
                        if(gameMode === "A.I.") {
                            if(currentPlayer.getName() === "A.I.") {
                                
                                let move = aiBrain.minimax(aiBrain.origBoard, currentPlayer.getSign());
                                let index = move.index;
                                Gameboard.setCellSignIndex(index, currentPlayer.getSign());
                                aiBrain.origBoard[index] = currentPlayer.getSign();
                                
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
                        
                        }

                        
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
        if(gameMode === "A.I.") {
            console.log("VAA")
            aiBrain.initAiBoard();
        }
    }

    const run = () => {
       
        homeButton.addEventListener('click', () => {
            reset();
            Gameboard.boardContainer.innerHTML = "";
            inputGameType();
        });
        inputGameType();
    }


    return {run,aiBrain};

})()

Gamelogic.run();

