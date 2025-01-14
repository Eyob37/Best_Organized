const chessboard = document.getElementById('chessboard');
let selectedChecker = null;
let currentPlayer = 'brown'; // Start with the brown player

// Generate the chessboard and place checkers pieces
function generateChessboard() {
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
                    checker.classList.add('brown');
                    checker.dataset.player = 'brown';
                    square.appendChild(checker);
                } else if (i > 4) { // Bottom three rows for the other player
                    const checker = document.createElement('div');
                    checker.classList.add('checker');
                    checker.classList.add('red');                    
                    checker.dataset.player = 'red';
                    square.appendChild(checker);
                }
            }
        }
    }
}

// Promote a checker to a king
function promoteToKing(checker) {
    checker.classList.add('king');
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
        const isCapture = colDifference === 2 && ((rowDifference === 2 && selectedChecker.dataset.player === "brown")|| (rowDifference === -2 && selectedChecker.dataset.player === "red")) && square.children.length === 0;
        const isKCapture = isKing && colDifference === 2 && Math.abs(rowDifference) === 2 && square.children.length === 0;
        const middleRow = (selectedRow + targetRow) / 2;
        const middleCol = (selectedCol + targetCol) / 2;
        const middleSquare = document.querySelector(`[data-row="${middleRow}"][data-col="${middleCol}"]`);
        const isOpponentPiece = middleSquare && middleSquare.children.length > 0 && middleSquare.children[0].dataset.player !== currentPlayer;

        // Determine if the piece is a king
        
        // Regular move or capture for regular pieces
        const isValidMove =
            (square.children.length === 0 && colDifference === 1 && // Regular move
            ((selectedChecker.dataset.player === 'brown' && rowDifference === 1) || // Brown checkers move forward
             (selectedChecker.dataset.player === 'red' && rowDifference === -1))) || // Red checkers move backward
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

            // Promote to king if it reaches the specified row
            if ((targetRow === 7 && selectedChecker.dataset.player === 'brown') || 
                (targetRow === 0 && selectedChecker.dataset.player === 'red')) {
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
                currentPlayer = currentPlayer === 'brown' ? 'red' : 'brown';
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
}

// Check for the possibility of a double capture
function checkForDoubleCapture(row, col, checker) {
    if(selectedChecker.dataset.player === "brown" || checker.classList.contains("king")) {
    
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
    if(checker.classList.contains("king") || selectedChecker.dataset.player === "red") {
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

// Initialize the chessboard
generateChessboard();