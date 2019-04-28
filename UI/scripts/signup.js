localStorage.setItem('baseUrl', 'https://calm-dusk-51134.herokuapp.com/api/v1');

const toggleForm = document.querySelectorAll('.js-tgl-form');
const container = document.getElementById('js-container');

toggleForm.forEach((click) => {
  click.addEventListener('click', () => {
    container.classList.toggle('right-box-active');
  });
});

/* =============================== Signup /sign in user ========================== */
const formError = document.querySelector('.formError');

const queryAuth = (url, formContent) => {
  const options = {
    method: 'POST',
    body: JSON.stringify(formContent),
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }),
  };
  formError.style.visibility = 'hidden';

  fetch(url, options)
    .then(res => res.json())
    .then((res) => {
      if (res.error) {
        formError.innerHTML = res.error;
        formError.style.visibility = 'visible';
      } else {
        localStorage.setItem('token', res.token);
        localStorage.setItem('id', res.data.id);
        if (res.data.isAdmin) {
          window.location.assign('dashboard-admin.html');
        } else {
          window.location.assign('dashboard-client.html');
        }
      }
    })
    .catch(err => console.log(err));
};

/* --------------------- Sign up --------------------*/

const signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const userObject = {};
  for (const [key, value] of formData) {
    userObject[key] = value;
  }

  if (!userObject.othername) userObject.othername = undefined;
  queryAuth(`${localStorage.getItem('baseUrl')}/auth/user/signup`, userObject);
});
