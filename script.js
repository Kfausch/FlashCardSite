let terms = [];
let currentIndex = 0;
let showDefinition = false;

fetch('definitions.txt')
    .then(response => response.text())
    .then(data => {
        terms = data.split('\n').map(line => {
            const parts = line.split(' - ');
            if (parts.length === 2) {  // Ensure there's a term and a definition
                return { term: parts[0].trim(), definition: parts[1].trim() };
            }
        }).filter(item => item !== undefined); // Filter out any undefined entries
        displayTerm();
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

document.querySelector('.flashcard-container').addEventListener('click', () => {
    if (showDefinition) {
        currentIndex = (currentIndex + 1) % terms.length;
        displayTerm();
    } else {
        displayDefinition();
    }
});


function displayTerm() {
    const flashcard = document.getElementById('flashcard');
    if (terms[currentIndex]) {  // Ensure the current term exists
        flashcard.textContent = terms[currentIndex].term;
        showDefinition = false;
    }
}

function displayDefinition() {
    const flashcard = document.getElementById('flashcard');
    if (terms[currentIndex]) {  // Ensure the current term exists
        flashcard.textContent = terms[currentIndex].definition;
        showDefinition = true;
    }
}
