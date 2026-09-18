// ------ DARKMODE ------
const toggle = document.getElementById('theme-toggle');
const icon = toggle.querySelector('.icon');

const savedTheme = localStorage.getItem('theme')
window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

applyTheme(savedTheme);

toggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const newTheme = current === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  localStorage.setItem('theme', newTheme);
});

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    icon.textContent = theme === 'dark' ? '✹' : '⏾';
}