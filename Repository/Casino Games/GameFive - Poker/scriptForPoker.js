// script.js
const playerHand = document.getElementById('player-hand');
const gameStatus = document.getElementById('game-status');
const dealBtn = document.getElementById('deal-btn');
const betBtn = document.getElementById('bet-btn');
const foldBtn = document.getElementById('fold-btn');

// Тестови карти
const deck = [
  '2♠', '3♠', '4♠', '5♠', '6♠', '7♠', '8♠', '9♠', '10♠', 'J♠', 'Q♠', 'K♠', 'A♠',
  '2♥', '3♥', '4♥', '5♥', '6♥', '7♥', '8♥', '9♥', '10♥', 'J♥', 'Q♥', 'K♥', 'A♥',
  '2♣', '3♣', '4♣', '5♣', '6♣', '7♣', '8♣', '9♣', '10♣', 'J♣', 'Q♣', 'K♣', 'A♣',
  '2♦', '3♦', '4♦', '5♦', '6♦', '7♦', '8♦', '9♦', '10♦', 'J♦', 'Q♦', 'K♦', 'A♦',
];

// Функция за разбъркване на карти
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// Раздаване на карти
function dealCards() {
  const shuffledDeck = shuffleDeck([...deck]);
  const hand = shuffledDeck.slice(0, 5); // 5 карти за играча
  playerHand.innerHTML = '';
  hand.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.textContent = card;
    playerHand.appendChild(cardElement);
  });
  gameStatus.textContent = 'Your cards are dealt!';
}

// Слушатели за бутони
dealBtn.addEventListener('click', dealCards);
betBtn.addEventListener('click', () => {
  gameStatus.textContent = 'You placed a bet!';
});
foldBtn.addEventListener('click', () => {
  gameStatus.textContent = 'You folded. Better luck next time!';
});

// Карти - стилове
const style = document.createElement('style');
style.textContent = `
  .card {
    background-color: #f3f3f3;
    color: #2c2c2c;
    padding: 10px;
    margin: 5px;
    border: 1px solid #ffdd00;
    border-radius: 5px;
    font-size: 18px;
    display: inline-block;
    width: 50px;
    text-align: center;
  }
`;
document.head.appendChild(style);
// Начален баланс и текущ залог
let playerBalance = 1000;
let currentBet = 0;

// Актуализиране на интерфейса
function updateBalanceDisplay() {
  document.getElementById('player-balance').textContent = `Balance: $${playerBalance}`;
  document.getElementById('current-bet').textContent = `Current Bet: $${currentBet}`;
}

// Функция за залагане
function placeBet(amount) {
  if (amount > playerBalance) {
    gameStatus.textContent = 'Not enough balance to place this bet!';
    return;
  }
  currentBet += amount;
  playerBalance -= amount;
  updateBalanceDisplay();
  gameStatus.textContent = `You placed a bet of $${amount}. Total bet: $${currentBet}`;
}

// Функция за печалба
function winBet() {
  const winnings = currentBet * 2; // Удвояване на залога
  playerBalance += winnings;
  currentBet = 0;
  updateBalanceDisplay();
  gameStatus.textContent = `You won $${winnings}! Congratulations!`;
}

// Функция за загуба
function loseBet() {
  currentBet = 0; // Играчът губи текущия залог
  updateBalanceDisplay();
  gameStatus.textContent = 'You lost the round. Better luck next time!';
}

// Обновени слушатели за бутони
betBtn.addEventListener('click', () => {
  placeBet(50); // Пример: $50 залог
});

foldBtn.addEventListener('click', loseBet);
dealBtn.addEventListener('click', () => {
  if (currentBet === 0) {
    gameStatus.textContent = 'Place a bet before dealing!';
  } else {
    dealCards();
    const win = Math.random() > 0.5; // Случайна печалба/загуба
    win ? winBet() : loseBet();
  }
});

// Първоначално показване на баланса
updateBalanceDisplay();

const opponentHandElement = document.getElementById('opponent-hand');

// Генериране на ръка на противника
function dealOpponentHand() {
  const shuffledDeck = shuffleDeck([...deck]);
  const hand = shuffledDeck.slice(5, 10); // Противникът получава следващите 5 карти
  opponentHandElement.innerHTML = '';
  hand.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.textContent = card;
    opponentHandElement.appendChild(cardElement);
  });
  return hand;
}

// Сравнение на ръцете (основна логика)
function compareHands(playerHand, opponentHand) {
  // За опростеност: сравняваме броя на асовете в ръцете
  const playerScore = calculateScore(playerHand);
  const opponentScore = calculateScore(opponentHand);

  if (playerScore > opponentScore) {
    winBet();
    return `You win! Your score: ${playerScore}, Opponent's score: ${opponentScore}`;
  } else if (playerScore < opponentScore) {
    loseBet();
    return `You lose. Your score: ${playerScore}, Opponent's score: ${opponentScore}`;
  } else {
    currentBet = 0;
    updateBalanceDisplay();
    return `It's a tie! Both scored: ${playerScore}`;
  }
}

// Изчисляване на точките в ръката
function calculateScore(hand) {
  return hand.filter(card => card.includes('A')).length; // Ас = 1 точка
}

// Актуализиране на логиката на бутона "Deal"
dealBtn.addEventListener('click', () => {
  if (currentBet === 0) {
    gameStatus.textContent = 'Place a bet before dealing!';
  } else {
    const playerCards = dealCards();
    const opponentCards = dealOpponentHand();
    const result = compareHands(playerCards, opponentCards);
    gameStatus.textContent = result;
  }
});

// Актуализация на dealCards() за връщане на ръката на играча
function dealCards() {
  const shuffledDeck = shuffleDeck([...deck]);
  const hand = shuffledDeck.slice(0, 5); // 5 карти за играча
  playerHand.innerHTML = '';
  hand.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.textContent = card;
    playerHand.appendChild(cardElement);
  });
  return hand; // Връща ръката за сравнение
}

