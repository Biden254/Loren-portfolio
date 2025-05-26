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

document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav'); // Renamed `nav` to `navMenu` for clarity

    if (hamburger && navMenu) { // Ensure both elements exist before adding listeners
        hamburger.addEventListener('click', () => {
            // Toggle 'active' class on both hamburger and navMenu
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Optional: Close nav when a navigation link is clicked
        // This improves UX by closing the menu once the user selects a section
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active'); // Remove active class from hamburger
                navMenu.classList.remove('active');   // Remove active class from nav menu
            });
        });
    }
});