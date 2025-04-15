const express = require("express")
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const app = express()
const PORT = 5000
const connectDB = require("./config/db");
const { userAuth } = require("./middleware/auth.js");

//Connecting the Database
connectDB();
app.use(express.json())
app.use(bodyParser.json());
app.use(cookieParser());
app.get("/basic", userAuth, (req, res) => res.send("User Route"));
const server = app.listen(PORT, () =>
    console.log(`Server Connected to port ${PORT}`)
  )
  // Handling Error
  process.on("unhandledRejection", err => {
    console.log(`An error occurred: ${err.message}`)
    server.close(() => process.exit(1))
  })
 
  