const categories = {
  objects: [
    './images/1.jpg', './images/2.jpg', './images/3.jpg', './images/4.jpg', './images/5.jpg',
    './images/6.jpg', './images/7.jpg', './images/8.jpg', './images/9.jpg', './images/10.jpg',
    './images/11.jpg', './images/12.jpg', './images/13.jpg', './images/14.jpg', './images/15.jpg',
    './images/16.jpg', './images/17.jpg', './images/18.jpg', './images/19.jpg', './images/20.jpg',
    './images/21.jpg', './images/22.jpg', './images/23.jpg', './images/24.jpg', './images/25.jpg',
    './images/26.jpg', './images/27.jpg', './images/28.jpg', './images/29.jpg', './images/30.jpg',
    './images/31.jpg', './images/32.jpg', './images/33.jpg', './images/34.jpg', './images/35.jpg', './images/36.jpg', './images/37.jpg',
    './images/38.jpg', './images/39.jpg',
    './images/40.jpg', './images/41.jpg', './images/42.jpg', './images/43.jpg', './images/44.jpg',
    './images/45.jpg', './images/46.jpg', './images/47.jpg', './images/48.jpg', './images/49.jpg',
    './images/50.jpg', './images/51.jpg', './images/52.jpg', './images/53.jpg', './images/54.jpg', './images/55.jpg',
    './images/56.jpg', './images/57.jpg', './images/58.jpg',
    './images/59.jpg', './images/60.jpg', './images/61.jpg', './images/62.jpg', './images/63.jpg',
    './images/64.jpg', './images/65.jpg', './images/66.jpg', './images/67.jpg', './images/68.jpg',
    './images/69.jpg', './images/70.jpg', './images/71.jpg', './images/72.jpg',
    './images/73.jpg', './images/74.jpg', './images/75.jpg', './images/76.jpg', './images/77.jpg', './images/78.jpg',
    './images/79.jpg', './images/80.jpg', './images/81.jpg', './images/82.jpg', './images/83.jpg', './images/84.jpg',
    './images/85.jpg', './images/86.jpg', './images/87.jpg', './images/88.jpg', './images/89.jpg', './images/90.jpg',
    './images/91.png','./images/92.png','./images/93.png','./images/94.png','./images/95.png',
  ],
  songs: [
    { img: './songs/1.jpg', mp3: './audio/song1.mp3' },
    { img: './songs/2.jpg', mp3: './audio/song2.mp3' },
    { img: './songs/3.jpg', mp3: './audio/song3.mp3' },
    { img: './songs/4.jpg', mp3: './audio/song4.mp3' },
    { img: './songs/5.jpg', mp3: './audio/song5.mp3' },
    { img: './songs/6.jpg', mp3: './audio/song6.mp3' },
    { img: './songs/7.jpg', mp3: './audio/song6.mp3' },
    { img: './songs/8.png', mp3: './audio/song6.mp3' },
    { img: './songs/9.png', mp3: './audio/song6.mp3' },
    { img: './songs/10.png', mp3: './audio/song6.mp3' },
    { img: './songs/11.png', mp3: './audio/song6.mp3' },
    { img: './songs/12.png', mp3: './audio/song6.mp3' },
    { img: './songs/13.png', mp3: './audio/song6.mp3' },
    { img: './songs/14.png', mp3: './audio/song6.mp3' },
    { img: './songs/15.png', mp3: './audio/song6.mp3' },
    { img: './songs/16.png', mp3: './audio/song6.mp3' }

  ]
};
let second = false;
let teams = [];
let scores = {};
let currentTeamIndex = 0;
let currentItemIndex = 0;
let timeLeft = 0;
let roundTime = 60;
let timerInterval = null;
let gameStarted = false;
let currentItems = [];
let currentCategory = 'objects';
let phase = 'objects'; // 'objects' או 'songs'
let shownItems = new Set();
let isPaused = false;
// אלמנטים
const teamNameInput = document.getElementById('teamNameInput');
const addTeamBtn = document.getElementById('addTeamBtn');
const teamsListDiv = document.getElementById('teamsList');
const categorySelect = document.getElementById('categorySelect');
const roundTimeInput = document.getElementById('roundTimeInput');
const startGameBtn = document.getElementById('startGameBtn');
const resetGameBtn = document.getElementById('resetGameBtn');
const imageContainer = document.getElementById('imageContainer');
const promptText = document.getElementById('promptText');
const correctBtn = document.getElementById('correctBtn');
const passBtn = document.getElementById('passBtn');
const nextBtn = document.getElementById('nextBtn');
// const playSongBtn = document.getElementById('playSongBtn');
const timerFill = document.getElementById('timerFill');
const endSound = document.getElementById('endSound');
const winnersOverlay = document.getElementById('winnersOverlay');
const songsLevel = document.getElementById('songsLevel');
const winnersList = document.getElementById('winnersList');
const continueToSongsBtn = document.getElementById('continueToSongsBtn');
const mainGameContainer = document.getElementById('mainGameContainer');
const backgroundMusic = document.getElementById('backgroundMusic');
const songAudio = document.getElementById('songAudio');
const firstOnSongLevel = document.getElementById('firstOnSongLevel');
const startSongsLevel = document.getElementById('startSongsLevel');
const pauseBtn = document.getElementById('pauseBtn');
const pauseOverlay = document.getElementById('pauseOverlay');
const resumeBtn = document.getElementById('resumeBtn');
const pauseAudio = document.getElementById('pauseAudio');
// הוספת צוותים
document.addEventListener('DOMContentLoaded', function() {
  const paid = sessionStorage.getItem('paidForGame');
  console.log(paid);
  
  if (paid === 'true') {
    // אפשר להמשיך ולהציג את המשחק
    console.log('התשלום מאומת — כאן נטען המשחק');
    // … קוד המשחק …
  } else {
    // אם לא שילם – החזר לדף התשלום
    window.location.href = 'payment.html';
  }
});
addTeamBtn.addEventListener('click', () => {
  const name = teamNameInput.value.trim();
  if (!name) return showMessage('אנא הכנס שם צוות');
  if (teams.includes(name)) return showMessage('שם הצוות כבר קיים', 'error');
  teams.push(name);
  scores[name] = 0;
  teamNameInput.value = '';
  renderTeams();
});

function renderTeams() {
  teamsListDiv.innerHTML = '';
  teams.forEach((team, i) => {
    const div = document.createElement('div');
    div.className = 'team-item';
    div.innerHTML = `
        <span class="team-name">${team}</span>
        <span class="score-number">${scores[team]}</span>
        <button class="removeTeam" onclick="removeTeam(${i})" style="background:#b33939; color:#fff; border:none; border-radius:4px; cursor:pointer;">הסר</button>
      `;
    teamsListDiv.appendChild(div);
  });
};

window.removeTeam = function (i) {
  if (gameStarted) {
    showMessage('לא ניתן להסיר צוות במהלך משחק');
    return;
  }
  scores[teams[i]] = undefined;
  teams.splice(i, 1);
  renderTeams();
};

// הפעלת מוזיקת רקע שקטה בלולאה
// backgroundMusic.volume = 0.15;
backgroundMusic.play().catch(() => {  });

startGameBtn.addEventListener('click', () => {
  if (teams.length === 0) {
    showMessage('אנא הוסף לפחות צוות אחד');
    return;
  }

  currentCategory = categorySelect.value;
  phase = currentCategory;
  roundTime = Math.max(10, Number(roundTimeInput.value));
  currentTeamIndex = 0;
  currentItemIndex = 0;
  // אם מתחילים מחדש - מאפסים את הניקוד
  scores = {};
  teams.forEach(t => scores[t] = 0);
  gameStarted = true;
  startGameBtn.style.disabled = 'true';
  const removeTeam = document.getElementsByClassName('removeTeam');
  timeLeft = roundTime;
  backgroundMusic.play();
  // *שומרים את כל הפריטים שהוצגו לאורך המשחק כדי למנוע חזרות*
  // לא מאפסים את shownItems פה! (רק באיפוס מלא)

  prepareItems();
  renderTeams();
  prepareNextTeam();

  // showCurrentItem();

  // startTimer();

  nextBtn.disabled = true;
  correctBtn.disabled = false;
  passBtn.disabled = false;
  // playSongBtn.style.display = 'none'; // לא בשלב חפצים

});

resetGameBtn.addEventListener('click', () => {
  if (!confirm('בטוח רוצה לאפס את המשחק?')) return;

  clearInterval(timerInterval);
  gameStarted = false;
  startGameBtn.style.disabled = 'false';

  teams = [];
  scores = {};
  currentTeamIndex = 0;
  currentItemIndex = 0;
  timeLeft = 0;
  roundTime = 60;
  shownItems.clear();

  timerFill.style.height = '100%';
  imageContainer.innerHTML = '<div class="prompt-text">הוסף צוותים, בחר נושא והתחל משחק</div>';
  teamsListDiv.innerHTML = '';
  nextBtn.disabled = true;
  correctBtn.disabled = true;
  passBtn.disabled = true;
  // playSongBtn.style.display = 'none';

  winnersOverlay.classList.remove('show');
  mainGameContainer.style.display = 'flex';

  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
});

// טוען רק את הפריטים שטרם הוצגו, בהתאם לשלב
function prepareItems() {
  if (phase === 'songs') {
    // בחר רק שירים שלא הוצגו עדיין
    currentItems = categories.songs.filter(item => !shownItems.has(item.img));

  } else {
    currentItems = categories[phase].filter(item => !shownItems.has(item));
  }
  shuffleArray(currentItems);
};
// פונקציית ערבוב אקראי
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
};

function showCurrentItem() {
  const item = currentItems[currentItemIndex];
  imageContainer.innerHTML = '';
  promptText.textContent = '';

  if (!item) {
    promptText.textContent = 'אין פריטים להצגה';
    correctBtn.disabled = true;
    passBtn.disabled = true;
    // playSongBtn.style.display = 'none';
    return;
  }

  // סימון הפריט כ"נראה" - לשמור על סט המנעה מחזרות
  if (phase === 'songs') {
    shownItems.add(item.img);
  } else {
    shownItems.add(item);
  }

  if (phase === 'songs') {
    const img = document.createElement('img');
    img.src = item.img;
    img.alt = 'פריט למשחק';
    imageContainer.appendChild(img);
    promptText.textContent = `שיר ${currentItemIndex + 1} מתוך ${currentItems.length}`;

    // playSongBtn.style.display = 'none'; // יופיע אחרי לחיצה על נכון
    // songAudio.pause();
    // songAudio.currentTime = 0;
    // songAudio.src = item.mp3;
  } else {
    // חפצים או בעלי חיים - הצגת תמונה בלבד
    const img = document.createElement('img');
    img.src = item;
    img.alt = 'פריט למשחק';
    imageContainer.appendChild(img);
    promptText.textContent = `פריט ${currentItemIndex + 1} מתוך ${currentItems.length}`;

    // playSongBtn.style.display = 'none';
  }

  // הפעלת כפתורים
  correctBtn.disabled = false;
  passBtn.disabled = false;
  nextBtn.disabled = true;
};

// function startTimer() {
//   clearInterval(timerInterval);
//   timeLeft = roundTime;
//   updateTimerFill();
//   timerInterval = setInterval(() => {
//     timeLeft--;
//     updateTimerFill();

//     if (timeLeft <= 0) {
//       clearInterval(timerInterval);
//       // backgroundMusic.phase();
//       endSound.play();
//       correctBtn.disabled = true;
//       passBtn.disabled = true;
//       nextBtn.disabled = false;
//       playSongBtn.disabled = true;
//       timeLeft=0;
//       // console.log("timerLeft", timerLeft);
//       // timeOut.style.display='flex';
//       timeOutFun();
//     }
//   }, 1000);
// }

function updateTimerFill() {
  const pct = (timeLeft / roundTime) * 100;
  timerFill.style.height = pct + '%';
}

// כפתור נכון - לא מאתחל את הטיימר אלא רק עובר לפריט הבא ומוסיף ניקוד
correctBtn.addEventListener('click', () => {
  if (!gameStarted) return;
  const team = teams[currentTeamIndex];
  scores[team] += 10;
  // if (phase !== 'songs') {
  currentItemIndex++;
  if (currentItemIndex >= currentItems.length) {
    // סיום סבב לזוג
    correctBtn.disabled = true;
    passBtn.disabled = true;
    nextBtn.disabled = false;
    // playSongBtn.disabled = (phase !== 'songs');
    showMessage('הגעתם לסוף הסבב!', 'success');
  } else {
    showCurrentItem();
  }
  // }

  renderTeams();

  // בשלב השירים, להפעיל כפתור הפעל שיר אחרי "נכון"
  if (phase === 'songs') {
    // playSongBtn.style.display = 'inline-block';
    // playSongBtn.disabled = false;
  }
});

passBtn.addEventListener('click', () => {
  if (!gameStarted) return;
  const team = teams[currentTeamIndex];
  scores[team] -= 5;
  currentItemIndex++;
  if (currentItemIndex >= currentItems.length) {
    // סיום סבב לזוג
    correctBtn.disabled = true;
    passBtn.disabled = true;
    nextBtn.disabled = false;
    // playSongBtn.style.display = 'none';
  }
  else {
    showCurrentItem();
  }
  renderTeams();

});

nextBtn.addEventListener('click', () => {
  if (!gameStarted) return;
  if (timeLeft > 0) {
    showMessage('יש להמתין לסיום הטיימר לפני המעבר לזוג הבא', 'error');
    return;
  }
  currentTeamIndex++;
  currentItemIndex = 0;

  // אם נגמרו הזוגות בשלבי חפצים, מציגים זכייה והמשך לשלב שירים
  if (phase === 'objects' && currentTeamIndex >= teams.length) {
    showWinnersOverlay();
    return;
  }

  // בשלב שירים, אם נגמרו הזוגות - מסיימים משחק
  if (phase === 'songs' && currentTeamIndex >= teams.length) {
    gameStarted = false;
    startGameBtn.style.disabled = 'false';
    const sorted = [...teams].sort((a, b) => scores[b] - scores[a]);
    const topCount = 1
    const threshold = scores[sorted[topCount - 1]];
    winner = sorted.filter(name => scores[name] >= threshold);
    sessionStorage.setItem('winner', winner);
    window.href = 'gameOver.html';
    // imageContainer.innerHTML = '<div class="prompt-text">המשחק נגמר</div>';
    nextBtn.disabled = true;
    correctBtn.disabled = true;
    passBtn.disabled = true;
    // playSongBtn.style.display = 'none';
    return;
  }

  // טוענים את הפריטים שנותרו עבור הזוג הבא
  prepareItems();

  if (currentItems.length === 0) {
    showMessage('אין פריטים חדשים להציג לזוג הבא.', 'error');
    correctBtn.disabled = true;
    passBtn.disabled = true;
    nextBtn.disabled = false;
    // playSongBtn.style.display = 'none';
    return;
  }

  // showCurrentItem();
  renderTeams();
  prepareNextTeam();

  correctBtn.disabled = false;
  passBtn.disabled = false;
  nextBtn.disabled = true;
  // playSongBtn.style.display = 'none';

});

// כפתור הפעלת שיר בשלב השירים
// playSongBtn.addEventListener('click', () => {
//   if (!gameStarted || phase !== 'songs') return;
//   songAudio.play();
// });

// הצגת הזוכים בסיום שלב חפצים והמשך לשלב שירים
function showWinnersOverlay() {
  clearInterval(timerInterval);
  gameStarted = false;
  // startGameBtn.style.disabled = 'true';
  nextBtn.disabled = true;
  correctBtn.disabled = true;
  passBtn.disabled = true;
  // playSongBtn.style.display = 'none';

  // מציגים הזוכים לפי ניקוד גבוה ביותר
  var winners;
  // ממיין לפי נקודות מהגבוה לנמוך
  const sorted = [...teams].sort((a, b) => scores[b] - scores[a]);

  // קובע כמה מקומות ראשונים לקחת
  const topCount = teams.length > 3 ? 3 : 2;

  // מוצא את סף הניקוד האחרון שנכנס לרשימה
  const threshold = scores[sorted[topCount - 1]];

  // מחזיר את כל מי שיש לו ניקוד >= לסף (כולל שוויון)
  winners = sorted.filter(name => scores[name] >= threshold);
  teams = winners;

  winnersList.innerHTML = '';
  winners.forEach(w => {
    const li = document.createElement('li');
    li.textContent = `${w} - ניקוד: ${scores[w]}`;
    winnersList.appendChild(li);
  });

  winnersOverlay.classList.add('show');
  mainGameContainer.style.display = 'none';
}

continueToSongsBtn.addEventListener('click', () => {
  winnersOverlay.classList.remove('show');
  mainGameContainer.style.display = 'flex';
  categorySelect.value = 'songs'
  phase = 'songs';
  currentTeamIndex = 0;
  currentItemIndex = 0;
  roundTime = Math.max(10, Number(roundTimeInput.value));
  gameStarted = false;
  timeLeft = roundTime;

  // שומרים ניקוד מהחפצים - לא מאפסים
  prepareItems();
  // renderTeams();
  //  startTimer();

  correctBtn.disabled = false;
  passBtn.disabled = false;
  nextBtn.disabled = true;
  // playSongBtn.style.display = 'none';
  timerFill.style.height = '100%';
  // imageContainer.innerHTML = '<div class="prompt-text">התחל משחק</div>';
  // teamsListDiv.innerHTML = '';
  nextBtn.disabled = true;
  correctBtn.disabled = false;
  passBtn.disabled = false;
  // playSongBtn.style.display = 'none';

  // winnersOverlay.classList.remove('show');
  // mainGameContainer.style.display = 'flex';
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  songsLevel.classList.add('show');
  firstOnSongLevel.textContent = `תור צוות: ${teams[currentTeamIndex]}`;

});
startSongsLevel.addEventListener('click', () => {
  songsLevel.classList.remove('show');
  showCurrentItem();
  startTimer();
  gameStarted = true;
  startGameBtn.style.disabled = 'true';


});
pauseAudio.addEventListener('click',()=>{
  backgroundMusic.pause();
})
// פונקציה לעדכון זמן סיבוב מהקלט
roundTimeInput.addEventListener('change', () => {
  const val = Number(roundTimeInput.value);
  if (val < 10) {
    showMessage('יש להכניס זמן של לפחות 10 שניות', 'error');
    roundTimeInput.value = 10;
  }
});
const header = document.getElementById('currentTeamHeader');
const nextTeamOverlay = document.getElementById('nextTeamOverlay');
const nextlevel = document.getElementById('nextlevel');
const startNextTeamBtn2 = document.getElementById('startNextTeamBtn2');
const nextTeamName = document.getElementById('nextTeamName');
const startNextTeamBtn = document.getElementById('startNextTeamBtn');
const timeOut = document.getElementById('timeOut');
const timeOutBtn = document.getElementById('timeOutBtn');
//timeOut next team
async function timeOutFun() {
  if (!gameStarted) return;
  if (timeLeft > 0) {
    showMessage('יש להמתין לסיום הטיימר לפני המעבר לזוג הבא', 'error');
    return;
  }
  currentTeamIndex++;
  if (phase === 'objects' &&currentTeamIndex >= teams.length && !second) {
    nextlevel.style.display = 'flex';
    // await new Promise(r => setTimeout(r, 20000))
    //     nextlevel.style.display = 'none';

    currentTeamIndex = 0;
    second = true;
    return;
  }

  // currentItemIndex = 0;

  // אם נגמרו הזוגות בשלבי חפצים, מציגים זכייה והמשך לשלב שירים
  if (phase === 'objects' && currentTeamIndex >= teams.length && second) {
    showWinnersOverlay();
    return;
  }

  // בשלב שירים, אם נגמרו הזוגות - מסיימים משחק
  if (phase === 'songs' && currentTeamIndex >= teams.length) {
    gameStarted = false;
    const sorted = [...teams].sort((a, b) => scores[b] - scores[a]);
    const topCount = 1
    const threshold = scores[sorted[topCount - 1]];
    winner = sorted.filter(name => scores[name] >= threshold);
    sessionStorage.setItem('winner', winner);
   window.location.href = "gameOver.html";
    nextBtn.disabled = true;
    correctBtn.disabled = true;
    passBtn.disabled = true;
    // playSongBtn.style.display = 'none';
    return;
  }

  // טוענים את הפריטים שנותרו עבור הזוג הבא
  prepareItems();

  if (currentItems.length === 0) {
    showMessage('אין פריטים חדשים להציג לזוג הבא.', 'error');
    correctBtn.disabled = true;
    passBtn.disabled = true;
    nextBtn.disabled = false;
    // playSongBtn.style.display = 'none';
    return;
  }

  // showCurrentItem();
  renderTeams();
  prepareNextTeam();

  correctBtn.disabled = false;
  passBtn.disabled = false;
  nextBtn.disabled = true;
  // playSongBtn.style.display = 'none';

};
// מציג את שם הצוות הנוכחי למעלה
function updateHeader() {
  header.textContent = `תור צוות: ${teams[currentTeamIndex]}`;
  header.style.display = 'block';
}

function showNextTeamOverlay() {
  const prevScoreEl = document.getElementById("previous-score");
  // const imageContainer = document.getElementById('imageContainer');
  // imageContainer.innerHTML = '<div class="prompt-text">ממתינים לצוות הבא.../div>';

  if (currentTeamIndex > 0) {
    const prevTeam = teams[currentTeamIndex - 1];
    const prevScore = scores[prevTeam];
    prevScoreEl.textContent = `${prevTeam} סיימו עם ${prevScore} נקודות`;
  } else {
    prevScoreEl.textContent = ""; // לא מציג בשלב הראשון
  }
  if (currentTeamIndex < teams.length) {
    nextTeamName.textContent = `הצוות הבא: ${teams[currentTeamIndex]}`;
    nextTeamOverlay.style.display = 'flex';
  }
  // else{
  //   nextTeamName.textContent = `הצוות הבא: ${teams[currentTeamIndex]}`;
  //   nextTeamOverlay.style.display = 'flex';
  // }
}



startNextTeamBtn2.addEventListener('click', () => {
   nextlevel.style.display = 'none';

  // טוענים את הפריטים שנותרו עבור הזוג הבא
  prepareItems();

  if (currentItems.length === 0) {
    showMessage('אין פריטים חדשים להציג לזוג הבא.', 'error');
    correctBtn.disabled = true;
    passBtn.disabled = true;
    nextBtn.disabled = false;
    // playSongBtn.style.display = 'none';
    return;
  }

  // showCurrentItem();
  renderTeams();
  prepareNextTeam();

  correctBtn.disabled = false;
  passBtn.disabled = false;
  nextBtn.disabled = true;
});

// כשהמנהל לוחץ "התחל משחק" לזוג הבא
startNextTeamBtn.addEventListener('click', () => {
  nextTeamOverlay.style.display = 'none';
  showCurrentItem();
  updateHeader();
  startTimer(); // מפעיל את הטיימר
});

// קריאה למסך המעבר במקום התחלת המשחק מיידית
function prepareNextTeam() {
  showNextTeamOverlay();
}
function showMessage(text, type = 'info', duration = 3000) {
  const box = document.getElementById('messageBox');
  box.textContent = text;
  box.className = `${type} show`;

  setTimeout(() => {
    box.classList.remove('show');
  }, duration);
}

//השהייה
pauseBtn.addEventListener('click', () => {

  if (!isPaused) {

    isPaused = true;

    pauseStart = Date.now();

    pauseOverlay.classList.remove('hidden');
    pauseTimer();
  }

});

resumeBtn.addEventListener('click', () => {

  if (isPaused) {

    isPaused = false;

    pauseOverlay.classList.add('hidden');

    resumeTimer();

  }

});


function startTimer() {
  clearInterval(timerInterval);
  timeLeft = roundTime;
  updateTimerFill();

  timerInterval = setInterval(() => {
    if (!isPaused) { // רק אם לא בהשהיה
      timeLeft--;
      updateTimerFill();

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        endSound.play();
        correctBtn.disabled = true;
        passBtn.disabled = true;
        nextBtn.disabled = false;
        // playSongBtn.disabled = true;
        timeLeft = 0;
        timeOutFun();
      }
    }
  }, 1000);
}

// פונקציה להשהיית הטיימר
function pauseTimer() {
  isPaused = true;
}

// פונקציה להמשך מהנקודה שנעצרה
function resumeTimer() {
  isPaused = false;
}

// פונקציה לאיפוס מלא אם רוצים להתחיל סיבוב חדש
function resetTimer() {
  clearInterval(timerInterval);
  timeLeft = roundTime;
  updateTimerFill();
}
