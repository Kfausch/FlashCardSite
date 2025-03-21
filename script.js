let terms = [];
let currentIndex = 0;
let showDefinition = false;

/**
 * Configure your sets here.
 * Each object has a name (for display) and a file (the TXT file to fetch).
 */
const sets = [
  { name: "Cybersecurity Terms", file: "definitions_cybersecurity.txt" },
  { name: "Security Acronyms", file: "SecurityAcronyms.txt" },
  { name: "Security Acronyms", file: "CommonPorts.txt" },
  { name: "Networking Terms", file: "definitions_networking.txt" },
  
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

  flashcard.addEventListener('click', () => {
    if (showDefinition) {
      // If we're showing definition, move to the next card on click
      currentIndex = (currentIndex + 1) % terms.length;
      displayTerm();
    } else {
      // If we're showing term, show definition
      displayDefinition();
    }
  });

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + terms.length) % terms.length;
    displayTerm();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % terms.length;
    displayTerm();
  });
});

function loadDefinitions(file) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      // Parse the file
      terms = data.split('\n')
        .map(line => {
          const parts = line.split(' - ');
          if (parts.length === 2) {
            return { term: parts[0].trim(), definition: parts[1].trim() };
          }
        })
        .filter(item => item !== undefined);

      currentIndex = 0;
      displayTerm();
    })
    .catch(error => {
      console.error('Error loading definitions:', error);
      const flashcard = document.getElementById('flashcard');
      flashcard.textContent = 'Failed to load terms.';
    });
}

function displayTerm() {
  const flashcard = document.getElementById('flashcard');
  if (terms[currentIndex]) {
    flashcard.textContent = terms[currentIndex].term;
    showDefinition = false;
  } else {
    flashcard.textContent = 'No terms available.';
  }
}

function displayDefinition() {
  const flashcard = document.getElementById('flashcard');
  if (terms[currentIndex]) {
    flashcard.textContent = terms[currentIndex].definition;
    showDefinition = true;
  }
}
