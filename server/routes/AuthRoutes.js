//importing express for using the express router for declaring routes on the application
const express = require("express");

//declaring the router as express router
const router = express.Router();

//importing the auth controller functions
const { SignUp, LogIn, LogOut, GoogleAuth } = require("../controllers/AuthControllers");

//the signup function will be post req as we send data from user's end to the server's end to signup
router.post("/signup", SignUp);

//the login function will be post req as we send data from user's end to the server's end to login
router.post("/login", LogIn);

//the logout function will be post req as we send data from user's end to the server's end to logout
router.post("/logout", LogOut);

//the google function will be post req as we send data from user's end to the server's end to use firebase auth
router.post("/google", GoogleAuth);

//exporting the created routes to use in indwx.js
module.exports = router;
