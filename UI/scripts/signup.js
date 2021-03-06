localStorage.setItem('baseUrl', 'https://calm-dusk-51134.herokuapp.com/api/v1');
// localStorage.clear();
// localStorage.setItem('baseUrl', 'http://localhost:3000/api/v1');

/* =========================== Toggle signup/signin form ========================== */
const toggleForm = document.querySelectorAll('.js-tgl-form');
const container = document.getElementById('js-container');

toggleForm.forEach((click) => {
  click.addEventListener('click', () => {
    container.classList.toggle('right-box-active');
  });
});

/* =============================== Signup /sign in user ========================== */
document.addEventListener('DOMContentLoaded', () => {
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
            hideAnimation();
            form.innerHTML = res.error;
            form.style.display = 'block';
            setTimeout(() => {
              form.style.display = 'none';
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
    showAnimation();

    const createdObject = createFormData(event);

    if (!createdObject.othername) createdObject.othername = undefined;
    queryAuth(`${localStorage.getItem('baseUrl')}/auth/user/signup`, createdObject);
  });

  /* -------------------------- Sign in --------------------- */
  const signinForm = document.getElementById('signin-form');
  signinForm.addEventListener('submit', (event) => {
    showAnimation();

    const createdObject = createFormData(event);

    queryAuth(`${localStorage.getItem('baseUrl')}/auth/signin`, createdObject);
  });
});

/**
 * Creates form object from form data
 * @param {object} event - DOM event
 * @returns {null} -
 */
function createFormData(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const createdObject = {};
  for (const [key, value] of formData) {
    createdObject[key] = value;
  }
  return createdObject;
}

/**
 * displays turning-circle loading animation
 * @returns {undefined} -
 */
function showAnimation() {
  const loadingAnimation = document.querySelectorAll('.sk-fading-circle');
  loadingAnimation.forEach((animation) => {
    animation.classList.remove('display-none');
  });
}

/**
 * removes turning-circle loading animation
 * @returns {undefined} -
 */
function hideAnimation() {
  const loadingAnimation = document.querySelectorAll('.sk-fading-circle');
  loadingAnimation.forEach((animation) => {
    animation.classList.add('display-none');
  });
}
