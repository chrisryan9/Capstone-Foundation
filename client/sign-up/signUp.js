const baseURL1 = 'http://localhost:8080'

const signupName = document.querySelector('#sign-up-name');
const signupEmail = document.querySelector('#sign-up-email');
const signupPassword = document.querySelector('#sign-up-password');
const signupPasswordVer = document.querySelector('#sign-up-password-verify');
const signupPhoneNum = document.querySelector('#sign-up-phone-number');
const submitButton = document.querySelector(".submit-btn");


submitButton.addEventListener("click", function(event) {
  event.preventDefault();

      if (!signupName.value || !signupEmail.value || !signupPassword.value || !signupPasswordVer.value || !signupPhoneNum.value) {
        alert("All fields are required.");
        return;
      }
      
      let error = document.querySelector('#error')

      // Check that the passwords match
  if (signupPassword.value !== signupPasswordVer.value) {
    error.innerHTML = '<p class="password-error">Passwords must match</p>';
    return;
  } 

  // Check that the password has at least 8 characters and contains at least one letter and one number
  let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(signupPassword.value)) {
    error.innerHTML = '<p class="password-error">Password must be at least 8 characters and contain at least one letter and one number</p>';
    return;
  } 

  // Check that the email address is valid
  let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(signupEmail.value)) {
    error.innerHTML = '<p class="password-error">Invalid email address</p>';
    return;
  }
      
      axios.post(`${baseURL1}/signup`, {
        user_name: signupName.value,
          email: signupEmail.value,
          password: signupPassword.value,
          passwordVerify: signupPasswordVer.value,
          phone_number: signupPhoneNum.value
        })
        .then(response => {
          // Clear the values of the input fields
          signupName.value = '';
          signupEmail.value = '';
          signupPassword.value = '';
          signupPasswordVer.value = '';
          signupPhoneNum.value = '';
        
          // Update the HTML of the sign-up container
          const signupContainer = document.querySelector('.successful-signup');
          signupContainer.innerHTML = '<p class="sign-up-successful">Sign up successful!<br><span class="spinner-signup"></span></p>';


          setTimeout(function() {
            window.location.href = "../login/login.html";
          }, 1700);

        })
        .catch(error => {
          console.error(error);
        });
})