//importing neccessary  libraries and functions like bcryptjs and jwt function created in the utils folder for hashing the password of90 a new user, comparing the passwords typed in for loging in and also for sending a token and then saving it in the browser localstorage using the jwt function
const bcrypt = require("bcryptjs"); //for hashing
const jwt = require("jsonwebtoken");
const token = require("../utils/jwt");

//async await sygn up function which will check first if any fields are null or the password matches with the cofirm password then will continue to hash the typed password by the user and finally save everything, as a success message will console log the id of the created user and send the id, email, username and created time as a json response
const SignUp = async (req, res) => {
  //all the neccessary fields will be retrived from the req body
  const { email, username, password, confirm_password } = req.body;

  //validation for checking if any field is empty or is just a empty string
  if (
    !email ||
    email === "" ||
    !username ||
    username === "" ||
    !password ||
    password === "" ||
    !confirm_password ||
    confirm_password == ""
  ) {
    //return from the fucntion and send the error message
    return res.status(404).send("All Fields Are Required.");
  }

  //check if both the passwords are the same, password and confirm password
  if (password != confirm_password) {
    return res.status(401).send("Password And Confirm Password Do Not Match.");
  }

  //if all fields are filled

  //try catch blocks for using await keyword
  try {
    //check if a user with same credentials, email or username already exists in the database
    //checking if a user with same email exists
    const [
      CheckUniqueEmail
    ] = await req.pool.query(
      `SELECT COUNT(*) AS count FROM \`${process.env
        .DB_AUTHTABLE}\` WHERE email = ?`,
      [email]
    );

    //the database stores data in rows so after the filter is applied if there exists a row the below validation check would be true and return the message of same email already in use
    if (CheckUniqueEmail[0].count > 0) {
      //return from the fucntion and send the error message
      return res
        .status(408)
        .send("User With Same Email Already Exists, Try Another Email.");
    }

    //check if user with the same username already exists in the database
    const [
      CheckUniqueUsername
    ] = await req.pool.query(
      `SELECT COUNT(*) AS count FROM \`${process.env
        .DB_AUTHTABLE}\` WHERE USERNAME = ?`,
      [username]
    );

    //the database stores data in rows so after the filter is applied if there exists a row the below validation check would be true and return the message of username already in use
    if (CheckUniqueUsername[0].count > 0) {
      return res
        .status(409)
        .send("User With Same Username Already Exists, Try Another Username");
    }

    //for hashing the typed password before saving it using bcryptjs which is used for hashing using salt
    const salt = await bcrypt.genSalt(10); //10 rounds of salt

    //hashing the password
    const HashedPassword = await bcrypt.hash(password, salt);

    //now inserting the email, username, created hashed password into the auth table
    const [InserUser] = await req.pool.query(
      `INSERT INTO \`${process.env
        .DB_AUTHTABLE}\` (email, username, password) VALUES (?, ?, ?)`,
      [email, username, HashedPassword]
    );

    //after successfull user insertion, retrive the user details for sending the user details to the user by passing the id from the insertion
    const [
      RetriveInsertedUser
    ] = await req.pool.query(
      `SELECT id, email, username, created_at FROM \`${process.env
        .DB_AUTHTABLE}\` WHERE id = ?`,
      [InserUser.insertId]
    );

    //declaring the retrieved user object in a variable
    const InsertedUser = RetriveInsertedUser[0];

    //console logging in the server that a new user has been created
    console.log(`New User Has Been Created, ID = ${InsertedUser.id}`);

    //sending the created user details to the server
    return res.status(201).json({
      id: InsertedUser.id,
      username: InsertedUser.username,
      email: InsertedUser.email,
      created_at: InsertedUser.created_at
    });
  } catch (error) {
    //incase of error with basic error handling
    console.error(error);
  }
};

//async await function which will first check if the neccessary input fields are given then will check in database if user with same username exists then compares the typed password with the hashed password saved in database if everything is successful it will send a cookie marking as a loged user
const LogIn = async (req, res) => {
  //all the credentials will be retrived from the req body sent by user
  const { username, password } = req.body;

  //check if any field is null or is not provided
  if (!username || username === "" || !password || password === "") {
    return res.status(404).send("All Fields Are Required.");
  }
  try {
    //checking if a user with a same username exists in databse
    const [
      CheckExistingUser
    ] = await req.pool.query(
      `SELECT COUNT(*) AS count FROM \`${process.env
        .DB_AUTHTABLE}\` WHERE username = ?`,
      [username]
    );

    //the database stores data in rows so after the filter is applied if there exists a row the below validation check would be true and we will continue with logging in the user if false return response, no user with this username exists
    if (CheckExistingUser[0].count === 0) {
      return res
        .status(404)
        .send(`No User Found With ${username} As Username.`);
    }

    //retriving the user after knowing a user exists with the provided username
    const [RetriveUser] = await req.pool.query(
      `SELECT * FROM \`${process.env.DB_AUTHTABLE}\` WHERE username = ?`,
      [username]
    );

    //save the found user in a variable for retriving the user details for password to compare, creating the token
    const FoundUser = RetriveUser[0];

    //after the user is found with the given username now we check if the provided password matches with the password saved in database for this we use the compare function from bcrptjs which will compare the hashed password with the provided password
    const CompareHashPassword = await bcrypt.compare(
      password,
      FoundUser.password
    );

    //the compare function will return false incase of error so we can write the if block like this
    if (!CompareHashPassword) {
      return res.status(401).send("Wrong Password! Try Again.");
    }

    //console logging in the server that a new user has been logged in
    console.log(`A User Has Logged In, ID = ${FoundUser.id}`);

    //if we reach upto here we will now send the cookie to the user with their information, the cookie is located at utils directory
    token(FoundUser, res);
  } catch (error) {
    //bassic error handling
    console.error(error);
  }
};

//checks if the user have a token set then deletes the cookie called token from the user and sends a success code and message
const LogOut = (req, res) => {
  //retrive cookie called token from req.cookie
  const CheckCookieExists = req.cookies.token;

  //check if the retrival was successful
  if (!CheckCookieExists) {
    return res.status(401).send("No Cookie Found, Login First.");
  }
  try {
    const decoded = jwt.verify(CheckCookieExists, process.env.JWT_SECRET);
    const userId = decoded.id;

    //console logging in the server that a user has logged out
    console.log(`A User Has Logged Out, ID = ${userId}`);

    //delete the cookie from the user as a res with a sucess code and message
    res
      .clearCookie("token", {
        sameSite: "none",
        secure: true
      })
      .status(200)
      .send("User has been logged out.");
  } catch (error) {
    console.error(error);
  }
};

//async await function for using the firebase email authentication which will, during signup will save the email recieved from the frontend firebase pop up and generate a random password and before saving it with email and password and for username would pick up all the characters untill @, during login will send a cookie to that user if the email got matches the one saved in database
const GoogleAuth = async (req, res) => {
  //used email in firebase will be sent from frontend
  const { email } = req.body;

  //if any field is null or is empty return a error message
  if (!email || email === "") {
    return res.status(400).send("Error Using Firebase, Try Again.");
  }

  //using try catch blocks for using await
  try {
    //if the user with same email is in the database send a cookie as the user has already loged in else create the user and then save the user

    //check if a user exists with the same email
    const [
      CheckUserExists
    ] = await req.pool.query(
      `SELECT COUNT(*) AS count FROM \`${process.env
        .DB_AUTHTABLE}\`  WHERE email = ?`,
      [email]
    );

    //if exists send a token to that user
    if (CheckUserExists[0].count > 0) {
      const [RetriveUser] = await req.pool.query(
        `SELECT * FROM \`${process.env.DB_AUTHTABLE}\` WHERE email = ?`,
        [email]
      );
      //cannot directly pass a row to the token so saving it in a variable before passing it
      const FoundUser = RetriveUser[0];

      //console logging in the server that a user has logged in using firebase
      console.log(`A User Has Logged In Using Firebase, ID = ${FoundUser.id}`);

      //passing the user
      token(FoundUser, res);
    } else {
      //else case, if the user didnt exist

      //creating the username field
      const username = email.substring(0, email.indexOf("@"));

      //creating the password, as we dont get any passwords provided from firebase
      const password =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      //for hashing the typed password before saving it using bcryptjs which is used for hashing using salt
      const salt = await bcrypt.genSalt(10); //10 rounds of salt

      //hashing the password
      const HashedPassword = await bcrypt.hash(password, salt);

      //saving the user with email, username and hashed password
      const [InsertUser] = await req.pool.query(
        `INSERT INTO \`${process.env
          .DB_AUTHTABLE}\` (email, username, password) VALUES (?, ?, ?)`,
        [email, username, HashedPassword]
      );

      //retriving the user for sending a success message
      const [
        RetriveInsertedUser
      ] = await req.pool.query(
        `SELECT id, email, username, created_at FROM \`${process.env
          .DB_AUTHTABLE}\` WHERE id = ?`,
        [InsertUser.insertId]
      );

      //declaring the retrived user object as a variable
      const InsertedUser = RetriveInsertedUser[0];

      //console logging in the server that a user has been created using firebase
      console.log(
        `A User Has Been Created Using Firebase, ID = ${InsertedUser.id}`
      );

      //sending the created user details to the server
      return res.status(201).json({
        id: InsertedUser.id,
        username: InsertedUser.username,
        email: InsertedUser.email,
        created_at: InsertedUser.created_at
      });
    }
  } catch (error) {
    //basic error handling during error
    console.error(error);
  }
};

//exporting the auth functions
module.exports = { SignUp, LogIn, LogOut, GoogleAuth };
