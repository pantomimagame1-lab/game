const categories = {
  objects: [
    './images/1.jpg', './images/2.jpg', './images/3.jpg', './images/4.jpg', './images/5.jpg'
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
    { img: './songs/11.png', mp3: './audio/song6.mp3' }

  ]
};
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
const playSongBtn = document.getElementById('playSongBtn');
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
// הוספת צוותים

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
backgroundMusic.play().catch(() => { /* יתכן שנדרש אינטראקציה לפני הפעלת אודיו */ });

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
  playSongBtn.style.display = 'none'; // לא בשלב חפצים

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
  roundTime = 10;
  shownItems.clear();

  timerFill.style.height = '100%';
  imageContainer.innerHTML = '<div class="prompt-text">הוסף צוותים, בחר נושא והתחל משחק</div>';
  teamsListDiv.innerHTML = '';
  nextBtn.disabled = true;
  correctBtn.disabled = true;
  passBtn.disabled = true;
  playSongBtn.style.display = 'none';

  winnersOverlay.classList.remove('show');
  mainGameContainer.style.display = 'flex';

  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
});

// טוען רק את הפריטים שטרם הוצגו, בהתאם לשלב
function prepareItems() {

  currentItems = categories['objects'];
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
    playSongBtn.style.display = 'none';
    return;
  }



    const img = document.createElement('img');
    img.src = item;
    img.alt = 'פריט למשחק';
    imageContainer.appendChild(img);
    promptText.textContent = `פריט ${currentItemIndex + 1} מתוך ${currentItems.length}`;

    playSongBtn.style.display = 'none';
  

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
    currentItemIndex=0;
    showCurrentItem();
    // playSongBtn.disabled = (phase !== 'songs');
    showMessage('נגמרו כמות הפריטים לגרסה החינמית ', 'success');
  } 
  else {
    showCurrentItem();
  }
  // }

  renderTeams();


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
    playSongBtn.style.display = 'none';
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
    gameStarted = false;
    startGameBtn.style.disabled = 'false';
    const sorted = [...teams].sort((a, b) => scores[b] - scores[a]);
    const topCount = 1
    // const threshold = scores[sorted[topCount - 1]];
    // winner = sorted.filter(name => scores[name] >= threshold);
    // sessionStorage.setItem('winner', winner);
    // window.href = 'gameOver.html';
    imageContainer.innerHTML = '<div class="prompt-text">המשחק נגמר</div>';
    nextBtn.disabled = true;
    correctBtn.disabled = true;
    passBtn.disabled = true;
    playSongBtn.style.display = 'none';
    endDemo();
    return; 
  }



  prepareItems();

  if (currentItems.length === 0) {
    showMessage('אין פריטים חדשים להציג לזוג הבא.', 'error');
    correctBtn.disabled = true;
    passBtn.disabled = true;
    nextBtn.disabled = false;
    playSongBtn.style.display = 'none';
    return;
  }

  // showCurrentItem();
  renderTeams();
  prepareNextTeam();

  correctBtn.disabled = false;
  passBtn.disabled = false;
  nextBtn.disabled = true;
  playSongBtn.style.display = 'none';

});



// הצגת הזוכים בסיום שלב חפצים והמשך לשלב שירים
// function showWinnersOverlay() {
//   clearInterval(timerInterval);
//   gameStarted = false;
//   // startGameBtn.style.disabled = 'true';
//   nextBtn.disabled = true;
//   correctBtn.disabled = true;
//   passBtn.disabled = true;
//   playSongBtn.style.display = 'none';

//   // מציגים הזוכים לפי ניקוד גבוה ביותר
//   var winners;
//   // ממיין לפי נקודות מהגבוה לנמוך
//   const sorted = [...teams].sort((a, b) => scores[b] - scores[a]);

//   // קובע כמה מקומות ראשונים לקחת
//   const topCount = teams.length > 3 ? 3 : 2;

//   // מוצא את סף הניקוד האחרון שנכנס לרשימה
//   const threshold = scores[sorted[topCount - 1]];

//   // מחזיר את כל מי שיש לו ניקוד >= לסף (כולל שוויון)
//   winners = sorted.filter(name => scores[name] >= threshold);
//   teams = winners;

//   winnersList.innerHTML = '';
//   winners.forEach(w => {
//     const li = document.createElement('li');
//     li.textContent = `${w} - ניקוד: ${scores[w]}`;
//     winnersList.appendChild(li);
//   });

//   winnersOverlay.classList.add('show');
//   mainGameContainer.style.display = 'none';
// }

// continueToSongsBtn.addEventListener('click', () => {
//   winnersOverlay.classList.remove('show');
//   mainGameContainer.style.display = 'flex';
//   categorySelect.value = 'songs'
//   phase = 'songs';
//   currentTeamIndex = 0;
//   currentItemIndex = 0;
//   roundTime = Math.max(10, Number(roundTimeInput.value));
//   gameStarted = false;
//   timeLeft = roundTime;

//   // שומרים ניקוד מהחפצים - לא מאפסים
//   prepareItems();
//   // renderTeams();
//   //  startTimer();

//   correctBtn.disabled = false;
//   passBtn.disabled = false;
//   nextBtn.disabled = true;
//   playSongBtn.style.display = 'none';
//   timerFill.style.height = '100%';
//   // imageContainer.innerHTML = '<div class="prompt-text">התחל משחק</div>';
//   // teamsListDiv.innerHTML = '';
//   nextBtn.disabled = true;
//   correctBtn.disabled = false;
//   passBtn.disabled = false;
//   playSongBtn.style.display = 'none';

//   // winnersOverlay.classList.remove('show');
//   // mainGameContainer.style.display = 'flex';
//   backgroundMusic.pause();
//   backgroundMusic.currentTime = 0;
//   songsLevel.classList.add('show');
//   firstOnSongLevel.textContent = `תור צוות: ${teams[currentTeamIndex]}`;

// });
// startSongsLevel.addEventListener('click', () => {
//   songsLevel.classList.remove('show');
//   showCurrentItem();
//   startTimer();
//   gameStarted = true;
//   startGameBtn.style.disabled = 'true';


// });

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
  if (phase === 'objects' && currentTeamIndex >= teams.length) {
    nextlevel.style.display = 'flex';
    await new Promise(r => setTimeout(r, 20000))
    nextlevel.style.display = 'none';

    currentTeamIndex = 0;
  }
  // currentItemIndex = 0;

  // אם נגמרו הזוגות בשלבי חפצים, מציגים זכייה והמשך לשלב שירים
  if (phase === 'objects' && currentTeamIndex >= teams.length) {
    showWinnersOverlay();
    return;
  }

  // בשלב שירים, אם נגמרו הזוגות - מסיימים משחק
 

  // טוענים את הפריטים שנותרו עבור הזוג הבא
  prepareItems();

  if (currentItems.length === 0) {
    showMessage('אין פריטים חדשים להציג לזוג הבא.', 'error');
    correctBtn.disabled = true;
    passBtn.disabled = true;
    nextBtn.disabled = false;
    playSongBtn.style.display = 'none';
    return;
  }

  // showCurrentItem();
  renderTeams();
  prepareNextTeam();

  correctBtn.disabled = false;
  passBtn.disabled = false;
  nextBtn.disabled = true;
  playSongBtn.style.display = 'none';

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
        playSongBtn.disabled = true;
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

function endDemo() {
  document.getElementById('demoEnd').style.display = 'flex';
  correctBtn.disabled = true;
  passBtn.disabled = true;
  nextBtn.disabled = true;
}

// document.getElementById('startRealGameBtn').addEventListener('click', () => {
//   window.location.href = 'payment.html'; // לשנות לנתיב האמיתי של המשחק המלא שלך
// });
