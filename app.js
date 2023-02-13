require("dotenv").config()
const express = require("express")
const app = express()
const apiRouter = require("./api")

// Setup your Middleware and API Router here
app.use(express.json())
//app.use(express.urlencoded())
//app.use(cookieParser())
app.use('/api', apiRouter);

app.use((req, res, next)=>{
  // next(createError(404));
  res.status(404);
  res.send({message: "404 Page Not Found"});
})

//error handler

app.use((err, req, res, next)=>{
  console.log("error handler")
  console.log(err.message)
  res.send({
    message: err.message,
    error: err.message,
    name: err.message
  })
})

module.exports = app;