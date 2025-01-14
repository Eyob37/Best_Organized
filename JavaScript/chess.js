const chessboard = document.getElementById('chessboard');
const timerElement = document.getElementById('timer');
const audio = document.getElementById('myAudio');
let selectedPiece = null;
let currentPlayer = 'darkred'; // Start with white player

// Define initial pieces setup
const initialBoardSetup = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
];

// Piece colors
const pieceColors = {
    '♜': 'black', '♞': 'black', '♝': 'black', '♛': 'black', '♚': 'black', '♟': 'black',
    '♖': 'darkred', '♘': 'darkred', '♗': 'darkred', '♕': 'darkred', '♔': 'darkred', '♙': 'darkred'
};

function initializeChessboard() {
    chessboard.innerHTML = '';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.classList.add((row + col) % 2 === 0 ? 'white' : 'black');
            square.dataset.row = row;
            square.dataset.col = col;
            chessboard.appendChild(square);

            // Place pieces
            const piece = initialBoardSetup[row][col];
            if (piece !== '') {
                const pieceElement = document.createElement('div');
                pieceElement.classList.add('piece');
                pieceElement.classList.add(pieceColors[piece]);
                pieceElement.textContent = piece;
                pieceElement.dataset.piece = piece;
                pieceElement.dataset.row = row;
                pieceElement.dataset.col = col;
                square.appendChild(pieceElement);
            }

            // Add click event
            square.addEventListener('click', handleSquareClick);
        }
    }
}

function handleSquareClick(event) {
    const square = event.currentTarget;
    const pieceElement = square.querySelector('.piece');

    if (selectedPiece) {
        if (square === selectedPiece.parentElement) {
            // Deselect the piece
            selectedPiece.classList.remove('selected');
            selectedPiece = null;
        } else {
            const fromRow = parseInt(selectedPiece.dataset.row);
            const fromCol = parseInt(selectedPiece.dataset.col);
            const toRow = parseInt(square.dataset.row);
            const toCol = parseInt(square.dataset.col);
            
            const isValidMove = validateMove(selectedPiece.dataset.piece, fromRow, fromCol, toRow, toCol);
            const isCapture = isCapturef(selectedPiece.dataset.piece, fromRow, fromCol, toRow, toCol)
            if (isValidMove) {
            if (isCapture) {
    const targetPiece = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"] .piece`);
    if (targetPiece) {
        targetPiece.remove(); // Remove the captured piece from the board
    }
}
                // Move the piece
                square.appendChild(selectedPiece);
                selectedPiece.parentElement.classList.remove('selected');
                selectedPiece.classList.remove('selected');
                selectedPiece.dataset.row = toRow;
                selectedPiece.dataset.col = toCol;
                selectedPiece = null;

                // Play move sound
                audio.play();

                // Switch player turn
                currentPlayer = currentPlayer === 'darkred' ? 'black' : 'black';
            } else {
                // Invalid move, deselect piece
                selectedPiece.classList.remove('selected');
                selectedPiece = null;
            }
        }
    } else if (pieceElement && pieceColors[pieceElement.textContent] === currentPlayer) {
        // Select the piece
        selectedPiece = pieceElement;
        selectedPiece.classList.add('selected');
    }
}

function validateMove(piece, fromRow, fromCol, toRow, toCol) {
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;
    const targetPiece = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"] .piece`);

    switch (piece) {
        case '♟': // White pawn
            if (colDiff === 0 && rowDiff === 1 && !isdouble(toRow, toCol, piece)) return true; // Move one square forward                    
            else if ((colDiff === 1 || colDiff == -1) && rowDiff === 1 && isSquareOccupied(toRow, toCol, 'black')) return true; // Capture diagonally
            else if (fromRow === 1 && colDiff === 0 && rowDiff === 2 && !isdouble(toRow, toCol, piece)) return true; // Move two squares forward from starting position
            break;
        case '♙': // Black pawn
            if (colDiff === 0 && rowDiff === -1 && !isdouble(toRow, toCol, piece)) return true; // Move one square forward
            else if ((colDiff === 1 || colDiff == -1) && rowDiff === -1 && isSquareOccupied(toRow, toCol, 'black')) return true; // Capture diagonally
            if (fromRow === 6 && colDiff === 0 && rowDiff === -2 && !isdouble(toRow, toCol, piece)) return true; // Move two squares forward from starting position
            break;
        case '♖':
        case '♜': // Rook moves
            if (colDiff === 0 || rowDiff === 0) {
                if (isPathClear(fromRow, fromCol, toRow, toCol) && !isdouble(toRow, toCol, piece)) return true;
            }
            break;
        case '♘':
        case '♞': // Knight moves
            if (((Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) || (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2)) && !isdouble(toRow, toCol, piece)) return true;
            break;
        case '♗':
        case '♝': // Bishop moves
            if (Math.abs(rowDiff) === Math.abs(colDiff)) {
                if (isPathClear(fromRow, fromCol, toRow, toCol) && !isdouble(toRow, toCol, piece)) return true;
            }
            break;
        case '♕':
        case '♛': // Queen moves
            if ((Math.abs(rowDiff) === Math.abs(colDiff) || colDiff === 0 || rowDiff === 0) && !isdouble(toRow, toCol, piece)) {
                if (isPathClear(fromRow, fromCol, toRow, toCol)) return true;
            }
            break;
        case '♔':
        case '♚': // King moves
            if (Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1 && !isdouble(toRow, toCol, piece)) return true;
            break;
    }
    return false;
}
function isCapturef(piece, fromRow, fromCol, toRow, toCol) {
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;
    const targetPiece = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"] .piece`);

    if (!targetPiece || pieceColors[targetPiece.textContent] === currentPlayer) {
        // No piece to capture or trying to capture own piece
        return false;
    }

    switch (piece) {
        case '♟': // White pawn
            return (colDiff === 1 || colDiff === -1) && rowDiff === 1;

        case '♙': // Black pawn
            return (colDiff === 1 || colDiff === -1) && rowDiff === -1;

        case '♖':
        case '♜': // Rook captures
            return (colDiff === 0 || rowDiff === 0) && isPathClear(fromRow, fromCol, toRow, toCol);

        case '♘':
        case '♞': // Knight captures
            return (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) || (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2);

        case '♗':
        case '♝': // Bishop captures
            return Math.abs(rowDiff) === Math.abs(colDiff) && isPathClear(fromRow, fromCol, toRow, toCol);

        case '♕':
        case '♛': // Queen captures
            return (Math.abs(rowDiff) === Math.abs(colDiff) || colDiff === 0 || rowDiff === 0) && isPathClear(fromRow, fromCol, toRow, toCol);

        case '♔':
        case '♚': // King captures
            return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1;

        default:
            return false;
    }
}
function isdouble(toRow, toCol, piece) {
    const pieceElement = document.querySelector(`[data-row="${toRow}"][data-col="${toCol}"] .piece`);
    if (pieceElement && pieceColors[pieceElement.textContent] == currentPlayer) {
        return true;
    }
    if(piece == '♟' || piece == '♙') {
      if (pieceElement && pieceColors[pieceElement.textContent] != currentPlayer) {
        return true;
        }  
    }else {
       return false; 
    }
   
}
function isSquareOccupied(row, col, color = null) {
    const square = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    const pieceElement = square && square.querySelector('.piece');

    if (pieceElement && pieceColors[pieceElement.textContent] != currentPlayer) {
        return true;
    }
        
    // If no piece is found on the square, return false   
    else{ 
        return false;
    }
}
function isPathClear(fromRow, fromCol, toRow, toCol) {
    const rowStep = Math.sign(toRow - fromRow);
    const colStep = Math.sign(toCol - fromCol);

    let row = fromRow + rowStep;
    let col = fromCol + colStep;

    while (row !== toRow || col !== toCol) {
    const pieceElement = document.querySelector(`[data-row="${row}"][data-col="${col}"] .piece`);    
        if (pieceElement){
        return false;
        }
        row += rowStep;
        col += colStep;
    }
    return true;
}

function updateTimer() {
    let time = 600; // 10 minutes in seconds
    const interval = setInterval(() => {
        if (time <= 0) {
            clearInterval(interval);
            timerElement.textContent = '00:00';
            return;
        }
        const mins = Math.floor(time / 60);
        const secs = time % 60;
        timerElement.textContent = `${("0" + mins).slice(-2)}:${("0" + secs).slice(-2)}`;
        time--;
    }, 1000);
}

initializeChessboard();
updateTimer();
