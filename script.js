const words = [
    "Cloud Practitioner",
    "Cloud Developer",
    "Cloud Architect",
    "Cloud Engineer",
    "Cloud Consultant",
    "Software Engineer",
    "Solutions Architect",
    "Security Analyst",
];

let index = 0; // Start with the first word
const typingText = document.querySelector(".typing-text span");

function changeWord() {
    typingText.textContent = words[index]; // Update the text content
    index = (index + 1) % words.length; // Move to the next word, loop back to the start
}

// Change the word every 2 seconds
setInterval(changeWord, 2000);

// Initialize with the first word
changeWord();

const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    hamburger.addEventListener('click', () => {
        nav.classList.toggle('active');
    });