const baseURL3 = 'http://localhost:8080'

const accountID = document.querySelector('#account-id-select');
const coachID = document.querySelector('#coach-select');
const trainingDate = document.querySelector('#training-date');
const trainingTime = document.querySelector('#training-time');
const trainingNotes = document.querySelector('#notes');
const createTraining = document.querySelector('.schedule-training')

const scheduleUserIdContainer = document.querySelector('#user-id-container');
const scheduleUserId = sessionStorage.getItem('user_id');

if (scheduleUserId) {
  scheduleUserIdContainer.innerHTML = `<p>User ID: ${scheduleUserId}</p>`;
  scheduleUserIdContainer.style.display = "block";

  const signUpBtn = document.querySelector('.sign-up-btn');
  const loginBtn = document.querySelector('.login-btn');
  loginBtn.style.display = "none";
  signUpBtn.style.display = "none";
}


createTraining.addEventListener('click', function(e) {
    e.preventDefault();

    if (!accountID.value || !coachID.value || !trainingDate.value || !trainingTime.value) {
        alert("All fields are required");
        return;
    }

    let time = trainingTime.value;
let timeArray = time.split(":");
let hours = parseInt(timeArray[0]);
let minutes = parseInt(timeArray[1]);

let formattedTime = hours >= 12 ? `${hours - 12}:${minutes} PM` : `${hours}:${minutes} AM`;

let body = {
    user_id: accountID.value,
    coach_id: coachID.value,
    date: trainingDate.value,
    time: formattedTime,
    notes: trainingNotes.value
}
    
// console.log('Request Body:', body);

    axios.post(`${baseURL3}/schedule`, body)
        .then(response => {
            if (response.status === 200) {


                accountID.value = '';
                coachID.value = '';
                trainingDate.value = '';
                trainingTime.value = '';
                trainingNotes.value = '';

                const scheduleContainer = document.querySelector('.schedule-training-container');
                scheduleContainer.innerHTML = '<p class="schedule-successsful">Training Scheduled!</p>';

                const emailSent = document.querySelector('.email-sent');
                emailSent.innerHTML = '<p class="email-successful">Email Sent</p><div class="loading-bar"></div>';


                setTimeout(() => {
                    scheduleContainer.innerHTML = '';
                    emailSent.innerHTML = '';
                    }, 2500);
            }
        })
        .catch(error => {
            console.error(error.message, error.response);
            alert("Failed to schedule training");
        });
});


const getCoaches = () => {
    axios.get(`${baseURL3}/getCoaches`)
      .then(res => {
        const defaultOption = document.createElement('option');
        defaultOption.setAttribute('value', '');
        defaultOption.textContent = 'Coaches Name';
        coachID.appendChild(defaultOption);


        res.data.forEach(coach => {
          const option = document.createElement('option');
          option.setAttribute('value', coach.coach_id);
          option.textContent = coach.coach_name;
          coachID.appendChild(option);
        });
      })
      .catch(err => console.log(err));
};

const getUsers = () => {
    axios.get(`${baseURL3}/getUsers`)
    .then(res => {
        const defaultOption = document.createElement('option');
        defaultOption.setAttribute('value', '');
        defaultOption.textContent = 'User ID';
        accountID.appendChild(defaultOption);

        res.data.forEach(user => {
            const option = document.createElement('option');
            option.setAttribute('value', user.user_id);
            option.textContent = user.user_id;
            accountID.appendChild(option);
        });
    })
    .catch(err => console.log(err));
};


getCoaches();
getUsers();
