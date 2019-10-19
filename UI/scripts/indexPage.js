const navLogin = document.querySelector('#loginBtn');

setInterval(() => {
  navLogin.classList.remove('animate-twerkIt');
  // eslint-disable-next-line no-void
  void navLogin.offsetWidth;
  navLogin.classList.add('animate-twerkIt');
}, 6000);
