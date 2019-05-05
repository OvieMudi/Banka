/* =================== Create Account ============== */
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
    .then(() => {
      window.location.reload();
    })
    .catch(err => console.log(err));
};

const accountSelect = document.getElementById('js-account-select');
const accountForm = document.getElementById('account-form');
accountForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formContent = {
    type: accountSelect.value,
  };
  createAccount(createAccountUrl, formContent);
});
