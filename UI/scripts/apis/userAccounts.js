window.addEventListener('load', () => {
  const token = localStorage.getItem('token');
  const baseUrl = localStorage.getItem('baseUrl');
  const userEmail = localStorage.getItem('userEmail');
  const url = `${baseUrl}/user/${userEmail}/accounts`;

  const options = {
    method: 'GET',
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': token,
    }),
  };

  fetch(url, options)
    .then(res => res.json())
    .then((res) => {
      let accounts = '';
      if (res.data) {
        res.data.forEach((account) => {
          accounts += `
            <a href="./account-details.html" class="acct-summary">
              <span class="row">
                <span class="digit"><i class="fas fa-coins"></i> ${account.accountNumber}</span>
                <span class="acc-type mob-display-none">${account.type}</span>
                <span class="digit">₦${account.balance}</span>
                <span class="acct-${account.status}"><i class="fas fa-circle"></i></span>
              </span>
            </a>
          `;
        });
      }
      const accountsContainer = document.querySelector('.accts-container');
      accountsContainer.innerHTML = accounts;
    })
    .catch(err => console.log(err));
});
