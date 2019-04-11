const navbarToggle = document.getElementById('js-navbar-toggle');
const mainNavlinks = document.getElementById('js-navlinks');

navbarToggle.addEventListener('click', () => {
  mainNavlinks.classList.toggle('visible');
});
