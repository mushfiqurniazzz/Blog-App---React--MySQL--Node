//importing libraries, routes and functions for running the app
//importing express
const express = require("express");
const app = express();

//importing routes from the routes folder
const AuthRoutes = require("./routes/AuthRoutes");
const PostRoutes = require("./routes/PostRoutes");
// const UserRoutes = require("./routes/UsersRoutes");

//databse connection function
const ConnDb = require("./db/ConnDB");

//environmental variables
require("dotenv").config();

//port
const port = process.env.PORT || 3000;

//for cross origin resource sharing
const cors = require("cors");
app.use(cors());
console.log("Cross Origin Resource Sharing is enabled.");

//body parsing middlewares
const bodyParser = require("body-parser");
app.use(express.json());
app.use(bodyParser.json());

//async await IFFE function from here
(async () => {
  //declaring the pool with the database connection function being called
  const pool = await ConnDb();

  //passing the pool to the routes
  app.use((req, res, next) => {
    req.pool = pool;
    next();
  });

  //declaring routes in this IFFE function
  app.use("/auth", AuthRoutes);
  app.use("/post", PostRoutes);
  // app.use("/users", UserRoutes);

  //listening the app at environemental variable specfified port
  app.listen(port, () => {
    console.log(`App Running Successfully On http://localhost:${port}`);
  });
})();
