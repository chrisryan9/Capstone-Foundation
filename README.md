# Capstone-Foundation

Rock Volleyball Club Website
This is a website created for the Rock Volleyball Club, as a capstone project for Devmountain Foundations.

Technologies Used
The front-end of the website was built with HTML, CSS, and JavaScript. It communicates with the server through API requests using Axios. The back-end was built with Express, CORS, and Knex, which connects to a database on Bit.io.

Features
Secure authentication: When someone creates an account, their password is encrypted using bcrypt and then stored in the database. When someone logs in, their password is checked using bcrypt and compared with the encrypted password stored in the database.
Schedule training sessions: Once the user is logged in, they can schedule training sessions. The schedule page uses nodemailer to send an email confirmation of the appointment to the user, and the user can also view their scheduled sessions through the app, managed with the help of moment.
Other pages: The website also includes pages for Instagram, tournaments, coaches, and about us.
Challenges
One of the biggest challenges was using bcrypt for password security. It has built-in salt and hash methods to generate an encrypted representation of the password, making it difficult for attackers to gain access to the original password even if they have access to the database. Working with moment to compare dates and manipulate time was also challenging, but it taught me a lot about the different functions and how to use them.

Future Improvements
This project was a great learning experience, but there is always room for improvement. Some potential future improvements could include:

More advanced scheduling features, such as recurring appointments or cancellations.
Integration with other services, such as Google Maps for directions to tournament locations.
Improved styling and layout for a more professional look.
Conclusion
Overall, I'm proud of what I built and I hope to continue growing my skills in the future. Thank you for checking out my Devmountain Capstone project. Feel free to explore the website and provide any feedback or suggestions.
