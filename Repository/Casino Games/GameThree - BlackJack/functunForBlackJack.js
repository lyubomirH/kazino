const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck = [];
let playerHand = [];
let dealerHand = [];
let balance = 100.0; // Формат с десетични
let currentBet = 0;
let placeBetCount = 0;

const balanceElement = document.getElementById('balance');
const betInput = document.getElementById('bet');
const message = document.getElementById('message');
const playerCards = document.getElementById('player-cards');
const dealerCards = document.getElementById('dealer-cards');
const playerScore = document.getElementById('player-score');
const dealerScore = document.getElementById('dealer-score');

document.getElementById('place-bet').addEventListener('click', placeBet);
document.getElementById('hit').addEventListener('click', hit);
document.getElementById('stand').addEventListener('click', stand);

function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    deck = deck.sort(() => Math.random() - 0.5);
}

function getCardValue(card) {
    if (['J', 'Q', 'K'].includes(card.value)) return 10;
    if (card.value === 'A') return 11;
    return parseInt(card.value);
}

function calculateScore(hand) {
    let score = hand.reduce((sum, card) => sum + getCardValue(card), 0);
    let aces = hand.filter(card => card.value === 'A').length;
    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }
    return score;
}

function updateUI() {
    playerCards.innerHTML = '';
    dealerCards.innerHTML = '';
    playerHand.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.textContent = `${card.value}${card.suit}`;
        playerCards.appendChild(cardElement);
    });
    dealerHand.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.textContent = `${card.value}${card.suit}`;
        dealerCards.appendChild(cardElement);
    });
    playerScore.textContent = `Score: ${calculateScore(playerHand)}`;
    dealerScore.textContent = `Score: ${calculateScore(dealerHand)}`;
    balanceElement.textContent = balance.toFixed(2); // Показваме баланса с две десетични места

    // Предупреждение за нисък баланс
    if (balance < 25) {
        message.textContent = 'Warning: Your balance is running low!';
    }
}


function placeBet() {
    currentBet = parseFloat(betInput.value);

    // Проверка за минимален залог
    if (currentBet <= 9 || isNaN(currentBet)) {
        message.textContent = 'Invalid bet! Minimum bet is 10.00.';
        return;
    }

    // Проверка дали балансът позволява залога (включително 1/4 загуба при Bust)
    if (balance - (currentBet / 4) < 0) {
        message.textContent = 'Insufficient balance! Adjust your bet.';
        return;
    }

    placeBetCount++;

    if (placeBetCount > 3) {
        balance *= 0.75; // Отнемаме 25% от баланса
        balance = parseFloat(balance.toFixed(2)); // Оставяме само 2 десетични знака
        message.textContent = 'Penalty: You lose 25% of your balance for repeated rerolls!';
        placeBetCount = 0; // Рестартираме брояча
        updateUI();
        return;
    }

    // Ако всичко е наред, стартирай играта
    message.textContent = '';
    startGame();
}


function startGame() {
    createDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    updateUI();
    document.getElementById('hit').disabled = false;
    document.getElementById('stand').disabled = false;
}

function hit() {
    playerHand.push(deck.pop());
    updateUI();
    placeBetCount = 0;
    if (calculateScore(playerHand) > 21) {
        // Играчът губи само 1/4 от текущия залог при Bust
        balance -= currentBet / 4;
        endGame('Bust! You lose.');
    }
}


function stand() {
    while (calculateScore(dealerHand) < 17) {
        dealerHand.push(deck.pop());
    }
    updateUI();
    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(dealerHand);
    placeBetCount = 0;
    if (dealerScore > 21 || playerScore > dealerScore) {
        endGame('You win!');
        balance += currentBet;
    } else if (playerScore < dealerScore) {
        endGame('Dealer wins!');
        balance -= currentBet;
    } else {
        endGame('Push!');
    }
}

function endGame(result) {
    message.textContent = result;
    document.getElementById('hit').disabled = true;
    document.getElementById('stand').disabled = true;
    updateUI();
}
