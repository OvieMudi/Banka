document.addEventListener("DOMContentLoaded", e => {
  localStorage.setItem("user", "cashier");
  localStorage.removeItem("role");
  const user = localStorage.getItem("user");
  const role = user === "client" ? "client" : "staff";

  /* ---------- PAGE NAVIGATION ------------------ */
  const accountsNavLink = document.getElementById("accounts-link");
  // set nav links
  accountsNavLink.setAttribute("href", `./dashboard-${role}.html`);

  // Main nav hamburber menu
  const navbarToggle = document.getElementById("js-navbar-toggle");
  const mainNavlinks = document.getElementById("js-navlinks");

  navbarToggle.addEventListener("click", () => {
    mainNavlinks.classList.toggle("visible");
  });

  // input container
  const acctInputContainer = document.querySelector(".inputContainer");

  /* -------------  CASHIER TRANSACTIONS SECTION ------------------- */
  const trxTglBtn = document.querySelectorAll(".js-input-tgl-btn");
  const cashierSection = document.querySelector(".js-cashier-trx-section");
  if (cashierSection && user == "cashier") {
    cashierSection.classList.add("display-flex");
    toggleAccInput(trxTglBtn);
  }

  /* ------------------ STAFF DASHBOARD SECTION -------------- */
  const staffSearchSection = document.querySelector(".js-staff-search-section");
  if (staffSearchSection && role === "staff") {
    staffSearchSection.classList.add("display-block");
    toggleAccInput(trxTglBtn);
  }

  /* ------------------- SINGLE ACCOUNT PAGE ------------------ */
  const cashierAcctOP = document.querySelector(".cashier-acct-op");
  const adminAcctOP = document.querySelector(".admin-acct-op");
  // Cashier Operations
  if (user === "cashier") {
    cashierAcctOP.classList.add("display-flex");
    // show Credit/Debit input
    const creditBtn = document.querySelector("#js-credit-btn");
    const deditBtn = document.querySelector("#js-dedit-btn");
    const creditDebitBtn = document.querySelector("#js-credit-debit-btn");
    // Change button textcontent on click
    creditBtn.addEventListener("click", () => {
      acctInputContainer.classList.add("display-flex");
      creditDebitBtn.textContent = "Credit";
    });
    deditBtn.addEventListener("click", () => {
      acctInputContainer.classList.add("display-flex");
      creditDebitBtn.textContent = "Dedit";
    });

    deditBtn.addEventListener("click", () => {
      acctInputContainer.classList.add("display-flex");
    });
  }
  // Admin operations
  else if (user === "admin") {
    adminAcctOP.classList.add("display-flex");
    const activateBtn = document.querySelector("#js-activate-btn");
    const deactivateBtn = document.querySelector("#js-deactivate-btn");
    const deleteBtn = document.querySelector("#js-delete-btn");
    const confirmationTxt = document.querySelector("#js-confirmation-txt");
    activateBtn.addEventListener("click", () => {
      confirmationTxt.textContent = "ACTIVATE";
    });
    deactivateBtn.addEventListener("click", () => {
      confirmationTxt.textContent = "DEACTIVATE";
    });
    deleteBtn.addEventListener("click", () => {
      confirmationTxt.textContent = "DELETE";
    });
  }

  /* -------------------------- MODAL ------------------------*/
  const modalTrigger = document.querySelectorAll(".modal-trigger");
  if (modalTrigger) {
    const modalContainer = document.querySelector(".modal-container");
    const modalCloseBtn = document.querySelectorAll(".modal-close-btn");

    function toggleModal() {
      modalContainer.classList.toggle("show-modal");
    }

    modalTrigger.forEach(trigger => {
      trigger.addEventListener("click", toggleModal);
      modalCloseBtn.forEach(closeBtn => {
        closeBtn.addEventListener("click", toggleModal);
      });
    });
    window.addEventListener("click", function(e) {
      if (e.target === modalContainer) {
        toggleModal();
      }
    });
  }
  function toggleAccInput(trxTglBtn) {
    trxTglBtn.forEach(btn => {
      btn.addEventListener("click", e => {
        acctInputContainer.classList.toggle("display-flex");
        e.preventDefault();
      });
    });
  }
});
