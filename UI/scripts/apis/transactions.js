/* eslint-disable import/extensions */
import fetchApi from './fetchApi.mjs';
import loadingAnimation from '../modules/loadingAnimation.mjs';
import createHtmlElement from '../createElement.mjs';

const user = localStorage.getItem('userType');
const role = user === 'client' ? 'client' : 'staff';
const baseUrl = localStorage.getItem('baseUrl');
const userEmail = localStorage.getItem('userEmail');
const allTransactionsUrl = `${baseUrl}/transactions`;
const userTransactionsUrl = `${baseUrl}/user/${userEmail}/transactions`;
let url;

if (!userEmail) {
  window.location.assign('./signup.html');
}

if (role === 'staff') url = allTransactionsUrl;
else url = userTransactionsUrl;

window.addEventListener('DOMContentLoaded', async () => {
  const tBodyTransactions = document.querySelector('#tbody_transactions');
  if (tBodyTransactions) {
    /* css loading animation */
    tBodyTransactions.innerHTML = loadingAnimation();
    const transactions = await fetchApi(url, 'GET');

    /* remove css loading animation */
    tBodyTransactions.innerHTML = '';
    transactions.forEach((transaction, idx) => {
      const index = idx + 1;
      const html = `
        <tr id="item${index}" role="row" data-href="./transaction-details.html">
          <th headers="columnheader${index}" role="rowheader" scope="row">
            <span aria-hidden="true" class="col-header">Trx ID</span>
            <span>${transaction.id}</span>
          </th>
          <td headers="item${index} columnheader2" role="cell">
            <span aria-hidden="true" class="col-header">Acct Number</span>
            <span class="digit">${transaction.accountNumber}</span>
          </td>
          <td headers="item${index} columnheader3" role="cell">
            <span aria-hidden="true" class="col-header">Amount</span>
            <span class="digit">${transaction.amount}</span>
          </td>
          <td headers="item${index} columnheader4" role="cell">
            <span aria-hidden="true" class="col-header">Trx type</span>
            <span>${transaction.type}</span>
          </td>
          <td headers="item${index} columnheader5" role="cell">
            <span aria-hidden="true" class="col-header">Balance</span>
            <span class="digit">${transaction.newBalance}</span>
          </td>
          <td headers="item${index} columnheader6" role="cell">
            <span aria-hidden="true" class="col-header">Date</span>
            <span class="digit">${transaction.createdOn.substring(0, 10).replace('T', ' ')}</span>
          </td>
        </tr>
      `;

      const tr = createHtmlElement(html);

      tr.addEventListener('click', () => {
        localStorage.setItem('accountNumber', transaction.accountNumber);
        window.location.href = tr.dataset.href;
      });

      tBodyTransactions.insertAdjacentElement('afterbegin', tr);
    }); // end forEach
  }
});
