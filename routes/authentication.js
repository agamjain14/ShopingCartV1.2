const User = require('../models/user'); // Import User Model Schema

const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {
  /* ==============
     Register Route
  ============== */
  router.post('/register', (req, res) => {
    // Check if email was provided
    if (!req.body.email) {
      res.json({ success: false, message: 'You must provide an e-mail' }); // Return error
    } else {
      // Check if username was provided
      if (!req.body.username) {
        res.json({ success: false, message: 'You must provide a username' }); // Return error
      } else {
        // Check if password was provided
        if (!req.body.password) {
          res.json({ success: false, message: 'You must provide a password' }); // Return error
        } else {
          // Create new user object and apply user input
          let user = new User({
            email: req.body.email.toLowerCase(),
            username: req.body.username.toLowerCase(),
            password: req.body.password
          });
          // Save user to database
          user.save((err) => {
            // Check if error occured
            if (err) {
              // Check if error is an error indicating duplicate account
              if (err.code === 11000) {
                res.json({ success: false, message: 'Username or e-mail already exists' }); // Return error
              } else {
                // Check if error is a validation rror
                if (err.errors) {
                  // Check if validation error is in the email field
                  if (err.errors.email) {
                    res.json({ success: false, message: err.errors.email.message }); // Return error
                  } else {
                    // Check if validation error is in the username field
                    if (err.errors.username) {
                      res.json({ success: false, message: err.errors.username.message }); // Return error
                    } else {
                      // Check if validation error is in the password field
                      if (err.errors.password) {
                        res.json({ success: false, message: err.errors.password.message }); // Return error
                      } else {
                        res.json({ success: false, message: err }); // Return any other error not already covered
                      }
                    }
                  }
                } else {
                  res.json({ success: false, message: 'Could not save user. Error: ', err }); // Return error if not related to validation
                }
              }
            } else {
              res.json({ success: true, message: 'Acount registered!' }); // Return success
            }
          });
        }
      }
    }
  });

  router.get('/checkEmail/:email', (req, res) => {
    if (!req.params.email) {
      res.json({ success: false, message: 'email not provided'});
    } else {
      User.findOne({ email: req.params.email}, (err, user) => {
        if (err) {
          res.json({ success: false, message: err});
        } else {
          if (user) {
            res.json({ success: false, message: 'email taken'});
          } else {
            res.json({ success: true, message: 'email available'});
          }
        }
      });
    }
  });

  router.get('/checkUsername/:username', (req, res) => {
    if (!req.params.username) {
      res.json({ success: false, message: 'username not provided'});
    } else {
      User.findOne({ username: req.params.username}, (err, user) => {
        if (err) {
          res.json({ success: false, message: err});
        } else {
          if (user) {
            res.json({ success: false, message: 'username taken'});
          } else {
            res.json({ success: true, message: 'username available'});
          }
        }
      });
    }
  });

  router.post('/login', (req, res) => {
    if (!req.body.username) {
      res.json({ success: false, message: 'No username was provided'});
    } else {
      if (!req.body.password) {
        res.json({ success: false, message: 'No password was provided'});
      } else {
        User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
          if (err) {
            res.json({ success: false, message: err});
          } else {
            if (!user) {
              res.json({ success: false, message: 'No user exist'});
            } else {
              const validPassword = user.comparePassword(req.body.password);
              if (!validPassword) {
                res.json({ success: false, message: 'password invalid'});
              } else {
                const token = jwt.sign({userId: user._id}, config.secret, {expiresIn: '24h'});
                res.json({ success: true, message: 'Success!', token: token, user: {username: user.username}});
              }
            }
          }
        });
      }
    }
  });

// MIDDLEWARE TO INTERCEPT HEADERS
// THIS MIDDLEWARE DECRYPTS THE TOKEN
  router.use((req, res, next) => {
    const token = req.headers['authorization']; // whenever a request coming from angular2 with headers attached it is going to search fot this header
    if (!token) {
      res.json({ success: false, message: 'No token provided'});
    } else {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          res.json({ success: false, message: 'invalid token' + err});
        } else {
          req.decoded = decoded;
          next();
        }
      });
    }
  })
// ANY ROUTES COMING AFTER THIS MIDDLEWARE WILL PASS THROUGH THE SAME

// BELOW METHOD TAKES THE DECRYPTED TOKEN FIND THE USER
  router.get('/profile', (req, res) => {
    User.findOne({ _id: req.decoded.userId }).select('username email isAdmin').exec((err, user) => {
      if (err) {
        res.json({ success: false, message: err});
      } else {
        if (!user) {
          res.json({ success: false, message: 'user not found'});
        } else {
          res.json({ success: true, user: user });
        }
      }
    });
  });

  return router; // Return router object to main index.js
}