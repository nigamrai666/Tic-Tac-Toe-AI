document.addEventListener('DOMContentLoaded', () => {
    const gameInfo = document.querySelector('.game-info');
    const boxes = document.querySelectorAll('.box');
    const newGameBtn = document.querySelector('.btn');

    let currentPlayer;
    let gameGrid;

    const winningPositions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function initGame() {
        currentPlayer = 'X';
        gameGrid = Array.from({ length: 9 }, () => '');
        boxes.forEach(box => {
            box.innerText = '';
            box.classList.remove('win');
            box.style.pointerEvents = 'auto';
            box.addEventListener('click', handleBoxClick);
        });
        gameInfo.innerText = `Current Player: ${currentPlayer}`;
        newGameBtn.classList.remove('active');
    }

    function checkWinner(player) {
        return winningPositions.some(position => {
            return position.every(index => gameGrid[index] === player);
        });
    }

    function checkTie() {
        return gameGrid.every(value => value !== '');
    }

    function minimax(grid, depth, maximizingPlayer) {
        if (checkWinner('X')) return -10 + depth;
        if (checkWinner('O')) return 10 - depth;
        if (checkTie()) return 0;

        if (maximizingPlayer) {
            let bestScore = -Infinity;
            for (let i = 0; i < grid.length; i++) {
                if (grid[i] === '') {
                    grid[i] = 'O';
                    let score = minimax(grid, depth + 1, false);
                    grid[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < grid.length; i++) {
                if (grid[i] === '') {
                    grid[i] = 'X';
                    let score = minimax(grid, depth + 1, true);
                    grid[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function findBestMove() {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < gameGrid.length; i++) {
            if (gameGrid[i] === '') {
                gameGrid[i] = 'O';
                let score = minimax(gameGrid, 0, false);
                gameGrid[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    }
    
    function getWinningPositions(player) {
        return winningPositions.filter(position => {
            return position.every(index => gameGrid[index] === player);
        });
    }

    function handleBoxClick(event) {
        const index = Array.from(boxes).indexOf(event.target);
        if (gameGrid[index] === '') {
            gameGrid[index] = currentPlayer;
            event.target.innerText = currentPlayer;
            event.target.style.pointerEvents = 'none';
            if (checkWinner(currentPlayer)) {
                gameInfo.innerText = `Winner: ${currentPlayer}`;
                const winningPositions = getWinningPositions(currentPlayer);
                winningPositions.forEach(position => {
                    position.forEach(index => {
                        boxes[index].classList.add('win');
                    });
                });
                boxes.forEach(box => {
                    if (!box.classList.contains('win')) {
                        box.style.pointerEvents = 'none';
                    }
                });
                newGameBtn.classList.add('active');
            } else if (checkTie()) {
                gameInfo.innerText = 'It\'s a Tie!';
                newGameBtn.classList.add('active');
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                gameInfo.innerText = `Current Player: ${currentPlayer}`;
                if (currentPlayer === 'O') {
                    const bestMoveIndex = findBestMove();
                    gameGrid[bestMoveIndex] = currentPlayer;
                    boxes[bestMoveIndex].innerText = currentPlayer;
                    boxes[bestMoveIndex].style.pointerEvents = 'none';
                    if (checkWinner(currentPlayer)) {
                        gameInfo.innerText = `Winner: ${currentPlayer}`;
                        const winningPositions = getWinningPositions(currentPlayer);
                        winningPositions.forEach(position => {
                            position.forEach(index => {
                                boxes[index].classList.add('win');
                            });
                        });
                        boxes.forEach(box => {
                            if (!box.classList.contains('win')) {
                                box.style.pointerEvents = 'none';
                            }
                        });
                        newGameBtn.classList.add('active');
                    } else if (checkTie()) {
                        gameInfo.innerText = 'It\'s a Tie!';
                        newGameBtn.classList.add('active');
                    } else {
                        currentPlayer = 'X';
                        gameInfo.innerText = `Current Player: ${currentPlayer}`;
                    }
                }
            }
        }
    }

    newGameBtn.addEventListener('click', initGame);

    initGame();
});