/* eslint-disable import/extensions */
import fetchApi from './fetchApi.mjs';
import createHtmlElement from '../createElement.mjs';
import loadingAnimation from '../modules/loadingAnimation.mjs';

document.addEventListener('DOMContentLoaded', async () => {
  const baseUrl = localStorage.getItem('baseUrl');
  const accountNumber = localStorage.getItem('accountNumber');
  const accountURL = `${baseUrl}/accounts/${accountNumber}/`;

  /* css loading animation */
  const animationContainer = document.querySelector('.css-loading-animation');
  animationContainer.innerHTML = loadingAnimation();

  const account = await fetchApi(accountURL, 'GET');

  const userURL = `${baseUrl}/users/${account.owner}/`;
  const user = await fetchApi(userURL, 'GET');

  account.createdOn = account.createdOn.substring(0, 16).replace('T', ' ');

  const html = `
    <div class = 'card-data-grid'>
      <p class="card-key card-i">Balance</p>
      <span class="card-value card-i digit">₦${Number(account.balance).toLocaleString()}</span>

      <p class="card-key">Account number</p>
      <span class="card-value digit">${account.accountNumber}</span>

      <p class="card-key">Account name</p>
      <span class="card-value">${user.firstname} ${user.lastname}</span>

      <p class="card-key">Type</p>
      <span class="card-value capitalize">${account.type}</span>

      <p class="card-key">Status</p>
      <span class="card-value capitalize">${account.status}</span>

      <p class="card-key">Created</p>
      <span class="card-value digit">${account.createdOn}</span>

      <p class="card-key">Email</p>
      <span class="card-value">${user.email}</span>
    </div>
  `;

  animationContainer.innerHTML = '';
  const cardDiv = createHtmlElement(html);
  const accountCard = document.querySelector('.account-card');
  accountCard.insertAdjacentElement('beforeend', cardDiv);
});
