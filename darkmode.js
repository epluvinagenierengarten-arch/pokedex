// ------ DARKMODE ------
// Theme
const savedTheme = localStorage.getItem('theme')
window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

// Toggle
const toggle = document.getElementById('theme-toggle');
let icon = null;
if (toggle != null) icon = toggle.querySelector('.icon');

applyTheme(savedTheme);

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (icon != null) icon.textContent = theme === 'dark' ? '⏾' : '✹';
}

if (toggle != null && icon != null) { // Parce que pokedex a pas le toggle
  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  });
}