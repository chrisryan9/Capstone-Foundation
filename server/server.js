require('dotenv').config();
const express = require('express');
const path = require('path')
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const {SERVER_PORT} = process.env;


const { signUp, trainings, getCoaches, getUsers, allTrainings, cancelTraining, login } = require('./controller')

app.use(express.static(`${__dirname}/../client`))

app.use(bodyParser.json());

app.use(express.json());
app.use(cors());

// SIGNUP PAGE
app.post('/signup', signUp)

// Login PAGE
app.post('/login', login)

// Schedule page
app.post('/schedule', trainings)
app.get('/getCoaches', getCoaches)
app.get('/getUsers', getUsers)
app.get('/schedule/:user_id', allTrainings)
app.delete('/schedule/:appointment_id', cancelTraining)

app.listen(SERVER_PORT, () => console.log(`running on ${SERVER_PORT}`))