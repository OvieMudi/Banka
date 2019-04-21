const toggleForm = document.querySelectorAll('.js-tgl-form');
const container = document.getElementById('js-container');

toggleForm.forEach((click) => {
  click.addEventListener('click', () => {
    container.classList.toggle('right-box-active');
  });
});
