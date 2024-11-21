const boardSize = 40; // Брой квадратчета
const bombCount = Math.floor(Math.random() * 11) + 10; // Между 10 и 20 бомби
const gameBoard = document.getElementById("game-board");
const status = document.getElementById("status");
const scoreDisplay = document.getElementById("score");
const profitDisplay = document.getElementById("profit");
const finishGameButton = document.getElementById("finish-game");
const backToBetButton = document.getElementById("back-to-bet");
const betSection = document.getElementById("bet-section");
const gameSection = document.getElementById("game-section");
const betInput = document.getElementById("bet-amount");
const startGameButton = document.getElementById("start-game");

let bombs = [];
let safeClicks = 0;
let score = 0;
let gameOver = false;
let betAmount = 0;
let profit = 0;

// Генерирай произволни позиции за бомбите
function generateBombs() {
    bombs = [];
    while (bombs.length < bombCount) {
        let position = Math.floor(Math.random() * boardSize);
        if (!bombs.includes(position)) {
            bombs.push(position);
        }
    }
}

// Стартиране на играта
startGameButton.addEventListener("click", () => {
    betAmount = parseFloat(betInput.value);

    if (isNaN(betAmount) || betAmount < 10) {
        alert("Моля, въведете валидна сума за залагане (минимум 10 лв.).");
        return;
    }

    betSection.classList.add("hidden");
    gameSection.classList.remove("hidden");
    startNewGame();
});

// Приключване на играта при натискане на бутона
finishGameButton.addEventListener("click", () => {
    if (!gameOver) {
        endGame("manual");
    }
});

// Връщане към екрана за залози
backToBetButton.addEventListener("click", () => {
    resetGame();
    gameSection.classList.add("hidden");
    betSection.classList.remove("hidden");
});

// Създаване на нова игра
function startNewGame() {
    gameOver = false;
    safeClicks = 0;
    score = 0;
    profit = 0;
    updateProfit();
    gameBoard.innerHTML = "";
    generateBombs();

    for (let i = 0; i < boardSize; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;

        // При кликване върху квадратче
        cell.addEventListener("click", () => {
            if (gameOver || cell.classList.contains("clicked")) return;

            if (bombs.includes(parseInt(cell.dataset.index))) {
                cell.classList.add("bomb");
                endGame("lost");
            } else {
                cell.classList.add("clicked");
                safeClicks++;
                score++;
                updateProfit();

                // Победа, ако всички безопасни квадратчета са разкрити
                if (safeClicks === boardSize - bombCount) {
                    endGame("won");
                }
            }
        });

        gameBoard.appendChild(cell);
    }
}

// Обновяване на печалбата
function updateProfit() {
    profit = (score * 0.2 * betAmount).toFixed(2);
    scoreDisplay.textContent = `Точки: ${score}`;
    profitDisplay.textContent = `Печалба: ${profit} лв.`;
}

// Функция за приключване на играта
function endGame(result) {
    gameOver = true;
    const cells = document.querySelectorAll(".cell");

    if (result === "lost") {
        status.textContent = `Играта приключи! Загубихте ${betAmount.toFixed(2)} лв.`;
        profit = 0;
    } else if (result === "won") {
        status.textContent = `Поздравления! Спечелихте ${profit} лв.`;
    } else if (result === "manual") {
        status.textContent = `Играта приключи! Събрахте ${profit} лв.`;
    }

    // Разкриване на всички бомби
    cells.forEach((cell) => {
        if (bombs.includes(parseInt(cell.dataset.index))) {
            cell.classList.add("bomb");
        }
        cell.classList.add("clicked");
    });

    finishGameButton.classList.add("hidden");
    backToBetButton.classList.remove("hidden");
}

// Нулиране на играта
function resetGame() {
    gameOver = false;
    safeClicks = 0;
    score = 0;
    profit = 0;
    status.textContent = "Избягвай бомбите!";
    scoreDisplay.textContent = "Точки: 0";
    profitDisplay.textContent = "Печалба: 0.00 лв.";
    gameBoard.innerHTML = "";
}
