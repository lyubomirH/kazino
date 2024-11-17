const wheel = document.getElementById('wheel');
const spinButton = document.getElementById('spin-button');
const resultDisplay = document.getElementById('result');
const bettingTypeSelect = document.getElementById('betting-type');
const numberBetDiv = document.querySelector('.number-bet');
const colorBetDiv = document.querySelector('.color-bet');
const betNumberInput = document.getElementById('bet-number');
const betColorInput = document.getElementById('bet-color');
const rangeBetDiv = document.getElementById('range-bet');

let isSpinning = false;
let currentRotation = 0;

const colors = [
  { color: 'black', degreeRange: [0, 10] },
  { color: 'red', degreeRange: [10, 20] },
  { color: 'black', degreeRange: [20, 30] },
  { color: 'red', degreeRange: [30, 40] },
  { color: 'black', degreeRange: [40, 50] },
  { color: 'red', degreeRange: [50, 60] },
  { color: 'black', degreeRange: [60, 70] },
  { color: 'red', degreeRange: [70, 80] },
  { color: 'black', degreeRange: [80, 90] },
  { color: 'red', degreeRange: [90, 100] },
  { color: 'black', degreeRange: [100, 110] },
  { color: 'red', degreeRange: [110, 120] },
  { color: 'black', degreeRange: [120, 130] },
  { color: 'red', degreeRange: [130, 140] },
  { color: 'black', degreeRange: [140, 150] },
  { color: 'red', degreeRange: [150, 160] },
  { color: 'black', degreeRange: [160, 170] },
  { color: 'red', degreeRange: [170, 180] },
  { color: 'black', degreeRange: [180, 190] },
  { color: 'red', degreeRange: [190, 200] },
  { color: 'black', degreeRange: [200, 210] },
  { color: 'red', degreeRange: [210, 220] },
  { color: 'black', degreeRange: [220, 230] },
  { color: 'red', degreeRange: [230, 240] },
  { color: 'black', degreeRange: [240, 250] },
  { color: 'red', degreeRange: [250, 260] },
  { color: 'black', degreeRange: [260, 270] },
  { color: 'red', degreeRange: [270, 280] },
  { color: 'black', degreeRange: [280, 290] },
  { color: 'red', degreeRange: [290, 300] },
  { color: 'black', degreeRange: [300, 310] },
  { color: 'red', degreeRange: [310, 320] },
  { color: 'black', degreeRange: [320, 330] },
  { color: 'red', degreeRange: [330, 340] },
  { color: 'black', degreeRange: [340, 350] },
  { color: 'green', degreeRange: [350, 360] }
];

const numbers = [
  36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20,
  19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0
];

function addNumbersToWheel() {
  const totalNumbers = numbers.length;
  const offsetAngle = 360 / totalNumbers; // Ъгъл между всяко число
  const rotationOffset = offsetAngle / 2; // Завъртане, за да позиционираме 0 между 0 и 36

  numbers.forEach((number, index) => {
    const numberElement = document.createElement('div');
    numberElement.classList.add('number');
    numberElement.setAttribute('data-number', number);
    numberElement.textContent = number;

    // Завъртаме всеки елемент с допълнителен офсет, за да преместим 0
    const angle = index * offsetAngle + rotationOffset;

    // Изчисляваме позицията на числото върху кръга
    const x = 143 + Math.cos((angle - 90) * (Math.PI / 180)) * 136;
    const y = 140 + Math.sin((angle - 90) * (Math.PI / 180)) * 136;

    numberElement.style.position = 'absolute';
    numberElement.style.left = `${x}px`;
    numberElement.style.top = `${y}px`;
    numberElement.style.transform = `rotate(${angle}deg)`;

    wheel.appendChild(numberElement);
  });
}

window.addEventListener('load', addNumbersToWheel);

bettingTypeSelect.addEventListener('change', () => {
  if (bettingTypeSelect.value === 'number') {
    numberBetDiv.style.display = 'block';
    rangeBetDiv.style.display = 'none';  // Скриваме "Интервал"
  } else if (bettingTypeSelect.value === 'color') {
    colorBetDiv.style.display = 'block';
    numberBetDiv.style.display = 'none';
    rangeBetDiv.style.display = 'none';  // Скриваме "Интервал"
  } else if (bettingTypeSelect.value === 'range') {
    rangeBetDiv.style.display = 'block';
    numberBetDiv.style.display = 'none';
    colorBetDiv.style.display = 'none';  // Скриваме "Цвят"
  }
});

spinButton.addEventListener('click', spinWheel);

async function spinWheel() {
  if (isSpinning) return;

  let bet;
  const betType = bettingTypeSelect.value;

  if (betType === 'number') {
    bet = parseInt(betNumberInput.value);
    if (isNaN(bet) || bet < 0 || bet > 36) {
      resultDisplay.textContent = "Моля, въведете число между 0 и 36!";
      return;
    }
  } else {
    bet = betColorInput.value;
  }

  isSpinning = true;
  resultDisplay.textContent = "";

  const randomOffset = Math.floor(Math.random() * 360);
  const baseAngle = 360 * 5;
  const finalAngle = baseAngle + randomOffset;

  currentRotation += finalAngle;

  wheel.style.transition = 'transform 4s cubic-bezier(0.33, 1, 0.68, 1)';
  wheel.style.transform = `rotate(${currentRotation}deg)`;

  // Изчакваме края на завъртането
  await new Promise(resolve => setTimeout(resolve, 4000));

  const winningAngle = currentRotation % 360;
  const sectionIndex = Math.floor(winningAngle / (360 / (betType === 'number' ? 37 : (betType === 'range' ? 2 : colors.length))));

  const result = betType === 'number' ? sectionIndex : betType === 'range' ? checkRange(winningAngle) : colors[sectionIndex].color;

  if (result === bet) {
    resultDisplay.textContent = `Поздравления! Спечелихте със ${betType === 'number' ? 'число' : betType === 'range' ? 'интервал' : 'цвят'} ${result}`;
  } else {
    resultDisplay.textContent = `Загуба. Печеливш ${betType === 'number' ? 'номер' : betType === 'range' ? 'интервал' : 'цвят'}: ${result}`;
  }

  isSpinning = false;
}


function checkRange(winningAngle) {
  const winningNumber = Math.floor(winningAngle / (360 / 37)); // Изчисляваме спечелилото число
  if (winningNumber >= 1 && winningNumber <= 18) {
    return "1-18";
  } else if (winningNumber >= 19 && winningNumber <= 36) {
    return "19-36";
  } else if (winningNumber === 0) {
    return "0"; // ако е 0
  } else {
    return "Невалиден интервал"; // За всеки друг случай
  }
}

