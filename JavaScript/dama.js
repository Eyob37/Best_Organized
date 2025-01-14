let selectedChecker = null;
let firstStarter = Math.floor(Math.random()* 2)+1;
let currentPlayer = ''; 
 firstStarter == 1 ? currentPlayer = 'p1':currentPlayer = 'p2';
 let board = ['p1', 'p1', 'p1', '', '', '', 'p2', 'p2', 'p2'];
const $ = (selector)=>{
   return document.getElementById(selector);
}

var inputs = [];
const I1 = $("I1");
const I2 = $("I2");
const I3 = $("I3");
const I4 = $("I4");
const I5 = $("I5");
const I6 = $("I6");
const I7 = $("I7");
const I8 = $("I8");
const I9 = $("I9");
inputs.push(I1,I2,I3,I4,I5,I6,I7,I8,I9);
function damagenerate() {
    for(let i = 0; i < inputs.length; i++){                      
        inputs[i].dataset.row = Math.floor(i / 3);  
        inputs[i].dataset.col = i % 3;    
        inputs[i].style.background = "white";   
        inputs[i].style.transform = "scale(1.0)";
        inputs[i].addEventListener('click', onCheckerClick);  
        inputs[i].dataset.player = '';
        if (i < 3) {
            inputs[i].style.background = "red";
            inputs[i].dataset.player = 'p1';
        }  
        if (i > 5){
            inputs[i].style.background = "blue";
            inputs[i].dataset.player = 'p2';
        }
    }
}
function testwin() {
    const winningCombos = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
                [0, 4, 8], [2, 4, 6]             // Diagonals
            ];
    for (let combo of winningCombos) {
                const [a, b, c] = combo;
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                if((a == 0 && b == 1 && c == 2 && board[a] == "p1") || (a == 6 && b == 7 && c == 8 && board[a] == "p2")) {
                    return false;
                }
                console.log(combo);                
                    inputs[a].style.transform = "scale(1.5)"; 
                    inputs[b].style.transform = "scale(1.5)"; 
                    inputs[c].style.transform = "scale(1.5)";                          
                    return true;                                                                            
                 }                 
            }
            return false;
}


function onCheckerClick(event) {
    const checker = event.currentTarget;
    const checkerPlayer = checker.dataset.player;

    if (selectedChecker) {
        const selectedRow = parseInt(selectedChecker.dataset.row);
        const selectedCol = parseInt(selectedChecker.dataset.col);
        const targetRow = parseInt(checker.dataset.row);
        const targetCol = parseInt(checker.dataset.col);

        const rowDiff = Math.abs(targetRow - selectedRow);
        const colDiff = Math.abs(targetCol - selectedCol);

        if (((rowDiff === 1 && colDiff == 0) || (rowDiff == 0 && colDiff === 1) || (targetRow == 1 && targetCol == 1) || (selectedRow == 1 && selectedCol == 1 && (rowDiff == 1 || colDiff == 1))) && checkerPlayer != 'p1' &&  checkerPlayer != 'p2') {
            // Move the checker to the new position
            checker.style.background = selectedChecker.style.background;
            checker.dataset.player = currentPlayer;

            // Clear the old position
            selectedChecker.style.background = "white";
            selectedChecker.dataset.player = '';
            board[selectedRow*3 + selectedCol] = "";
            board[targetRow*3 + targetCol] = currentPlayer;            
            // Deselect the checker and switch player
            selectedChecker.classList.remove('selected');
            selectedChecker = null;
            // Switch turns between players
            currentPlayer = currentPlayer === 'p1' ? 'p2' : 'p1';
            if(testwin()) {                
                setTimeout(win, 1000);                 
            }
        } else {
            // Invalid move, deselect
            selectedChecker.classList.remove('selected');
            selectedChecker = null;
        }
    } else if (checkerPlayer == currentPlayer) {
        // Select the checker
        selectedChecker = checker;
        selectedChecker.classList.add('selected');
     }
}

function win() {
    selectedChecker = null;
    alert(currentPlayer+" is winner");      
    board = ['p1', 'p1', 'p1', '', '', '', 'p2', 'p2', 'p2'];
    firstStarter = Math.floor(Math.random()* 2)+1;
    currentPlayer = ''; 
 firstStarter == 1 ? currentPlayer = 'p1':currentPlayer = 'p2';                                                                
    damagenerate();  
}
damagenerate();