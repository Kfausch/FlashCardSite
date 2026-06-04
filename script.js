let terms = [];
let currentIndex = 0;
let isFlipped = false;

/**
 * Configure your sets here.
 */
const sets = [
  { name: "AZ-104 Azure Administrator", file: "az-104-definitions.txt" },
  { name: "Cybersecurity Terms", file: "definitions_cybersecurity.txt" },
  { name: "Security Acronyms", file: "SecurityAcronyms.txt" },
  { name: "Security+", file: "SecPlus.txt" },
  { name: "Common Ports", file: "CommonPorts.txt" },
  { name: "Networking Terms", file: "definitions_networking.txt" }
];

window.addEventListener('DOMContentLoaded', () => {
  const setSelect = document.getElementById('setSelect');
  const flashcard = document.getElementById('flashcard');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  // Populate the dropdown with available sets
  sets.forEach(s => {
    const option = document.createElement('option');
    option.value = s.file;
    option.textContent = s.name;
    setSelect.appendChild(option);
  });

  // Load the first set by default
  loadDefinitions(sets[0].file);

  setSelect.addEventListener('change', () => {
    loadDefinitions(setSelect.value);
  });

  // Flip on click
  flashcard.addEventListener('click', () => {
    toggleFlip();
  });

  // Next/Prev Buttons
  prevBtn.addEventListener('click', () => navigate(-1));
  nextBtn.addEventListener('click', () => navigate(1));

  // Keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') navigate(-1);
    else if (e.key === 'ArrowRight') navigate(1);
    else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault(); // Prevent page scroll on spacebar
      toggleFlip();
    }
  });
});

function loadDefinitions(file) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      // Parse the file and filter out empty lines
      terms = data.split('\n')
        .map(line => {
          const parts = line.split(' - ');
          if (parts.length >= 2) {
            // Join back in case the definition itself contains ' - '
            const term = parts[0].trim();
            const definition = parts.slice(1).join(' - ').trim();
            return { term, definition };
          }
        })
        .filter(item => item !== undefined);

      currentIndex = 0;
      updateCardContent();
    })
    .catch(error => {
      console.error('Error loading definitions:', error);
      document.getElementById('card-front').textContent = 'Failed to load terms.';
      document.getElementById('card-back').textContent = 'Please check file path.';
    });
}

function updateCardContent() {
  const front = document.getElementById('card-front');
  const back = document.getElementById('card-back');
  const flashcard = document.getElementById('flashcard');
  
  // Ensure the card faces front when moving to a new term
  flashcard.classList.remove('is-flipped');
  isFlipped = false;

  if (terms.length > 0 && terms[currentIndex]) {
    front.textContent = terms[currentIndex].term;
    // Wait briefly for the flip animation to finish before updating back text to prevent text flashing
    setTimeout(() => {
        back.textContent = terms[currentIndex].definition;
    }, 150); 
  } else {
    front.textContent = 'No terms found in file.';
    back.textContent = '';
  }
}

function toggleFlip() {
  const flashcard = document.getElementById('flashcard');
  if (terms.length === 0) return;
  
  isFlipped = !isFlipped;
  if (isFlipped) {
    flashcard.classList.add('is-flipped');
  } else {
    flashcard.classList.remove('is-flipped');
  }
}

function navigate(direction) {
  if (terms.length === 0) return;
  currentIndex = (currentIndex + direction + terms.length) % terms.length;
  updateCardContent();
}