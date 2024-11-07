const wheel = document.querySelector('.wheel');
const spinButton = document.getElementById('spin-button');
const resultDisplay = document.getElementById('result');

// Секции в рулетката
const sections = ["Награда 1", "Награда 2", "Награда 3", "Награда 4", "Награда 5", "Награда 6"];

let isSpinning = false;

spinButton.addEventListener('click', () => {
  if (isSpinning) return;  // Избягване на повторно натискане по време на въртене

  isSpinning = true;
  resultDisplay.textContent = "";

  // Генериране на случайно завъртане
  const randomAngle = Math.floor(Math.random() * 360) + 360 * 5; // Минимум 5 пълни оборота
  wheel.style.transform = `rotate(${randomAngle}deg)`;

  // Изчисляване на резултата
  setTimeout(() => {
    const winningAngle = randomAngle % 360;
    const sectionIndex = Math.floor(winningAngle / (360 / sections.length));
    const result = sections[sections.length - 1 - sectionIndex];
    resultDisplay.textContent = `Резултат: ${result}`;
    isSpinning = false;
  }, 4000); // Съответства на времето за въртене (4 секунди)
});
