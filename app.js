require("dotenv").config()
const express = require("express")
const app = express();
const apiRouter = require("./api")

// Setup your Middleware and API Router here
app.use(express.json())
//app.use(express.urlencoded())
app.use("/api", apiRouter)

//error handler

app.use((req, res, next)=>{
  // next(createError(404));
  res.status(404);
  res.send({message: "404 Page Not Found"});
})

module.exports = app;
