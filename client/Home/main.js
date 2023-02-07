const baseURL = 'http://localhost:8080'

const mainUserIdContainer = document.querySelector('#user-id-container');
const mainUserId = sessionStorage.getItem('user_id');

if (mainUserId) {
  mainUserIdContainer.innerHTML = `<p>User ID: ${mainUserId}</p>`;
  mainUserIdContainer.style.display = "block";

  const signUpBtn = document.querySelector('.sign-up-btn');
  const loginBtn = document.querySelector('.login-btn');
  loginBtn.style.display = "none";
  signUpBtn.style.display = "none";
}