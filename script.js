// --- Word typing effect (This block ONLY runs if the .typing-text span element is found on the current page) ---
const typingText = document.querySelector(".typing-text span");

if (typingText) { // <-- This is the key check! It's true only on index.html
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

    let index = 0;

    function changeWord() {
        typingText.textContent = words[index];
        index = (index + 1) % words.length;
    }

    setInterval(changeWord, 2000);
    changeWord();
}
// --- End of word typing effect ---


// --- Hamburger menu logic (This block runs on ALL pages where script.js is loaded) ---
document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
});
// --- End of hamburger menu logic ---