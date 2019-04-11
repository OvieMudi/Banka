document.addEventListener('DOMContentLoaded', () => {
  // General table
  const rows = document.querySelectorAll('tr[data-href]');

  rows.forEach((row) => {
    row.addEventListener('click', function () {
      window.location.href = this.dataset.href;
    });
  });
});
