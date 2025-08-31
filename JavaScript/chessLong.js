function abc() {    
    window.location.href = 'checker.html';         
}

function countdown(t, de) {
    var timerElement = document.getElementById('timer');
    var interval = setInterval(function() {
        if (t > 0 && HM()) {
            var mins = Math.floor(t / 60);
            var secs = t % 60;
            var timer = ("0" + mins).slice(-2) + ":" + ("0" + secs).slice(-2);
            timerElement.textContent = timer;
            if (de == 0) { t--; }
            else { t++; }                
        } else {
            alert("time is completed");
            clearInterval(interval);
            timerElement.textContent = '00:00';                           
        }
    }, 1000);
}

var audio = document.getElementById("myAudio"); 
var aou = 0;

function mute() {
    audio.muted = !audio.muted;
    if (aou % 2 == 0) {
        document.getElementById("audiom").src = "./img/audiooff.jpg";
    } else {
        document.getElementById("audiom").src = "./img/audioon.jpg";
    }
    aou++;
}

let firstStarter = Math.floor(Math.random() * 2) + 1;
const chessboard = document.getElementById('chessboard');
let selectedChecker = null;
let currentPlayer = '';
firstStarter == 1 ? currentPlayer = 'p1' : currentPlayer = 'p2';

// Generate the chessboard and place checkers pieces
function generateChessboard() {
    audio.pause();
    audio.currentTime = 0;
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
            if ((i + j) % 2 !== 0) {
                if (i < 3) {
                    const checker = document.createElement('div');
                    checker.classList.add('checker');
                    checker.classList.add('p1');
                    checker.dataset.player = 'p1';
                    checker.style.background = co1;
                    square.appendChild(checker);
                } else if (i > 4) {
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

// Promote a checker to a king
function promoteToKing(checker) {
    checker.classList.add('king');
    let co1 = document.getElementById("kbcolorPicker").value;
    let co2 = document.getElementById("krcolorPicker").value;
    if (checker.dataset.player === "p1") {
        checker.style.background = co1;
    } else {
        checker.style.background = co2;
    }
}

// Check if the king's move path is valid
function isValidKingMovePath(startRow, startCol, endRow, endCol, checker) {
    const rowDirection = endRow > startRow ? 1 : -1;
    const colDirection = endCol > startCol ? 1 : -1;
    let captureFound = false;
    
    let currentRow = startRow + rowDirection;
    let currentCol = startCol + colDirection;

    while (currentRow !== endRow && currentCol !== endCol) {
        const square = document.querySelector(`[data-row="${currentRow}"][data-col="${currentCol}"]`);

        if (square.children.length > 0) {
            if (captureFound || square.children[0].dataset.player === checker.dataset.player) {
                return false;
            } else if (square.children[0].dataset.player !== checker.dataset.player) {               
                captureFound = true;
            }
        }
        
        currentRow += rowDirection;
        currentCol += colDirection;
    }
    
    const square = document.querySelector(`[data-row="${currentRow}"][data-col="${currentCol}"]`);
    if (startRow + rowDirection != currentRow && startCol + colDirection != currentCol && square.children.length > 0) {
        return false;         
    }
    
    return true;
}

let s = 0;
let b = 0;
let r = 0;

function HM() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const m = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
            if (m.children.length != 0) {
                const c = m.children[0];
                if (c.dataset.player == "p1") {
                    b++;
                } else if (c.dataset.player == "p2") {
                    r++;
                } 
            }
        }
    }
    
    document.getElementById("HMR").innerHTML = "the player2 =" + r;
    document.getElementById("HMB").innerHTML = "the player1 =" + b;
    
    if (b == 0 || r == 0) {
        b == 0 ? alert("The player2 is win") : alert("The player1 is win");
        s = 0;
        generateChessboard();
        return false;
    }
    
    b = 0;
    r = 0;
    return true;
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

        // Determine if the piece is a king
        const isKing = selectedChecker.classList.contains('king');
        
        // Check for regular capture
        const isCapture = Math.abs(rowDifference) === 2 && colDifference === 2 && square.children.length === 0;
        const middleRow = (selectedRow + targetRow) / 2;
        const middleCol = (selectedCol + targetCol) / 2;
        const middleSquare = document.querySelector(`[data-row="${middleRow}"][data-col="${middleCol}"]`);
        const isOpponentPiece = middleSquare && middleSquare.children.length > 0 && 
                               middleSquare.children[0].dataset.player !== currentPlayer;

        // Regular move or capture for regular pieces
        const isValidMove = (
            square.children.length === 0 && colDifference === 1 &&
            ((selectedChecker.dataset.player === 'p1' && rowDifference === 1) ||
             (selectedChecker.dataset.player === 'p2' && rowDifference === -1))
        ) || (isCapture && isOpponentPiece);

        // Valid move for kings (diagonal in any direction)
        const isValidKingMove = isKing && 
                               isValidKingMovePath(selectedRow, selectedCol, targetRow, targetCol, selectedChecker) && 
                               colDifference === Math.abs(rowDifference);

        // Check for double capture
        const isDoubleCapture = (isCapture || isValidKingMove) && 
                               checkForDoubleCapture(targetRow, targetCol, selectedChecker);

        if (isValidMove || isValidKingMove) {
            // Handle capture
            if (isCapture || isValidKingMove) {
                let currentRow = selectedRow;
                let currentCol = selectedCol;
                const rowStep = rowDifference > 0 ? 1 : -1;
                const colStep = targetCol > selectedCol ? 1 : -1;
                
                // Move along the diagonal path to find and remove captured pieces
                while (currentRow !== targetRow && currentCol !== targetCol) {
                    currentRow += rowStep;
                    currentCol += colStep;
                    
                    const pathSquare = document.querySelector(`[data-row="${currentRow}"][data-col="${currentCol}"]`);
                    
                    if (pathSquare.children.length > 0 && 
                        pathSquare.children[0].dataset.player !== selectedChecker.dataset.player) {
                        // Remove captured checker
                        pathSquare.removeChild(pathSquare.children[0]);
                    }
                }
            }

            // Move selected checker to the new square
            selectedChecker.classList.remove('selected');
            square.appendChild(selectedChecker);

            // Promote to king if it reaches the opposite end
            if ((targetRow === 7 && selectedChecker.dataset.player === 'p1') || 
                (targetRow === 0 && selectedChecker.dataset.player === 'p2')) {
                promoteToKing(selectedChecker);
            }

            // Handle double capture
            if (isDoubleCapture) {
                // Keep the checker selected for another capture
                selectedChecker.classList.add('selected');
                console.log(`Double capture possible at (${targetRow}, ${targetCol})`);
            } else {
                selectedChecker = null;
                // Switch player turn
                currentPlayer = currentPlayer === 'p1' ? 'p2' : 'p1';
            }
        } else {
            if (selectedChecker) {
                selectedChecker.classList.remove('selected');
            }
            selectedChecker = null;
        }
    } else if (square.children.length > 0 && square.children[0].classList.contains('checker')) {
        // Select the checker if it's the correct player's turn
        const checker = square.children[0];
        if (checker.dataset.player === currentPlayer) {
            selectedChecker = checker;
            selectedChecker.classList.add('selected');
        }
    }
    
    if (s == 0) {
        audio.play();
        console.log("audio played");
        countdown(parseInt(1), 1);
        HM();
        s++;
    }
}

// Improved function to check for double capture possibilities for kings
function checkForDoubleCapture(row, col, checker) {
    const directions = [
        { rowDiff: 2, colDiff: 2 },
        { rowDiff: 2, colDiff: -2 },
        { rowDiff: -2, colDiff: 2 },
        { rowDiff: -2, colDiff: -2 }
    ];
    
    const isKing = checker.classList.contains('king');
    
    for (const direction of directions) {
        const newRow = row + direction.rowDiff;
        const newCol = col + direction.colDiff;
        
        // Check if the target position is within the board
        if (newRow < 0 || newRow > 7 || newCol < 0 || newCol > 7) {
            continue;
        }
        
        const targetSquare = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
        
        // Target square must be empty
        if (targetSquare.children.length > 0) {
            continue;
        }
        
        // For kings, check the entire path
        if (isKing) {
            const rowDirection = direction.rowDiff > 0 ? 1 : -1;
            const colDirection = direction.colDiff > 0 ? 1 : -1;
            
            let currentRow = row + rowDirection;
            let currentCol = col + colDirection;
            let captureFound = false;
            let validPath = true;
            
            // Check each square along the path
            while (currentRow !== newRow && currentCol !== newCol) {
                const pathSquare = document.querySelector(`[data-row="${currentRow}"][data-col="${currentCol}"]`);
                
                if (pathSquare.children.length > 0) {
                    if (pathSquare.children[0].dataset.player === checker.dataset.player) {
                        // Cannot capture own piece
                        validPath = false;
                        break;
                    } else if (captureFound) {
                        // Already found a capture, cannot have multiple pieces in path
                        validPath = false;
                        break;
                    } else {
                        // Found an opponent piece to capture
                        captureFound = true;
                    }
                }
                
                currentRow += rowDirection;
                currentCol += colDirection;
            }
            
            if (validPath && captureFound) {
                return true;
            }
        } else {
            // For regular pieces
            const middleRow = row + direction.rowDiff / 2;
            const middleCol = col + direction.colDiff / 2;
            const middleSquare = document.querySelector(`[data-row="${middleRow}"][data-col="${middleCol}"]`);
            
            if (middleSquare && middleSquare.children.length > 0 && 
                middleSquare.children[0].dataset.player !== checker.dataset.player) {
                return true;
            }
        }
    }
    
    return false;
}

// Initialize the chessboard
generateChessboard();