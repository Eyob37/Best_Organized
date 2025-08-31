//JavaScript code
function abc() {    
      window.location.href = 'checkerl.html';         
}
function countdown(t,de) {
        var timerElement = document.getElementById('timer');
        var interval = setInterval(function() {
            if (t > 0 && HM()) {
              var mins = Math.floor(t / 60);
              var secs = t % 60;
              var timer = ("0" + mins).slice(-2) + ":" + ("0" + secs).slice(-2);
            timerElement.textContent = timer;
            if(de == 0) {t--;}
            else {t++;}                
            } else {
            alert("time is completed"+t);
                clearInterval(interval);
                timerElement.textContent = '00:00';                
                           
                 }
        }, 1000);
    }
var audio = document.getElementById("myAudio"); 
var aou = 0;
function mute() {
            audio.muted = !audio.muted;
            if (aou%2 == 0) {
              document.getElementById("audiom").src="./img/audiooff.jpg"; // Toggle mute  
            }
           else{
               document.getElementById("audiom").src="./img/audioon.jpg"; // Toggle mute
           }
           aou++;
        }
let firstStarter = Math.floor(Math.random()* 2)+1;
const chessboard = document.getElementById('chessboard');
let selectedChecker = null;
let currentPlayer = ''; 
 firstStarter == 1 ? currentPlayer = 'p1':currentPlayer = 'p2';// Start with the brown player
// Generate the chessboard and place checkers pieces
function generateChessboard() {
audio.pause(); // Pause the audio first
audio.currentTime = 0;
s=0;
let co1 = document.getElementById("bcolorPicker").value;
let co2 = document.getElementById("rcolorPicker").value;
    chessboard.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((i + j) % 2 === 0 ? 'white' : 'black');
            square.dataset.row = i;
            square.dataset.col = j;
            chessboard.appendChild(square);

            // Add click event to the square
            square.addEventListener('click', onSquareClick);
            // Place the checkers pieces on the board
            if ((i + j) % 2 !== 0) { // Checkers pieces are placed only on black squares
                if (i < 3) { // Top three rows for one player
                    const checker = document.createElement('div');
                    checker.classList.add('checker');
                    checker.classList.add('p1');
                    checker.dataset.player = 'p1';
                    checker.style.background = co1;                                
                    square.appendChild(checker);
                } else if (i > 4) { // Bottom three rows for the other player
                    const checker = document.createElement('div');
                    checker.classList.add('checker');
                    checker.classList.add('p2');                    
                    checker.dataset.player = 'p2';
                    checker.style.background = co2;
                    square.appendChild(checker);
                }
            }
        }
    }
}
let s = 0;
let b = 0;
let r = 0;
function HM(){    
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
        const m = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
        const c = m.children[0];
            if(m.children.length != 0) {
               if(c.dataset.player == "p1") {
                   b++;
               }else if(c.dataset.player == "p2"){
                   r++;
               } 
            }
        }
    }
    document.getElementById("HMR").innerHTML = "player2 ="+r;
    document.getElementById("HMB").innerHTML ="player1 ="+b;
    if(b == 0 || r == 0) {
        b == 0 ? alert("The player2 is win") : alert("The player1 is win");
        s = 0
        generateChessboard();
        return false;
        
    }
    b = 0;
    r = 0;
    return true;
}

// Promote a checker to a king
function promoteToKing(checker) {
    checker.classList.add('king');
    let co1 = document.getElementById("kbcolorPicker").value;
    let co2 = document.getElementById("krcolorPicker").value;
    if (checker.dataset.player === "p1") {
        checker.style.background = co1;
    }    
    else{
        checker.style.background = co2;
    }
}

// Handle click event on a square
function onSquareClick(event) {
    const square = event.currentTarget;

    if (selectedChecker) {
        const selectedSquare = selectedChecker.parentElement;
        const selectedRow = parseInt(selectedSquare.dataset.row);
        const selectedCol = parseInt(selectedSquare.dataset.col);
        const targetRow = parseInt(square.dataset.row);
        const targetCol = parseInt(square.dataset.col);        
        const rowDifference = targetRow - selectedRow;
        const colDifference = Math.abs(targetCol - selectedCol);
        const isKing = selectedChecker.classList.contains('king');

        // Check for standard capture
        const isCapture = colDifference === 2 && ((rowDifference === 2 && selectedChecker.dataset.player === "p1")|| (rowDifference === -2 && selectedChecker.dataset.player === "p2")) && square.children.length === 0;
        const isKCapture = isKing && colDifference == 2 && Math.abs(rowDifference) == 2  && square.children.length === 0;
        const middleRow = (selectedRow + targetRow) / 2;
        const middleCol = (selectedCol + targetCol) / 2;
        const middleSquare = document.querySelector(`[data-row="${middleRow}"][data-col="${middleCol}"]`);
        const isOpponentPiece = middleSquare && middleSquare.children.length > 0 && middleSquare.children[0].dataset.player !== currentPlayer;

        // Determine if the piece is a king
        
        // Regular move or capture for regular pieces
        const isValidMove =
            (square.children.length === 0 && colDifference === 1 && // Regular move
            ((selectedChecker.dataset.player === 'p1' && rowDifference === 1) || // Brown checkers move forward
             (selectedChecker.dataset.player === 'p2' && rowDifference === -1))) || // Red checkers move backward
            (isCapture && isOpponentPiece);

        // Valid move for kings (diagonal in any direction)
        const isValidKingMove =
            (isKing && colDifference === 1 && Math.abs(rowDifference) === 1 && square.children.length === 0) || // Kings move diagonally in any direction
            (isKCapture && isOpponentPiece);

        // Check for double capture
        const isDoubleCapture = (isCapture || isKCapture) &&  checkForDoubleCapture(targetRow, targetCol, selectedChecker);

        if (isValidMove || isValidKingMove) {
            // Handle capture
            if (isCapture || isKCapture) {
                middleSquare.removeChild(middleSquare.children[0]); // Remove captured checker
            }

            // Move selected checker to the new square
            selectedChecker.classList.remove('selected');
            square.appendChild(selectedChecker);
          //  square.appendChild(selectedChecker);

            // Promote to king if it reaches the specified row
            if ((targetRow === 7 && selectedChecker.dataset.player === 'p1') || 
                (targetRow === 0 && selectedChecker.dataset.player === 'p2')) {
                promoteToKing(selectedChecker);
                console.log(`Checker promoted to king at (${targetRow}, ${targetCol})`);
            }

            // Handle double capture
            if (isDoubleCapture) {
                // Keep the checker selected for another move
                console.log(`Double capture possible at (${targetRow}, ${targetCol})`);
            } else {
                selectedChecker = null; // Deselect after moving

                // Switch player turn
                currentPlayer = currentPlayer === 'p1' ? 'p2' : 'p1';
            }
        } else {
            selectedChecker.classList.remove('selected'); // Deselect if move is invalid
            selectedChecker = null;
        }
    } else if (square.children.length > 0 && square.children[0].classList.contains('checker')) {
        // Select the checker if not already selected and it's the correct player's turn
        const checker = square.children[0];
        if (checker.dataset.player === currentPlayer) {
            selectedChecker = checker;
            selectedChecker.classList.add('selected');
        }
    }
   if(s == 0) {
       audio.play();
       console.log("audio played");
       countdown(parseInt(1),1);       
       HM();
       s++;
   }     
        
        
}

// Check for the possibility of a double capture
function checkForDoubleCapture(row, col, checker) {
    if(selectedChecker.dataset.player === "p1" || checker.classList.contains("king")) {
    
    const directions = [
        { rowDiff: 2, colDiff: 2 },
        { rowDiff: 2, colDiff: -2 },
        
    ];
    for (const direction of directions) {
        const newRow = row + direction.rowDiff;
        const newCol = col + direction.colDiff;
        const middleRow = (row + newRow) / 2;
        const middleCol = (col + newCol) / 2;
        const middleSquare = document.querySelector(`[data-row="${middleRow}"][data-col="${middleCol}"]`);
        const targetSquare = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);

        if (
            newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && // Ensure within board limits
            targetSquare && targetSquare.children.length === 0 && // Target square must be empty
            middleSquare && middleSquare.children.length > 0 && // Middle square must have an opponent piece
            middleSquare.children[0].dataset.player !== checker.dataset.player // Opponent piece
        ) {
            return true; // Double capture is possible
        }
    }
}    
    if(checker.classList.contains("king") || selectedChecker.dataset.player === "p2") {
        const directions = [       
        { rowDiff: -2, colDiff: 2 },
        { rowDiff: -2, colDiff: -2 },
    ];

    for (const direction of directions) {
        const newRow = row + direction.rowDiff;
        const newCol = col + direction.colDiff;
        const middleRow = (row + newRow) / 2;
        const middleCol = (col + newCol) / 2;
        const middleSquare = document.querySelector(`[data-row="${middleRow}"][data-col="${middleCol}"]`);
        const targetSquare = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);

        if (
            newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && // Ensure within board limits
            targetSquare && targetSquare.children.length === 0 && // Target square must be empty
            middleSquare && middleSquare.children.length > 0 && // Middle square must have an opponent piece
            middleSquare.children[0].dataset.player !== checker.dataset.player // Opponent piece
        ) {
            return true; // Double capture is possible
        }
    }
  }  
    return false;
}

window.addEventListener("beforeunload", () => {
    audio.pause();
    audio.currentTime = 0;
});

// Initialize the chessboard
generateChessboard();
