/* eslint-disable no-useless-catch */
const express = require("express");
const db = require("../db");
const router = express.Router();
const errors = require("../errors")
const jwt = require("jsonwebtoken");
const { JWT_SECRET = "neverTell" } = process.env;

//const db = require("../db")
// POST /api/users/register




// POST /api/users/login




// GET /api/users/me

// GET /api/users/:username/routines


module.exports = router;
