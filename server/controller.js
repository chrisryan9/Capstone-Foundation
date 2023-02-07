require('dotenv').config();
const { CONNECTION_STRING } = process.env;
const knex = require('knex');
const moment = require('moment');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Sequelize = require('sequelize');

// const sequelize = new Sequelize(CONNECTION_STRING, {
//     dialect: 'postgres',
//     dialectOptions: {
//         ssl: {
//             rejectUnauthorized: false
//         }
//     }
// })



function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
}



const db = knex({
  client: 'pg',
  connection: `${CONNECTION_STRING}?sslmode=require`
});


module.exports = {
    signUp: (req, res) => {
        console.log(req.body);
        let { user_name: usersName, email, password, phone_number: phoneNumber } = req.body;

        if (!usersName || !email || !password || !phoneNumber) {
            return res.status(400).send({ message: 'All fields are required' });
        }

        const hashedPassword = hashPassword(password)

        console.log(hashedPassword);

        db('users')
        .insert({
            user_name: usersName,
            email: email,
            password: hashedPassword,
            phone_number: phoneNumber
        })
        .then(() => res.status(200).send({ message: 'Successfully signed up!' }))
        .catch(err => {
            console.log(err);
            res.status(500).send({ message: 'Failed to sign up' });
        });
    },

    trainings: (req, res) => {
        console.log(req.body)
        let { user_id, coach_id, date, time, notes} = req.body;
    
        if(!user_id || !coach_id || !date || !time) {
            return res.status(400).send({ message: 'All fields are required' });
        }
    
        let formattedTime = moment(time, 'h:mm A').format('HH:mm:ss');
    
        db('appointments')
        .insert({
            user_id: user_id,
            coach_id: coach_id,
            date: date,
            time: formattedTime,
            notes: notes
        })

        .then(() => {
            return db('users').select('email').where('user_id', user_id).first();
        })

        .then(user => {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'chrisryanassociates@gmail.com',
                  pass: 'ovexnmfbythqajhh'
                }
              });
        
              let mailOptions = {
                from: 'chrisryanassociates@gmail.com',
                to: user.email,
                subject: 'Training Scheduled!',
                text: `Your training has been scheduled on ${date} at ${time}. 
                Notes: ${notes}`
    };
        
              transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });

            res.status(200).send({ message: 'Training Scheduled!' })
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ message: 'Failed to schedule training' });
        });
    },
    

    getCoaches: (req, res) => {
        db.select('coach_id', 'coach_name')
          .from('coaches')
          .then(dbRes => res.status(200).json(dbRes))
          .catch(err => console.log(err))
      },

    getUsers: (req, res) => {
        db.select('user_id', 'user_name')
        .from('users')
        .then(dbRes => res.status(200).json(dbRes))
        .catch(err => console.log(err))
    },

    allTrainings: (req, res) => {
        const { user_id } = req.params;
    
        db.select('appointment_id', 'appointments.date', 'appointments.time','coaches.coach_name', 'appointments.notes')
            .from('appointments')
            .join('coaches', 'appointments.coach_id', '=', 'coaches.coach_id')
            .where({ user_id: user_id })
            .then(dbRes => res.status(200).json(dbRes))
            .catch(err => {
                console.log(err);
                res.status(500).send({ message: 'Failed to get appointments for user' });
            });
    },

    cancelTraining: (req, res) => {
        const {appointment_id } = req.params;

        db('appointments')
        .where({ appointment_id: appointment_id})
        .del()
        .then(() => res.status(200).send({ message: 'Training canceled.' }))
        .catch(err => {
            console.log(err);
            res.status(500).send({ message: 'Failed to cancel training' });
        });
    },

    login: (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({ message: 'Email and password are required' });
    }

    try {
        db('users')
        .select()
        .where({ email: email})
        .first()
        .then(user => {
            if (!user) {
            return res.status(400).send({ message: 'User not found.'});
            }


            // console.log(password);
            // console.log(user.password);

             const comparePass = bcrypt.compareSync(password, user.password)
            
            if (!comparePass) {
                return res.status(400).send({ message: 'Email or password is incorrect' });
            } else {
                res.status(200).send({ message: 'Successfully logged in', user_id: user.user_id });
            }
            

        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Failed to login' });
    }
    }
}