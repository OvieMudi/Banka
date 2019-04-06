document.addEventListener("DOMContentLoaded", e => {
  localStorage.setItem("user", "cashier");
  const user = localStorage.getItem("user");

  /* ---------- PAGE NAVIGATION ------------------ */
  const accountsNavLink = document.getElementById("accounts-link");
  const transactionsNavLink = document.getElementById("transactions-link");
  // set nav links
  accountsNavLink.setAttribute("href", `./dashboard-${user}.html`);

  // Main nav hamburber menu
  const navbarToggle = document.getElementById("js-navbar-toggle");
  const mainNavlinks = document.getElementById("js-navlinks");

  navbarToggle.addEventListener("click", () => {
    mainNavlinks.classList.toggle("visible");
  });

  /* -------------  CASHIER SECTION ------------------- */
  const cashierSection = document.querySelector(".cashier-section");
  if (cashierSection && user == "cashier") {
    cashierSection.classList.add("display-block");

    const newTrxBtn = document.querySelector("#newTrxBtn");
    const accInputContainer = document.querySelector(".inputContainer");
    newTrxBtn.addEventListener("click", e => {
      accInputContainer.classList.toggle("display-flex");
      e.preventDefault();
    });
  }

  /* MOdal section */
  const modalTrigger = document.querySelector(".modal-trigger");
  if (modalTrigger) {
    const modalContainer = document.querySelector(".modal-container");
    const modalCloseBtn = document.querySelectorAll(".modal-close-btn");

    function toggleModal() {
      modalContainer.classList.toggle("show-modal");
    }

    modalTrigger.addEventListener("click", toggleModal);
    modalCloseBtn.forEach(closeBtn => {
      console.log(closeBtn);
      closeBtn.addEventListener("click", toggleModal);
    });
    window.addEventListener("click", function(e) {
      if (e.target === modalContainer) {
        toggleModal();
      }
    });
  }
});
