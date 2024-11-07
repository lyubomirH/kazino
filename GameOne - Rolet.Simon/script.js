const wheel = document.getElementById('wheel');
const spinButton = document.getElementById('spin-button');
const resultDisplay = document.getElementById('result');
const bettingTypeSelect = document.getElementById('betting-type');
const numberBetDiv = document.querySelector('.number-bet');
const colorBetDiv = document.querySelector('.color-bet');
const betNumberInput = document.getElementById('bet-number');
const betColorInput = document.getElementById('bet-color');

let isSpinning = false;
let currentRotation = 0; // Променлива, която съхранява текущото завъртане

// Списък на цветовете на рулетката
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

// Обработчик за промяна на типа на залагане
bettingTypeSelect.addEventListener('change', () => {
  const betType = bettingTypeSelect.value;
  if (betType === 'number') {
    numberBetDiv.style.display = 'block';
    colorBetDiv.style.display = 'none';
  } else {
    numberBetDiv.style.display = 'none';
    colorBetDiv.style.display = 'block';
  }
});

function spinWheel() {
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
  resultDisplay.textContent = ""; // Изчистване на предишния резултат

  // Генериране на случаен резултат и добавяне на фиксиран брой завъртания
  const randomOffset = Math.floor(Math.random() * 360);
  const baseAngle = 360 * 5; // 5 пълни оборота
  const finalAngle = baseAngle + randomOffset;

  // Актуализиране на текущото завъртане
  currentRotation += finalAngle;

  // Завъртане на рулетката
  wheel.style.transition = 'transform 4s cubic-bezier(0.33, 1, 0.68, 1)';
  wheel.style.transform = `rotate(${currentRotation}deg)`;

  // Изчисляване на резултата след 4 секунди (когато анимацията спре)
  setTimeout(() => {
    const winningAngle = currentRotation % 360;
    const sectionIndex = Math.floor(winningAngle / (360 / (betType === 'number' ? 37 : colors.length)));
    const result = betType === 'number' ? sectionIndex : colors[sectionIndex].color;

    // Проверка на залагането
    if (result === bet) {
      resultDisplay.textContent = `Поздравления! Спечелихте със ${betType === 'number' ? 'число' : 'цвят'} ${result}`;
    } else {
      resultDisplay.textContent = `Загуба. Печеливш ${betType === 'number' ? 'номер' : 'цвят'}: ${result}`;
    }

    isSpinning = false;
  }, 4000);
}

// Стартиране на завъртането при натискане на бутона
spinButton.addEventListener('click', spinWheel);

const numbers = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
  19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36
];

// Функция за добавяне на числата върху колелото
function addNumbersToWheel() {
  numbers.forEach((number, index) => {
    const numberElement = document.createElement('div');
    numberElement.classList.add('number');
    numberElement.setAttribute('data-number', number);
    numberElement.textContent = number;

    // Изчисляваме позицията на всяко число
    const angle = (360 / 37) * index;
    const x = 55 + Math.sin((angle * Math.PI) / 180) * 40; // 120 е радиусът
    const y = 40 - Math.cos((angle * Math.PI) / 180) * 40; // 120 е радиусът

    numberElement.style.left = `${x}%`;
    numberElement.style.top = `${y}%`;

    wheel.appendChild(numberElement);
  });
}

// Извикваме функцията при зареждане на страницата
window.addEventListener('load', addNumbersToWheel);