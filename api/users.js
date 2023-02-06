/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();

//const db = require("../db")
// POST /api/users/register
router.post('/api/users/register', async (req, res, next)=>{
  try {
    console.log("hbgdak")
} catch(error){
  next(error);
}
})
// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
