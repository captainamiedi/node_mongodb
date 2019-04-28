const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.user_signup = (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length >= 1){
            return res.status(409).json({
                message: 'mail exists'
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => { 
                if (err){
                    return res.status(500).json({
                        error: err
                        
                    });
               } else {
                    const user = new User ({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'user created'
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            })
        }
    })
   

}

exports.login_all = (req, res, next) =>{
    User.find({email: req.body.email})
    .exec().
    then(user => {
        if(user.length < 1){
            return res.status(401).json({
                message: 'Auth failed'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err){
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            if (result){
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                },
                 process.env.JWT_KEY,
                 {
                     expiresIn: "1h"
                 }
                 );
                return res.status(200).json({
                    message: 'Auth successful',
                    token: token
                });
            }
            res.status(401).json({
                message: 'Auth failed'
            });
        });
    })
    .catch();
}

exports.delete_login_all = (req, res, next) => {
    User.remove({_id: req.params.id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'user deleted'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

router.post("/signup", async (req, res, next) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const result = await db.query(
        "INSERT INTO person (id, email, password) VALUES ($1,$2, $3) RETURNING *",
        [req.body.id, req.body.email, hashedPassword]
      );
      const user = result.rows;
      
      if (user >= 1){
        console.log(user)
        return res.status(409).json({
          message: "mail exist"
        });
      } else {
        return res.json(result.rows[0]);
        
      }
    } catch (e) {
      return next(e);
    }
  
            
    
  });

  router.post("/login", async (req, res, next) => {
  try {
    // try to find the user first
    const foundUser = await db.query(
      "SELECT * FROM person WHERE email=$1 LIMIT 1",
      [req.body.email]
    );
    if (foundUser.rows.length === 0) {
      return res.json({ message: "Invalid email" });
    }
    // if the user exists, let's compare their hashed password to a new hash from req.body.password
    const hashedPassword = await bcrypt.compare(
      req.body.password,
      foundUser.rows[0].password
    );
    // bcrypt.compare returns a boolean to us, if it is false the passwords did not match!
    if (hashedPassword === false) {
      return res.json({ message: "Invalid Password" });
    }

    // let's create a token using the sign() method
    const token = jwt.sign(
      // the first parameter is an object which will become the payload of the token
      { username: foundUser.rows[0].username },
      // the second parameter is the secret key we are using to "sign" or encrypt the token
      SECRET,
      // the third parameter is an object where we can specify certain properties of the token
      {
        expiresIn: 60 * 60 // expire in one hour
      }
    );
    // send back an object with the key of token and the value of the token variable defined above
    return res.json({ token });
  } catch (e) {
    return res.json(e);
  }
});

function ensureLoggedIn(req, res, next) {
  try {
    const authHeaderValue = req.headers.authorization;
    const token = jwt.verify(authHeaderValue, SECRET);
    return next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

router.get("/secret", ensureLoggedIn, async function(req, res, next) {
  try {
    return res.json({ message: "You made it!" });
  } catch (err) {
    return res.json(err);
  }
});

function ensureCorrectUser(req, res, next) {
  try {
    const authHeaderValue = req.headers.authorization;
    const token = jwt.verify(authHeaderValue, SECRET);
    if (token.username === req.params.username) {
      return next();
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

router.get("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    return res.json({ message: "You made it!" });
  } catch (err) {
    return res.json(err);
  }
});