// מצב דמו
const isDemo = true;
let currentIndex = 0;

// רשימת תמונות לדוגמה (ניתן להחליף לנתיבים שלך)
const demoImages = [
  'https://picsum.photos/id/1015/400/400',
  'https://picsum.photos/id/1025/400/400',
  'https://picsum.photos/id/1035/400/400',
  'https://picsum.photos/id/1045/400/400',
  'https://picsum.photos/id/1055/400/400'
];

const imageContainer = document.getElementById('imageContainer');
const correctBtn = document.getElementById('correctBtn');
const passBtn = document.getElementById('passBtn');
const nextBtn = document.getElementById('nextBtn');

// הצגת הבאנר אם זה דמו
document.addEventListener('DOMContentLoaded', () => {
  if (isDemo) {
    document.getElementById('demoBanner').style.display = 'block';
  }
  showImage();
});

function showImage() {
  const img = demoImages[currentIndex];
  imageContainer.innerHTML = '';
  if (!img) {
    endDemo();
    return;
  }

  const imageEl = document.createElement('img');
  imageEl.src = img;
  imageEl.alt = 'תמונה למשחק';
  imageContainer.appendChild(imageEl);
}

nextBtn.addEventListener('click', () => {
  currentIndex++;
  if (currentIndex >= demoImages.length) {
    endDemo();
  } else {
    showImage();
  }
});

correctBtn.addEventListener('click', () => {
  alert('כל הכבוד! 😄');
});

passBtn.addEventListener('click', () => {
  currentIndex++;
  showImage();
});

function endDemo() {
  document.getElementById('demoEndPopup').style.display = 'flex';
  correctBtn.disabled = true;
  passBtn.disabled = true;
  nextBtn.disabled = true;
}

document.getElementById('startRealGameBtn').addEventListener('click', () => {
  window.location.href = 'payment.html'; // לשנות לנתיב האמיתי של המשחק המלא שלך
});
