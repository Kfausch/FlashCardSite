let terms = [];
let currentIndex = 0;
let showDefinition = false;

fetch('definitions.txt')
    .then(response => response.text())
    .then(data => {
        terms = data.split('\n').map(line => {
            const parts = line.split(' - ');
            return { term: parts[0].trim(), definition: parts[1].trim() };
        });
        displayTerm();
    });

document.getElementById('flashcard').addEventListener('click', () => {
    if (showDefinition) {
        currentIndex = (currentIndex + 1) % terms.length;
        displayTerm();
    } else {
        displayDefinition();
    }
});

function displayTerm() {
    const flashcard = document.getElementById('flashcard');
    flashcard.textContent = terms[currentIndex].term;
    showDefinition = false;
}

function displayDefinition() {
    const flashcard = document.getElementById('flashcard');
    flashcard.textContent = terms[currentIndex].definition;
    showDefinition = true;
}
