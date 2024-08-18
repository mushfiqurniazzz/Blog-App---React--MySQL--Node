//importing jsonwebtoken and bcrypt library for the purpose of authenticating the user with cookie before performing specific tasks and hashing the typed password with the hashed password save din the database
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//async await SearchUser function will take id from req params and check if a user exists with that id then will send the user object which would include information like email, username, total posts
const SearchUser = async (req, res) => {
  //retrive id from req body
  const id = req.body.id;

  //if no id was provided
  if (!id || id === "") {
    return res.status(422).send("ID Was Not Found.");
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
    return res.status(401).send("No Cookie Found, Login First");
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
    return res.status(422).send("ALL Fields Are Required.");
  }

  //try catch block for helpful error handling and maintainability
  try {
    //check if the id in the cookie matches with the id in req params
    const decoded = jwt.verify(CheckCookieExists, process.env.JWT_SECRET);
    const UserId = decoded.id;

    //check if a user exists with the provided user using await query
    const [
      CheckUserExists
    ] = await req.pool.query(
      `SELECT COUNT(*) AS count FROM \`${process.env
        .DB_AUTHTABLE}\` WHERE id = ?`,
      [UserId]
    );

    //check if a user exists with the id
    if (CheckUserExists[0] === 0) {
      return res.status(404).send(`No User Found With Provided Id`);
    }

    //check if the typed password and the hashed password saved on the database is correct by using a bcrypt inbuilt function for comparing hashed password
    const [RetrieveUser] = await req.pool.query(
      `SELECT * FROM \`${process.env.DB_AUTHTABLE}\` WHERE id = ?`,
      [UserId]
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
      return res.status(403).send("Wrong Password! Try Again.");
    }

    //after all checks we will now update the user with email, username and password
    await req.pool.query(
      `UPDATE \`${process.env
        .DB_AUTHTABLE}\` SET email = ?, username = ? where id = ?`,
      [email, username, UserId]
    );

    //send a success message that a user has been updated after successful operation, no need to select from or retrieve once again from the db as the typed or provided credentials would be the same as the stored onne
    return res.status(200).json({
      msg: "User Updated Successfuly",
      id: UserId,
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
    return res.status(401).send("No Cookie Found, Login First");
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
    return res.status(404).send("All Fields Are Required.");
  }

  //check if the new password and confirm new passwords matchs
  if (new_password != confirm_new_password) {
    return res
      .status(422)
      .send("Confirm Password And Confirm New Password Doesn't Match.");
  }

  //try catch block for helpful error handling and maintainability
  try {
    //check if the id in the cookie matches with the id in req params
    const decoded = jwt.verify(CheckCookieExists, process.env.JWT_SECRET);
    const UserId = decoded.id;

    //check if a user exists with the provided user using await query
    const [
      CheckUserExists
    ] = await req.pool.query(
      `SELECT COUNT(*) AS count FROM \`${process.env
        .DB_AUTHTABLE}\` WHERE id = ?`,
      [UserId]
    );

    //check if a user exists with the id
    if (CheckUserExists[0] === 0) {
      return res.status(403).send(`No User Found With Provided Id`);
    }

    //check if the typed password and the hashed password saved on the database is correct by using a bcrypt inbuilt function for comparing hashed password
    const [RetrieveUser] = await req.pool.query(
      `SELECT * FROM \`${process.env.DB_AUTHTABLE}\` WHERE id = ?`,
      [UserId]
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
      return res.status(402).send("Wrong Password! Try Again.");
    }

    //after all checks we will now update the user with password but first we need to hash the password before saving it, for hashing the typed password before saving it using bcryptjs which is used for hashing using salt
    const salt = await bcrypt.genSalt(10); //10 rounds of salt

    //hashing the password
    const HashedPassword = await bcrypt.hash(new_password, salt);

   await req.pool.query(
      `UPDATE \`${process.env.DB_AUTHTABLE}\` SET password = ? where id = ?`,
      [HashedPassword, UserId]
    );

    //send a success message that a user has been updated after successful operation, no need to select from or retrieve once again from the db as the typed or provided credentials would be the same as the stored onne
    return res
      .clearCookie("token", { sameSite: "none", secure: true })
      .status(200)
      .json({
        msg: "User Password Updated Successfuly",
        id: UserId,
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
    return res.status(401).send("No Cookie Found, Login First.");
  }

  //after checks now we continue with the deletion of the user with the posts posted by the user in the post table
  try {
    //check if the id in cookie matches with the id in the provided req params
    const decoded = jwt.verify(CheckCookieExists, process.env.JWT_SECRET);
    const UserId = decoded.id;

    //after completing all the checks up untill here now we use a await query to delete all items in auth table then post table

    //delete all the row where the author id is the retrieved userid
   await req.pool.query(
      `DELETE FROM \`${process.env.DB_POSTTABLE}\` WHERE author_id = ?`,
      [UserId]
    );

    //delete the row where the id is the retrieved userid
    await req.pool.query(
      `DELETE FROM \`${process.env.DB_AUTHTABLE}\` WHERE id = ?`,
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

//UserProfile async await function which will first look for the cookie stored in the user and then retrieve the id and then will reteve all credentials like email username from the cookie and send back to the user with total posts count as well
const UserProfile = async (req, res) => {
  //get hold of the cookie called token using a variable
  const CheckCookieExists = req.cookies.token;

  //return error if the cookie doesnt exist
  if (!CheckCookieExists) {
    return res.status(401).send("No Cookie Found, Login First.");
  }

  //decode the cookie using jsonwebtoken and use the id to retrieve credentials from the database
  const decoded = await jwt.verify(CheckCookieExists, process.env.JWT_SECRET);
  const UserId = decoded.id;

  //retrieve the credentials from database using the userid variable which holds the specefic user id
  const [
    RetrieveFromAuth
  ] = await req.pool.query(
    `SELECT email, username, created_at FROM \`${process.env
      .DB_AUTHTABLE}\` WHERE id =?`,
    [UserId]
  );

  //declare the first row of retrieved information in a vaiable for easy retreval
  const UserAuthInfo = RetrieveFromAuth[0];

  //retrieve the total amount of posts made by the user in the database
  const [
    RetrieveFromPost
  ] = await req.pool.query(
    `SELECT COUNT(*) AS count FROM \`${process.env
      .DB_POSTTABLE}\` WHERE author_id = ?`,
    [UserId]
  );

  //retrieve all the posts from the database where author is the id extracted from the cookie and send to the user
  const [
    RetrievePostsFromPost
  ] = await req.pool.query(
    `SELECT * FROM \`${process.env.DB_POSTTABLE}\` WHERE author_id = ?`,
    [UserId]
  );

  //return the data in a json objectw ith a success code
  res
    .status(200)
    .json({
      id: UserId,
      email: UserAuthInfo.email,
      username: UserAuthInfo.username,
      created_at: UserAuthInfo.created_at,
      totalposts: RetrieveFromPost[0].count,
      userPosts: RetrievePostsFromPost
    });
};

module.exports = {
  SearchUser,
  GetUsers,
  UpdateUser,
  ChangePassword,
  DeleteUser,
  UserProfile
};
