const baseURL2 = 'http://localhost:8080'

const loginEmail = document.querySelector('#login');
const loginPassword = document.querySelector('#password');
const loginBtn = document.querySelector('.login-btn-submit');

loginBtn.addEventListener('click', function(event) {
    event.preventDefault();

    if (!loginEmail.value || !loginPassword.value) {
        alert('All fields are required.');
        return;
    }

    let error = document.querySelector('#loginError');

    axios.post(`${baseURL2}/login`, {
        email: loginEmail.value,
        password: loginPassword.value
    })
    .then(response => {

        if (response.data.message === 'Successfully logged in') {

            sessionStorage.setItem('user_id', response.data.user_id);
            
            // Update the HTML of the sign-up container
          const signupContainer = document.querySelector('.successful-login');
          signupContainer.innerHTML = '<p class="login-successful">Login successful!</p><span class="spinner"></span>';
          
          setTimeout(function() {
            window.location.href = "../home/index.html";
          }, 1700);

        } else {
            error.innerHTML = '<p class="password-error">Email or password is incorrect</p>';
        }
    })
    .catch(error => {
        console.error(error);
        console.log(error);
        alert('An error occurred. Please try again later.');
    });
});