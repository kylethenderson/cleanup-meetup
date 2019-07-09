const express = require('express');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {  
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);

  const queryText = 'INSERT INTO "user" (username, password, first_name, last_name, email, phone, admin) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id';
  pool.query(queryText, [username, password, req.body.firstName, req.body.lastName, req.body.email, req.body.phone, false])
    .then(() => res.sendStatus(201))
    .catch(() => res.sendStatus(500));
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});


// update the user's data from the profile page
router.put('/', rejectUnauthenticated, (req, res) => {
  const queryText = `UPDATE "user" SET 
                      "username" = $1,
                      "first_name" = $2,
                      "last_name" = $3,
                      "email" = $4,
                      "phone" = $5
                      WHERE "id" = $6;`;
  const queryValues = [req.body.username, req.body.firstName, req.body.lastName, req.body.email, req.body.phone, req.user.id];
  pool.query(queryText, queryValues)
      .then( result => {
        res.sendStatus(200)
      })
      .catch( error => {
        res.sendStatus(500);
        console.log('Error in UPDATE query', error);
      })
})

module.exports = router;
