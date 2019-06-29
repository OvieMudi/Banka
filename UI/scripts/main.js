/* eslint-disable require-jsdoc */
const user = localStorage.getItem('userType');
const role = user === 'client' ? 'client' : 'staff';

// Set Base API
// localStorage.setItem('baseUrl', 'https://calm-dusk-51134.herokuapp.com/api/v1');

/* ---------- PAGE NAVIGATION ------------------ */
const accountsNavLink = document.getElementById('accounts-link');

// Set Sticky Nav links
if (accountsNavLink) {
  accountsNavLink.setAttribute('href', `./dashboard-${role}.html`);
}

const accountsNavLinkAdmin = document.getElementById('accounts-link-admin');
if (accountsNavLinkAdmin) {
  accountsNavLinkAdmin.setAttribute('href', `./dashboard-${user}.html`);
}

// Main nav hamburber menu
const navbarToggle = document.getElementById('js-navbar-toggle');
const mainNavlinks = document.getElementById('js-navlinks');

navbarToggle.addEventListener('click', () => {
  mainNavlinks.classList.toggle('visible');
});

// input container
const acctInputContainer = document.querySelector('.inputContainer');

/* ------------------- ADMIN PAGES ------------------------- */
const adminLink = document.getElementById('admin-link');
if (user === 'admin') {
  adminLink.classList.remove('display-none');
}

/* -------------  CASHIER TRANSACTIONS SECTION ------------------- */
const trxTglBtn = document.querySelectorAll('.js-input-tgl-btn');
const cashierSection = document.querySelector('.js-cashier-trx-section');
if (cashierSection && user === 'cashier') {
  cashierSection.classList.add('display-flex');
  toggleAccInput(trxTglBtn);
}

/* ------------------ STAFF DASHBOARD SECTION -------------- */
const staffSearchSection = document.querySelector('.js-staff-search-section');
if (staffSearchSection && role === 'staff') {
  staffSearchSection.classList.add('display-block');
  toggleAccInput(trxTglBtn);
}

/* ------------------- SINGLE ACCOUNT PAGE ------------------ */
const cashierAcctOP = document.querySelector('.cashier-acct-op');
const adminAcctOP = document.querySelector('.admin-acct-op');
// Cashier Operations
if (user === 'cashier' && cashierAcctOP) {
  cashierAcctOP.classList.add('display-flex');
  // show Credit/Debit input
  const creditBtn = document.querySelector('#js-credit-btn');
  const debitBtn = document.querySelector('#js-dedit-btn');
  const creditDebitBtn = document.querySelector('#js-credit-debit-btn');
  // Change button textcontent on click
  if (creditBtn) {
    creditBtn.addEventListener('click', () => {
      acctInputContainer.classList.add('display-flex');
      creditDebitBtn.textContent = 'Credit';
    });
  }
  if (debitBtn) {
    debitBtn.addEventListener('click', () => {
      acctInputContainer.classList.add('display-flex');
      creditDebitBtn.textContent = 'Dedit';
    });
  }
  if (creditDebitBtn) {
    debitBtn.addEventListener('click', () => {
      acctInputContainer.classList.add('display-flex');
    });
  }
  // Admin operations delete/activate/deactivate
} else if (user === 'admin' && adminAcctOP) {
  adminAcctOP.classList.add('display-flex');
  const activateBtn = document.querySelector('#js-activate-btn');
  const deactivateBtn = document.querySelector('#js-deactivate-btn');
  const deleteBtn = document.querySelector('#js-delete-btn');
  const confirmationTxt = document.querySelector('#js-confirmation-txt');
  if (activateBtn) {
    activateBtn.addEventListener('click', () => {
      confirmationTxt.textContent = 'ACTIVATE';
    });
  }
  if (deactivateBtn) {
    deactivateBtn.addEventListener('click', () => {
      confirmationTxt.textContent = 'DEACTIVATE';
    });
  }
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      confirmationTxt.textContent = 'DELETE';
    });
  }
}

/* -------------------------- MODAL ------------------------*/
const modalTrigger = document.querySelectorAll('.modal-trigger');
if (modalTrigger) {
  const modalContainer = document.querySelectorAll('.modal-container');
  const modalCloseBtn = document.querySelectorAll('.modal-close-btn');
  let modalOverlay;

  const toggleModal = () => {
    modalContainer.forEach((mContainer) => {
      mContainer.classList.toggle('show-modal');
      modalOverlay = mContainer;
    });
  };

  modalTrigger.forEach((trigger) => {
    trigger.addEventListener('click', toggleModal);
    modalCloseBtn.forEach((closeBtn) => {
      closeBtn.addEventListener('click', toggleModal);
    });
  });
  window.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      toggleModal();
    }
  });
}
function toggleAccInput(toggle) {
  toggle.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      acctInputContainer.classList.toggle('display-flex');
      e.preventDefault();
    });
  });
}

/* ------------------------ Sign out --------------------- */
const signout = (event) => {
  event.preventDefault();
  localStorage.clear();
  window.location.assign('./signup.html');
};

const signoutButtons = document.querySelectorAll('.js-signout');
signoutButtons.forEach((signoutBtn) => {
  signoutBtn.addEventListener('click', signout);
});
