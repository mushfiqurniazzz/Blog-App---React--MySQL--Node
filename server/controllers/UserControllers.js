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
    const [RetrieveUserInfo] = await req.pool.query(
      `SELECT id, email, username FROM \`${process.env
        .DB_AUTHTABLE}\` WHERE id = ?`,
      [id]
    );

    //save the retrieved object in a variable
    const FoundUserInfo = RetrieveUserInfo[0];

    //retrieving the post informations
    const [RetrievePostInfo] = await req.pool.query(
      `SELECT COUNT(*) AS count FROM \`${process.env
        .DB_POSTTABLE}\` WHERE author_id = ?`,
      [id]
    );

    //save the retrieved object in a variable
    const FoundPostInfo = RetrievePostInfo[0];

    //send the object to the user with a success message
    return res
      .status(200)
      .json({
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
const GetUsers = async () => {};
const UpdateUser = async () => {};
const DeleteUser = async () => {};

module.exports = { SearchUser, GetUsers, UpdateUser, DeleteUser };
