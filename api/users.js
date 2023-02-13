/* eslint-disable no-useless-catch */
const express = require("express");
const db = require("../db");
const router = express.Router();
const errors = require("../errors")
const jwt = require("jsonwebtoken");
const { JWT_SECRET = "neverTell" } = process.env;

//const db = require("../db")
// POST /api/users/register

router.post('/register', async (req, res, next) => {
  try {
    // console.log(db.proba)
    if(req.body && req.body.username && req.body.password){
     
      const user = await db.createUser(req.body);
      
      const token = await jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1w" }
      );
      const obj = {
        user: user,
        token: token,
        message: "You have succesfully registred",
      };
      res.send(obj)
    } else {
      throw new Error(errors.UserTakenError());
    }
  } catch (error) {
    next(error);
  }
});



// POST /api/users/login

router.post('/login', async (req, res, next)=>{
  try {
    const user = await db.getUser(req.body);
    // console.log(login, "login")
    //res.send(login)
    const token = await jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1w" }
    );
  
    const obj = {
      token: token,
      message: "you're logged in!",
      user: user
    };
    res.send(obj)
} catch(error){
  next(error);
}
});


// GET /api/users/me

// GET /api/users/:username/routines


module.exports = router;
