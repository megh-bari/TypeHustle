const wordsDisplay = document.getElementById("words-display");
const timerDisplay = document.getElementById("timer");
const restartBtn = document.getElementById("restart-btn");
const resultCard = document.getElementById("result-card");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const closeResultBtn = document.getElementById("close-result-btn");
const timeOptions = document.querySelectorAll("#time-options li");
const levelOptions = document.querySelectorAll("#level-options li");
let currentDifficulty = "easy";

let easyWords = [
  "cat",
  "dog",
  "sun",
  "book",
  "pen",
  "tree",
  "fish",
  "milk",
  "ball",
  "hat",
  "car",
  "bike",
  "bird",
  "cup",
  "box",
  "key",
  "star",
  "apple",
  "desk",
  "chair",
  "home",
  "door",
  "frog",
  "lamp",
  "shoe",
  "flag",
  "note",
  "coin",
  "ring",
  "map",
  "sky",
  "leaf",
  "bird",
  "rope",
  "bed",
  "bowl",
  "hat",
  "bell",
  "drum",
  "sand",
  "wave",
  "hill",
  "snow",
  "rain",
  "wind",
  "moon",
  "star",
  "cloud",
  "rock",
  "grass",
  "fish",
  "frog",
  "ant",
  "duck",
  "goat",
  "wolf",
  "cow",
  "sheep",
  "hen",
  "owl",
];

let mediumWords = [
  "water",
  "food",
  "cake",
  "bread",
  "grass",
  "stone",
  "cloud",
  "rain",
  "snow",
  "wind",
  "fire",
  "light",
  "dark",
  "cold",
  "warm",
  "earth",
  "moon",
  "night",
  "day",
  "happy",
  "smile",
  "laugh",
  "dance",
  "sing",
  "play",
  "write",
  "read",
  "speak",
  "listen",
  "think",
  "river",
  "forest",
  "mountain",
  "desert",
  "valley",
  "garden",
  "ocean",
  "field",
  "lake",
  "pond",
  "street",
  "house",
  "school",
  "market",
  "church",
  "bridge",
  "park",
  "shop",
  "hotel",
  "theater",
  "sunset",
  "sunrise",
  "morning",
  "evening",
  "afternoon",
  "nightfall",
  "twilight",
  "dawn",
  "noon",
  "midnight",
];

let hardWords = [
  "algorithm",
  "telescope",
  "philosophy",
  "revolution",
  "microscope",
  "electricity",
  "imagination",
  "psychology",
  "hypothesis",
  "civilization",
  "architecture",
  "environment",
  "biodiversity",
  "metamorphosis",
  "photosynthesis",
  "cryptocurrency",
  "artificial",
  "intelligence",
  "nanotechnology",
  "sustainability",
  "extraterrestrial",
  "collaboration",
  "entrepreneurship",
  "biotechnology",
  "infrastructure",
  "globalization",
  "renaissance",
  "productivity",
  "consciousness",
  "technological",
  "transcendence",
  "paradigm",
  "theoretical",
];

let words = easyWords;

let currentWordIndex = 0;
let currentCharIndex = 0;
let startTime, endTime;
let timerDuration = 30;
let timerInterval;
let correctChars = 0;
let totalChars = 0;
let isTimerStarted = false;


function init() {
  shuffleWords(words);
  displayWords();
  resetGame();
  updateSelectionDisplay();
  //   focusHiddenInput();
}

function resetGame() {
  currentWordIndex = 0;
  currentCharIndex = 0;
  correctChars = 0;
  totalChars = 0;
  startTime = null;
  endTime = null;
  isTimerStarted = false;
  clearInterval(timerInterval);
  timerDisplay.textContent = timerDuration;
  resultCard.classList.add("hidden");
  updateCursor();
}

function enableMobileTyping() {
    wordsDisplay.setAttribute("contenteditable", "true");
    wordsDisplay.setAttribute("inputmode", "none");
    wordsDisplay.setAttribute("autocomplete", "off");
    wordsDisplay.setAttribute("autocorrect", "off");
    wordsDisplay.setAttribute("autocapitalize", "off");
    wordsDisplay.setAttribute("spellcheck", "false");
    wordsDisplay.style.caretColor = "transparent";
    wordsDisplay.style.outline = "none";
    wordsDisplay.style.userSelect = "none";
}
let touchStartX = 0;
let touchStartY = 0;

wordsDisplay.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

wordsDisplay.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
        // It's a tap, not a swipe
        if (!isTimerStarted) {
            startTimer();
            isTimerStarted = true;
        }
        wordsDisplay.focus();
    }
});

document.addEventListener('DOMContentLoaded', enableMobileTyping);


function shuffleWords(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
function displayWords() {
  wordsDisplay.innerHTML = words
    .map(
      (word, index) =>
        `<span class="word" id="word-${index}">${word
          .split("")
          .map(
            (char, charIndex) =>
              `<span class="char" id="char-${index}-${charIndex}">${char}</span>`
          )
          .join("")}</span>`
    )
    .join(" ");
  updateCursor();
}

function handleTyping(e) {
    let key = e.key || e.data;

    if (!isTimerStarted && key && key.length === 1) {
        startTimer();
        isTimerStarted = true;
    }

    const currentWord = words[currentWordIndex];
    const currentChar = currentWord[currentCharIndex];

    if (key === "Backspace") {
        handleBackspace();
    } else if (key === currentChar) {
        handleCorrectChar();
    } else if (key === " " && currentCharIndex === currentWord.length) {
        handleWordComplete();
    } else if (key && key.length === 1) {
        handleIncorrectChar();
    }

    updateCursor();
    e.preventDefault();
}

function handleBackspace() {
  if (currentCharIndex > 0) {
    currentCharIndex--;
    totalChars--;
    const charElement = document.getElementById(
      `char-${currentWordIndex}-${currentCharIndex}`
    );
    if (charElement.classList.contains("correct")) correctChars--;
    charElement.classList.remove("correct", "incorrect");
  } else if (currentWordIndex > 0) {
    currentWordIndex--;
    currentCharIndex = words[currentWordIndex].length - 1;
    totalChars--;
    const charElement = document.getElementById(
      `char-${currentWordIndex}-${currentCharIndex}`
    );
    if (charElement.classList.contains("correct")) correctChars--;
    charElement.classList.remove("correct", "incorrect");
  }
}

function handleCorrectChar() {
  const charElement = document.getElementById(
    `char-${currentWordIndex}-${currentCharIndex}`
  );
  charElement.classList.add("correct");
  correctChars++;
  totalChars++;
  currentCharIndex++;
}

function handleIncorrectChar() {
  const charElement = document.getElementById(
    `char-${currentWordIndex}-${currentCharIndex}`
  );
  charElement.classList.add("incorrect");
  totalChars++;
  currentCharIndex++;
}

function handleWordComplete() {
  currentWordIndex++;
  currentCharIndex = 0;
  if (currentWordIndex >= words.length) {
    shuffleWords();
    displayWords();
    currentWordIndex = 0;
  }
  document
    .getElementById(`word-${currentWordIndex}`)
    .scrollIntoView({ behavior: "smooth", block: "center" });
}

function updateCursor() {
  document
    .querySelectorAll(".char.current")
    .forEach((el) => el.classList.remove("current"));
  if (currentWordIndex < words.length) {
    const currentChar = document.getElementById(
      `char-${currentWordIndex}-${currentCharIndex}`
    );
    if (currentChar) currentChar.classList.add("current");
  }
}

function startTimer() {
  startTime = new Date().getTime();
  let timeLeft = timerDuration;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

wordsDisplay.addEventListener('input', function(e) {
    e.preventDefault();
    const inputChar = e.data;
    if (inputChar) {
        simulateKeyPress(inputChar);
    }
});

wordsDisplay.addEventListener('keydown', function(e) {
    if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
        updateCursor();
    }
});

function simulateKeyPress(char) {
    const keyboardEvent = new KeyboardEvent('keydown', {
        key: char,
        bubbles: true,
        cancelable: true,
    });
    document.dispatchEvent(keyboardEvent);
}

function endGame() {
  clearInterval(timerInterval);
  document.removeEventListener("keydown", handleTyping);
  endTime = new Date().getTime();
  const elapsedTime = (endTime - startTime) / 1000; // in seconds
  const elapsedMinutes = elapsedTime / 60; // convert seconds to minutes
  const wpm = Math.round(correctChars / 5 / elapsedMinutes); // GWPM
  const accuracy = ((correctChars / totalChars) * 100).toFixed(2);

  wpmDisplay.textContent = wpm;
  accuracyDisplay.textContent = accuracy + "%";
  resultCard.classList.remove("hidden");
}

function updateSelectionDisplay() {
  timeOptions.forEach((option) => {
    option.classList.remove("selected");
    if (option.id === timerDuration.toString()) {
      option.classList.add("selected");
    }
  });

  levelOptions.forEach((option) => {
    option.classList.remove("selected");
    if (option.id === currentDifficulty) {
      option.classList.add("selected");
    }
  });
}

timeOptions.forEach((option) => {
  option.addEventListener("click", (e) => {
    timerDuration = parseInt(e.target.id);
    timerDisplay.textContent = timerDuration;
    resetGame();
    init();
  });
});

levelOptions.forEach((option) => {
  option.addEventListener("click", (e) => {
    currentDifficulty = e.target.id;
    switch (currentDifficulty) {
      case "easy":
        words = [...easyWords];
        break;
      case "medium":
        words = [...mediumWords];
        break;
      case "hard":
        words = [...hardWords];
        break;
    }
    resetGame();
    init();
  });
});

restartBtn.addEventListener("click", () => {
  resetGame();
  init();
});

closeResultBtn.addEventListener("click", () => {
  resultCard.classList.add("hidden");
  resetGame();
  init();
});

document.addEventListener("keydown", handleTyping);

init();

