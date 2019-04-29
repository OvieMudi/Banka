//* =================== Create Account ============== */
const token = localStorage.getItem('token');
const baseUrl = localStorage.getItem('baseUrl');
const createAccountUrl = `${baseUrl}/accounts`;

const createAccount = (url, formContent) => {
  const options = {
    method: 'POST',
    body: JSON.stringify(formContent),
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': token,
    }),
  };

  fetch(url, options)
    .then(res => res.json())
    .then((res) => {
      let accountHTML = '';
      if (res.data) {
        const account = res.data;
        accountHTML += `
          <a href="./account-details.html" class="acct-summary">
            <span class="row">
              <span class="digit"><i class="fas fa-coins"></i> ${account.accountNumber}</span>
              <span class="acc-type mob-display-none">${account.type}</span>
              <span class="digit">₦${account.balance}</span>
              <span class="acct-${account.status}"><i class="fas fa-circle"></i></span>
            </span>
          </a>
        `;
      }
      const accountsContainer = document.querySelector('.accts-container');
      accountsContainer.insertAdjacentHTML('afterbegin', accountHTML);
    })
    .catch(err => console.log(err));
};

const accountSelect = document.getElementById('js-account-select');
const accountCreateBtn = document.getElementById('js-account-proceed');
accountCreateBtn.addEventListener('click', () => {
  const formContent = {
    type: accountSelect.value,
  };
  createAccount(createAccountUrl, formContent);
  window.location.assign('./dashboard-client.html');
});
