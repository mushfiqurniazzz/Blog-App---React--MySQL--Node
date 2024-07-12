//importing jsonwebtoken and bcrypt library for the purpose of authenticating the user with cookie before performing specific tasks and hashing the typed password with the hashed password save din the database
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//async await SearchUser function will take id from req params and check if a user exists with that id then will send the user object which would include information like email, username, total posts
const SearchUser = async (req, res) => {
  //retrive id from req body
  const id = req.body.id;

  //if no id was provided
  if (!id || id === "") {
    return res.status(400).send("ID Was Not Found.");
  }

  //check if the user with the retrieved user id exists or not
  const [
    CheckUserExists
  ] = await req.pool.query(
    `SELECT COUNT(*) AS count FROM \`${process.env
      .DB_AUTHTABLE}\` WHERE id = ?`,
    [id]
  );

  //if block check for any user existing with provided id
  if (CheckUserExists[0].count === 0) {
    return res.status(404).send("No User Found With Provided Id.");
  }

  //if a user was found using the provided id
  try {
    //retrieve the user info
    const [
      RetrieveUserInfo
    ] = await req.pool.query(
      `SELECT id, email, username FROM \`${process.env
        .DB_AUTHTABLE}\` WHERE id = ?`,
      [id]
    );

    //save the retrieved object in a variable
    const FoundUserInfo = RetrieveUserInfo[0];

    //retrieving the post informations
    const [
      RetrievePostInfo
    ] = await req.pool.query(
      `SELECT COUNT(*) AS count FROM \`${process.env
        .DB_POSTTABLE}\` WHERE author_id = ?`,
      [id]
    );

    //save the retrieved object in a variable
    const FoundPostInfo = RetrievePostInfo[0];

    //send the object to the user with a success message
    return res.status(200).json({
      id: FoundUserInfo.id,
      email: FoundUserInfo.email,
      username: RetrieveUserInfo.username,
      totalposts: FoundPostInfo.count
    });
  } catch (error) {
    //error handler in case of an error
    console.error(error);
  }
};

//this async await GetUsers function will be the function which will be called on reload and will have the top 10 users with most posts made and first will check which user made the most posts then will procced to send the user details in json object
const GetUsers = async (req, res) => {
  //await query for check the top 10 most posted users and their username
  try {
    //this query will group author_id based on occurance and will count occurances for that author_id
    const [GetTopUsers] = await req.pool.query(
      `SELECT author_id, COUNT(*) AS occurrences FROM \`${process.env
        .DB_POSTTABLE}\` GROUP BY author_id ORDER BY occurrences DESC LIMIT 10;`
    );

    //save the query results in a variable by mapping
    const TopUsers = GetTopUsers.map(user => user.author_id);

    //retrieve the username of the ids of the users with most posts
    const [RetrieveUsername] = await req.pool.query(
      `SELECT id, username 
   FROM \`${process.env.DB_AUTHTABLE}\` 
   WHERE id IN (?)`,
      [TopUsers]
    );

    //save the username object in a variable after mapping the user id
    const UserUsername = RetrieveUsername.reduce((map, user) => {
      map[user.id] = user.username;
      return map;
    }, {});
    ``;

    //making a json obect of user maping to pass to the res.json function
    const result = GetTopUsers.map(user => ({
      id: user.author_id,
      username: UserUsername[user.author_id],
      totalposts: user.occurrences
    }));

    //return a success message with user objects with the most posts
    return res.status(200).json(result);
  } catch (error) {
    //error handler in case of error
    console.error(error);
  }
};

//this async await UpdateUser functioon will first check if the cookie matches with the user who wants to update the user profile if successfull will procced to update the provided credentials in the data base
const UpdateUser = async (req, res) => {
  //check if cookie is there
  const CheckCookieExists = req.cookies.token;

  //if the cookie is not there in the user
  if (!CheckCookieExists) {
    return res.status(400).send("No Cookie Found, Login First");
  }

  //check if the id for updating the user is provided in the req params
  const id = req.params.id;

  //in case the id was not provided in req params
  if (!id || id === "") {
    return res.status(400).send("ID Was not Found.");
  }

  //fields for updating the user which will be retrieved from the req body
  const { email, username, password } = req.body;

  if (
    !email ||
    email === "" ||
    !username ||
    username === "" ||
    !password ||
    password === ""
  ) {
    return res.status(400).send("ALL Fields Are Required.");
  }

  //try catch block for helpful error handling and maintainability
  try {
    //check if the id in the cookie matches with the id in req params
    const decoded = jwt.verify(CheckCookieExists, process.env.JWT_SECRET);
    const UserId = decoded.id;

    // if the id in the cookie does not matches with the id in req params
    if (UserId != id) {
      return res
        .status(400)
        .send("You Are Not The User You Are Trying To Update.");
    }

    //check if a user exists with the provided user using await query
    const [
      CheckUserExists
    ] = await req.pool.query(
      `SELECT COUNT(*) AS count FROM \`${process.env
        .DB_AUTHTABLE}\` WHERE id = ?`,
      [id]
    );

    //check if a user exists with the id
    if (CheckUserExists[0] === 0) {
      return res.status(400).send(`No User Found With Provided Id`);
    }

    //check if the typed password and the hashed password saved on the database is correct by using a bcrypt inbuilt function for comparing hashed password
    const [RetrieveUser] = await req.pool.query(
      `SELECT * FROM \`${process.env.DB_AUTHTABLE}\` WHERE id = ?`,
      [id]
    );

    //save the user object in a variable
    const FoundUser = RetrieveUser[0];

    //check using the bcrypt compare function
    const CompareHashedPassword = await bcrypt.compare(
      password,
      FoundUser.password
    );

    //if the comparasion of the hashed password was not successful
    if (!CompareHashedPassword) {
      return res.status(400).send("Wrong Password! Try Again.");
    }

    //after all checks we will now update the user with email, username and password
    const [UpdateUser] = await req.pool.query(
      `UPDATE \`${process.env
        .DB_AUTHTABLE}\` SET email = ?, username = ? where id = ?`,
      [email, username, id]
    );

    //send a success message that a user has been updated after successful operation, no need to select from or retrieve once again from the db as the typed or provided credentials would be the same as the stored onne
    return res.status(200).json({
      msg: "User Updated Successfuly",
      id: id,
      email: email,
      username: username
    });
  } catch (error) {
    //basic error handler incase of error
    console.error(error);
  }
};

//this async await ChangePassword functioon will first check if the cookie matches with the user who wants to change the password if successfull will procced to update the password with provided credentials in the data base
const ChangePassword = async (req, res) => {
  //check if cookie is there
  const CheckCookieExists = req.cookies.token;

  //if the cookie is not there in the user
  if (!CheckCookieExists) {
    return res.status(400).send("No Cookie Found, Login First");
  }

  //check if the id for updating the user is provided in the req params
  const id = req.params.id;

  //in case the id was not provided in req params
  if (!id || id === "") {
    return res.status(400).send("ID Was not Found.");
  }

  //fields for updating the user which will be retrieved from the req body
  const { old_password, new_password, confirm_new_password } = req.body;

  //check if the fields are provided and is not null
  if (
    !old_password ||
    old_password === "" ||
    !new_password ||
    new_password === "" ||
    !confirm_new_password ||
    confirm_new_password === ""
  ) {
    //return error response in case of error
    return res.status(400).send("ALL Fields Are Required.");
  }

  //check if the new password and confirm new passwords matchs
  if (new_password != confirm_new_password) {
    return res
      .status(400)
      .send("Confirm Password And Confirm New Password Doesn't Match.");
  }

  //try catch block for helpful error handling and maintainability
  try {
    //check if the id in the cookie matches with the id in req params
    const decoded = jwt.verify(CheckCookieExists, process.env.JWT_SECRET);
    const UserId = decoded.id;

    // if the id in the cookie does not match with the id in req params
    if (UserId != id) {
      return res
        .status(400)
        .send("You Are Not The User You Are Trying To Update.");
    }

    //check if a user exists with the provided user using await query
    const [
      CheckUserExists
    ] = await req.pool.query(
      `SELECT COUNT(*) AS count FROM \`${process.env
        .DB_AUTHTABLE}\` WHERE id = ?`,
      [id]
    );

    //check if a user exists with the id
    if (CheckUserExists[0] === 0) {
      return res.status(400).send(`No User Found With Provided Id`);
    }

    //check if the typed password and the hashed password saved on the database is correct by using a bcrypt inbuilt function for comparing hashed password
    const [RetrieveUser] = await req.pool.query(
      `SELECT * FROM \`${process.env.DB_AUTHTABLE}\` WHERE id = ?`,
      [id]
    );

    //save the user object in a variable
    const FoundUser = RetrieveUser[0];

    //check using the bcrypt compare function
    const CompareHashedPassword = await bcrypt.compare(
      old_password,
      FoundUser.password
    );

    //if the comparasion of the hashed password was not successful
    if (!CompareHashedPassword) {
      return res.status(400).send("Wrong Password! Try Again.");
    }

    //after all checks we will now update the user with password but first we need to hash the password before saving it, for hashing the typed password before saving it using bcryptjs which is used for hashing using salt
    const salt = await bcrypt.genSalt(10); //10 rounds of salt

    //hashing the password
    const HashedPassword = await bcrypt.hash(new_password, salt);

    const [UpdateUser] = await req.pool.query(
      `UPDATE \`${process.env.DB_AUTHTABLE}\` SET password = ? where id = ?`,
      [HashedPassword, id]
    );

    //send a success message that a user has been updated after successful operation, no need to select from or retrieve once again from the db as the typed or provided credentials would be the same as the stored onne
    return res.status(200).json({
      msg: "User Password Updated Successfuly",
      id: id,
      email: FoundUser.email,
      username: FoundUser.username
    });
  } catch (error) {
    //basic error handler incase of error
    console.error(error);
  }
};

//DeleteUser asyn await function will first check if the id in cookie matches with the req params id then will remove the cookie and delete the user from database
const DeleteUser = async (req, res) => {
  //check if the cookie called token exists
  const CheckCookieExists = req.cookies.token;

  //if not id found end the function with a error message
  if (!CheckCookieExists) {
    return res.status(400).send("No Cookie Found, Login First.");
  }

  //check if the user provided the id of the user to  be deleted
  const id = req.params.id;

  //if the user didn't provide any id, end function with a error message
  if (!id || id === "") {
    return res.status(400).send("ID Was Not Provided In Req Params.");
  }

  //after checks now we continue with the deletion of the user with the posts posted by the user in the post table
  try {
    //check if the id in cookie matches with the id in the provided req params
    const decoded = jwt.verify(CheckCookieExists, process.env.JWT_SECRET);
    const UserId = decoded.id;

    //if the ids of the cookie and req params doesnt match
    if (UserId != id) {
      return res
        .status(400)
        .send("You Are Not Authorized To Delete This User.");
    }

    //after completing all the checks up untill here now we use a await query to delete all items in auth table then post table

    //delete the row where the id is the retrieved userid
    const [DeleteAuthUser] = await req.pool.query(
      `DELETE FROM \`${process.env.DB_AUTHTABLE}\` WHERE id = ?`,
      [UserId]
    );

    //delete all the row where the author id is the retrieved userid
    const [DeletePostUser] = await req.pool.query(
      `DELETE FROM \`${process.env.DB_POSTTABLE}\` WHERE author_id = ?`,
      [UserId]
    );

    //console logging that a user has been deleted
    console.log(`User = ${UserId} Was Deleted.`);

    //return a success message that the user been deleted and distroy the cookie from the user
    return res
      .clearCookie("token", {
        sameSite: "none",
        secure: true
      })
      .status(200)
      .json({
        msg: "User Has Been Deleted",
        id: UserId
      });
  } catch (error) {
    //basic error  handler in case of error
    console.error(error);
  }
};

module.exports = {
  SearchUser,
  GetUsers,
  UpdateUser,
  ChangePassword,
  DeleteUser
};
