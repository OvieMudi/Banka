document.addEventListener("DOMContentLoaded", e => {
  localStorage.setItem("user", "cashier");
  localStorage.setItem("role", "admin");
  const user = localStorage.getItem("user");
  const role = user === "client" ? "client" : "staff";

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

  /* -------------  CASHIER TRANSACTIONS SECTION ------------------- */
  const trxTglBtn = document.querySelector("#input-tgl-btn");
  const cashierSection = document.querySelector(".js-cashier-trx-section");
  if (cashierSection && user == "cashier") {
    cashierSection.classList.add("display-block");
    showAccInputBtn(trxTglBtn);
  }

  /* ------------------ STAFF DASHBOARD SECTION -------------- */
  const staffSearchSection = document.querySelector(".js-staff-search-section");
  if (staffSearchSection && role === "staff") {
    staffSearchSection.classList.add("display-block");
    showAccInputBtn(trxTglBtn);
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
function showAccInputBtn(trxTglBtn) {
  const accInputContainer = document.querySelector(".inputContainer");
  trxTglBtn.addEventListener("click", e => {
    accInputContainer.classList.toggle("display-flex");
    e.preventDefault();
  });
}
