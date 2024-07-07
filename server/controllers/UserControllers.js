//async await SearchUser function will take id from req params and check if a user exists with that id then will send the user object which would include information like email, username, total posts
const SearchUser = async (req, res) => {
  //retrive id from rew params
  const id = req.params.id;

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
const UpdateUser = async () => {};
const DeleteUser = async () => {};

module.exports = { SearchUser, GetUsers, UpdateUser, DeleteUser };
