// Mobilmeny + årtal i footer
const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');
const year = document.getElementById('year');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', String(!expanded));
    navToggle.setAttribute('aria-expanded', String(!expanded));
  });
}
if (year) year.textContent = String(new Date().getFullYear());
