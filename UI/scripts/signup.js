localStorage.setItem('baseUrl', 'https://calm-dusk-51134.herokuapp.com/api/v1');

const toggleForm = document.querySelectorAll('.js-tgl-form');
const container = document.getElementById('js-container');

toggleForm.forEach((click) => {
  click.addEventListener('click', () => {
    container.classList.toggle('right-box-active');
  });
});

/* =============================== Signup /sign in user ========================== */
const createFormData = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const createdObject = {};
  for (const [key, value] of formData) {
    createdObject[key] = value;
  }
  return createdObject;
};

const formError = document.querySelectorAll('.formError');

const queryAuth = (url, formContent) => {
  const options = {
    method: 'POST',
    body: JSON.stringify(formContent),
    headers: new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }),
  };

  fetch(url, options)
    .then(res => res.json())
    .then((res) => {
      if (res.error) {
        formError.forEach((form) => {
          form.innerHTML = res.error;
          form.style.visibility = 'visible';
          setTimeout(() => {
            form.style.visibility = 'hidden';
          }, 6000);
        });
      } else {
        const userType = res.data.type;
        localStorage.setItem('userType', userType);
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.data.id);
        localStorage.setItem('userEmail', res.data.email);
        if (userType === 'admin') {
          window.location.assign('dashboard-admin.html');
        } else if (userType === 'cashier') {
          window.location.assign('dashboard-staff.html');
        } else {
          window.location.assign('dashboard-client.html');
        }
      }
    })
    // eslint-disable-next-line no-console
    .catch(err => console.log(err));
};

/* --------------------- Sign up --------------------*/

const signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit', (event) => {
  const createdObject = createFormData(event);

  if (!createdObject.othername) createdObject.othername = undefined;
  queryAuth(`${localStorage.getItem('baseUrl')}/auth/user/signup`, createdObject);
});

/* -------------------------- Sign in --------------------- */
const signinForm = document.getElementById('signin-form');

signinForm.addEventListener('submit', (event) => {
  const createdObject = createFormData(event);
  queryAuth(`${localStorage.getItem('baseUrl')}/auth/signin`, createdObject);
});
