const wheel = document.querySelector('.wheel');
const spinButton = document.getElementById('spin-button');
const resultDisplay = document.getElementById('result');
const centerDisplay = document.getElementById('center-display');


const numbers = Array.from({ length: 36 }, (_, i) => i + 1);

let isSpinning = false;


function spinWheel() {
  if (isSpinning) return;

  isSpinning = true;
  resultDisplay.textContent = "";
  centerDisplay.textContent = "";

  
  const randomAngle = Math.floor(Math.random() * 360) + 360 * 5;
  wheel.style.transform = `rotate(${randomAngle}deg)`;

  
  setTimeout(() => {
    const winningAngle = randomAngle % 360;
    const sectionIndex = Math.floor(winningAngle / (360 / numbers.length));
    const result = numbers[numbers.length - 1 - sectionIndex];

    
    resultDisplay.textContent = `Резултат: ${result}`;
    centerDisplay.textContent = result;
    isSpinning = false;
  }, 4000);
}


spinButton.addEventListener('click', spinWheel);


document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    spinWheel();
  }
});
