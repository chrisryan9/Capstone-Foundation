const baseURL5 = 'http://localhost:8080'

const tournamentsUserIdContainer = document.querySelector('#user-id-container');
const tournamentUserId = sessionStorage.getItem('user_id');

if (tournamentUserId) {
  tournamentsUserIdContainer.innerHTML = `<p>User ID: ${tournamentUserId}</p>`;
  tournamentsUserIdContainer.style.display = "block";

  const signUpBtn = document.querySelector('.sign-up-btn');
  const loginBtn = document.querySelector('.login-btn');
  loginBtn.style.display = "none";
  signUpBtn.style.display = "none";
}