/* eslint-disable import/extensions */
import fetchApi from './fetchApi.mjs';
import createHtmlElement from '../createElement.mjs';

const baseUrl = localStorage.getItem('baseUrl');
const userEmail = localStorage.getItem('userEmail');
const allAccountsUrl = `${baseUrl}/accounts`;
const accountsByEmailUrl = `${baseUrl}/user/${userEmail}/accounts`;
const allUsersUrl = `${baseUrl}/users`;

if (!userEmail) {
  window.location.assign('./signup.html');
}

window.addEventListener('DOMContentLoaded', async () => {
  /* ----------- Client Dashboard ----------- */
  const accountsContainer = document.querySelector('.accts-container');
  if (accountsContainer) {
    const clientAccounts = await fetchApi(accountsByEmailUrl, 'GET');
    clientAccounts.forEach((account) => {
      const html = `
        <a class="acct-summary" href="./account-details.html">
          <span class="row">
            <span class="digit"><i class="fas fa-coins"></i> ${account.accountNumber}</span>
            <span class="acc-type mob-display-none">${account.type}</span>
            <span class="digit">₦${account.balance}</span>
            <span class="acct-${account.status}"><i class="fas fa-circle"></i></span>
          </span>
        </a>
      `;

      const anchorTag = createHtmlElement(html);

      anchorTag.addEventListener('click', () => {
        localStorage.setItem('accountNumber', account.accountNumber);
      });

      accountsContainer.insertAdjacentElement('afterbegin', anchorTag);
    }); // end forEach
  }

  /* ----------------- Staff Dashboard ----------------- */
  const tBodyAccounts = document.querySelector('#tbody_accounts');
  if (tBodyAccounts) {
    const allAccounts = await fetchApi(allAccountsUrl, 'GET');
    const users = await fetchApi(allUsersUrl, 'GET');

    allAccounts.forEach((account, idx) => {
      const index = idx + 1;
      const user = users.find(obj => obj.id === account.owner);
      const html = `
        <tr id="item${index}" role="row" data-href="./account-details.html">
          <th headers="columnheader${index}" role="rowheader" scope="row">
            <span aria-hidden="true" class="col-header">Account no</span>
            <span class="digit">${account.accountNumber}</span>
          </th>
          <td headers="item${index} columnheader2" role="cell">
            <span aria-hidden="true" class="col-header">Account type</span>
            <span>${account.type}</span>
          </td>
          <td headers="item${index} columnheader3" role="cell">
            <span aria-hidden="true" class="col-header">Balance</span>
            <span class="digit">₦${Number(account.balance).toLocaleString()}</span>
          </td>
          <td headers="item${index} columnheader4" role="cell">
            <span aria-hidden="true" class="col-header">Firstname</span>
            <span>${user.firstname}</span>
          </td>
          <td headers="item${index} columnheader5" role="cell">
            <span aria-hidden="true" class="col-header">Lastname</span>
            <span>${user.lastname}</span>
          </td>
          <td headers="item${index} columnheader6" role="cell">
            <span aria-hidden="true" class="col-header">Status</span>
            <span>${account.status}</span>
          </td>
        </tr>
      `;

      const tr = createHtmlElement(html);
      console.log(tr);

      tr.addEventListener('click', () => {
        localStorage.setItem('accountNumber', account.accountNumber);
        window.location.href = tr.dataset.href;
      });

      tBodyAccounts.insertAdjacentElement('afterbegin', tr);
    });
  }
});
