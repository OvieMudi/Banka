/* eslint-disable func-names */
document.addEventListener('DOMContentLoaded', () => {
  /* -----------Text input--------------- */
  const textInputs = document.querySelectorAll('input[type=text]');
  textInputs.forEach((input) => {
    input.addEventListener('input', function () {
      if (this.validity.tooShort) {
        this.setCustomValidity('Too short. Please enter at least 3 characters');
        this.classList.add('errorInput');
      } else if (this.validity.patternMismatch) {
        this.setCustomValidity('Please enter valid characters e.g James');
        this.classList.add('errorInput');
      } else {
        this.setCustomValidity('');
        this.classList.remove('errorInput');
      }
    });
  });

  /* -----------Email input--------------- */
  const emailInputs = document.querySelectorAll('input[type=email]');
  emailInputs.forEach((input) => {
    input.addEventListener('input', function () {
      if (this.validity.typeMismatch) {
        this.setCustomValidity('A valid email is required');
        this.classList.add('errorInput');
      } else {
        this.setCustomValidity('');
        this.classList.remove('errorInput');
      }
    });
  });

  /* -----------Passorword input--------------- */
  const passwordInputs = document.querySelectorAll('input[type=password]');
  passwordInputs.forEach((input) => {
    input.addEventListener('input', function () {
      if (this.validity.patternMismatch) {
        this.setCustomValidity('Password must be: at least 6 characters, 1 letter and 1 number');
        this.classList.add('errorInput');
      } else {
        this.setCustomValidity('');
        this.classList.remove('errorInput');
      }
    });
  });

  // ------------password match
  const passwordInput1 = document.querySelector('#passwordInput1');
  const passwordInput2 = document.querySelector('#passwordInput2');

  passwordInput2.addEventListener('input', (event) => {
    const match = passwordInput1.value === passwordInput2.value;
    if (!match) {
      passwordInput2.setCustomValidity('Passwords do not match');
      event.preventDefault();
    } else {
      passwordInput2.setCustomValidity('');
    }
  });

  /* -----------Phone number input--------------- */
  const phoneNumberInput = document.querySelector('input[name=phoneNumber]');
  phoneNumberInput.addEventListener('input', function () {
    if (this.validity.patternMismatch) {
      this.setCustomValidity('Please enter a valid phone number');
      this.classList.add('errorInput');
    } else if (this.validity.tooShort) {
      this.setCustomValidity('Phone number must be at least 10 characters');
      this.classList.add('errorInput');
    } else {
      this.setCustomValidity('');
      this.classList.remove('errorInput');
    }
  });
});
