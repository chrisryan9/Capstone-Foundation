const baseURL4 = 'http://localhost:8080'

const accountID = document.querySelector('#account-id-select');
const coachID = document.querySelector('#coach-select');
const trainingDate = document.querySelector('#training-date');
const trainingNotes = document.querySelector('#notes');
const myTrainings = document.querySelector('.get-appointments');
const pastAppointmentsContainer = document.querySelector('#past-list-appointments');
const upcomingAppointmentsContainer = document.querySelector('#upcoming-list-appointments');

const pastHeaderAppointmentsContainer = document.querySelector('#past-header-html');
const upcomingHeaderAppointmentsContainer = document.querySelector('#upcoming-header-html');


const trainingsUserIdContainer = document.querySelector('#user-id-container');
const trainingsUserId = sessionStorage.getItem('user_id');

if (trainingsUserId) {
  trainingsUserIdContainer.innerHTML = `<p>User ID: ${trainingsUserId}</p>`;
  trainingsUserIdContainer.style.display = "block";

  const signUpBtn = document.querySelector('.sign-up-btn');
  const loginBtn = document.querySelector('.login-btn');
  loginBtn.style.display = "none";
  signUpBtn.style.display = "none";
}

const getUsers = () => {
    axios.get(`${baseURL4}/getUsers`)
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

// let getTrainingsFlag = false;


myTrainings.addEventListener('click', function getTrainings(e) {
    // if (getTrainingsFlag) return;
    // getTrainingsFlag = true;
    
    const accountIDElement = document.querySelector('#account-id-select');
  
    if (!accountIDElement.value) {
        alert("Please select a user ID");
        return;
    }
  
    const userID = accountIDElement.value;
  
    axios.get(`${baseURL4}/schedule/${userID}`)
    .then(res => {
      pastAppointmentsContainer.innerHTML = '';
      upcomingAppointmentsContainer.innerHTML = '';
      console.log(res.data)

      const pastTrainings = [];
      const upcomingTrainings = [];
      res.data.forEach(training => {
        let trainingDate = moment.parseZone(training.date, 'YYYY, MM, DD');

        if (moment().isAfter(trainingDate)) {
          pastTrainings.push(training);
        } else {
          upcomingTrainings.push(training);
        }
      });

      // Sort upcoming trainings by date
      upcomingTrainings.sort((a, b) => {
        let aDate = moment.parseZone(a.date, 'YYYY, MM, DD');
        let bDate = moment.parseZone(b.date, 'YYYY, MM, DD');
        return aDate.diff(bDate);
      });

      let existingHeaders = document.querySelectorAll('#past-header, #upcoming-header');
      existingHeaders.forEach(header => header.remove());

      // Render past trainings header
      pastHeaderAppointmentsContainer.innerHTML += `<h2 id="past-header">Past Trainings:</h2>`;
      // Render past trainings
      pastTrainings.forEach(training => {
        let unformattedDate = moment.parseZone(training.date, 'YYYY, MM, DD').format('MMMM Do, YYYY');
        let unformattedTime = moment.parseZone(training.time, 'HH:mm:ss').format('h:mm A');

        pastAppointmentsContainer.innerHTML += `
        <div class="past-training-container">
          <div class="training">
            <p>Date: ${unformattedDate}</p>
            <p>Time: ${unformattedTime}</p>
            <p>Coach: ${training.coach_name}</p>
            <p>Notes: ${training.notes}</p>
          </div>
        </div>
        `;
      });

      if (upcomingTrainings.length === 0) {
        upcomingHeaderAppointmentsContainer.innerHTML += `<h2 id="upcoming-header">Upcoming Trainings:</h2>`;
        upcomingAppointmentsContainer.innerHTML += `<p class="no-trainings">No upcoming trainings</p>`;
      } else {
        // Render upcoming trainings header
        upcomingHeaderAppointmentsContainer.innerHTML += `<h2 id="upcoming-header">Upcoming Trainings:</h2>`;
        // Render upcoming trainings
      upcomingTrainings.forEach(training => {
        let unformattedDate = moment.parseZone(training.date, 'YYYY, MM, DD').format('MMMM Do, YYYY');
        let unformattedTime = moment.parseZone(training.time, 'HH:mm:ss').format('h:mm A');

        upcomingAppointmentsContainer.innerHTML += `
        <div class="upcoming-training-container">
          <div class="training">
            <p>Date: ${unformattedDate}</p>
            <p>Time: ${unformattedTime}</p>
            <p>Coach: ${training.coach_name}</p>
            <p>Notes: ${training.notes}</p>
              <button id="cancelbtn" data-id=${training.appointment_id}>Cancel Training</button>
            </div>
          </div>
          `;
        });
        
        const cancelTrainingBtn = document.querySelectorAll('#cancelbtn');
        
        cancelTrainingBtn.forEach(btn => {
            btn.addEventListener('click', function cancel(event) {
                const appointmentID = event.target.dataset.id;
                console.log("Appointment ID:", appointmentID);
                axios.delete(`${baseURL4}/schedule/${appointmentID}`)
                .then(() => {
                  axios.get(`${baseURL4}/schedule/${userID}`)
                    .then(res => {
                      upcomingAppointmentsContainer.innerHTML = '';
                      console.log(res.data)
                      // rest of the code
                    })
                    .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
              });
            });
          };
      });
});

getUsers();