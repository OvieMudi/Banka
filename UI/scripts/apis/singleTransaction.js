/* eslint-disable import/extensions */
import fetchApi from './fetchApi.mjs';
import createHtmlElement from '../createElement.mjs';
import loadingAnimation from '../modules/loadingAnimation.mjs';

document.addEventListener('DOMContentLoaded', async () => {
  const baseUrl = localStorage.getItem('baseUrl');
  const accountNumber = localStorage.getItem('accountNumber');
  const accountURL = `${baseUrl}/accounts/${accountNumber}/`;
  const transactionId = localStorage.getItem('transactionId');
  const transactionURL = `${baseUrl}/transactions/${transactionId}/`;

  /* css loading animation */
  const animationContainer = document.querySelector('.css-loading-animation');
  animationContainer.innerHTML = loadingAnimation();

  const transaction = await fetchApi(transactionURL, 'GET');
  const account = await fetchApi(accountURL, 'GET');
  const userURL = `${baseUrl}/users/${account.owner}/`;
  const user = await fetchApi(userURL, 'GET');

  transaction.createdOn = transaction.createdOn.substring(0, 16).replace('T', ' ');

  const html = `
      <div class="card-data-grid">
        <p class="card-key">Transaction ID</p>
        <span class="card-value">${transaction.id}</span>

        <p class="card-key">Account number</p>
        <span class="card-value">${transaction.accountNumber}</span>

        <p class="card-key">Account name</p>
        <span class="card-value">${user.firstname} ${user.lastname}</span>

        <p class="card-key card-i">Transaction Type</p>
        <span class="card-value card-i">${transaction.type.toUpperCase()}</span>

        <p class="card-key">Amount</p>
        <span class="card-value">${transaction.amount}</span>

        <p class="card-key">Balance</p>
        <span class="card-value">${transaction.newBalance}</span>

        <p class="card-key">Date</p>
        <span class="card-value">${transaction.createdOn}</span>
      </div>
      `;

  animationContainer.innerHTML = '';
  const cardDiv = createHtmlElement(html);
  const transactionCard = document.querySelector('.transaction-card');
  transactionCard.insertAdjacentElement('beforeend', cardDiv);
});
