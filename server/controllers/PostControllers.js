//importing neccessary libraries and functions for completing the posts controllers like jsonwebtoken for auth and upload to cloudinary
//for auth, jsonwebtoken
const jwt = require("jsonwebtoken");

//function for uploading to cloudinary
const cloudinary = require("../utils/cloudinary");

//async await add post function which will first check if a cookie called token exists then extract the user id from the cookie, will check if all the credentials are given and then after converting the image given to cloudinary will save the whole thing in the database
const AddPost = async (req, res) => {
  //check if the user is athenticated and retrive the id from the cookie called token which would be set in the user's localstorage after successful login
  const CheckCookieExists = req.cookies.token;

  //if the check was successful
  if (!CheckCookieExists) {
    return res.status(400).send("No Cookie Found, Login First.");
  }

  //post tittle, post body and the image would be retrieved from the req.body
  const { post_title, post_body } = req.body;

  //check if we got everything required to make a blog, incase we didn't send a 400 status saying all fields are required
  if (!post_title || post_title === "" || !post_body || post_body === "") {
    return res.status(400).send("All Fields Are Required.");
  }

  //try catch block for helpful error handling and maintainability
  try {
    //decoding and stroing the user id from cookie called token
    const decoded = jwt.verify(CheckCookieExists, process.env.JWT_SECRET);
    const UserId = decoded.id;

    //if a file is sent as a req
    if (req.file) {
      //call the uploader function and pass the path of the file
      const result = await cloudinary.uploader.upload(req.file.path);

      //after it's completed save the secure url in a variable
      const ImageUrl = result.secure_url;

      //save the retrived userid from cookie, cloudinary secure url post title and post body into the database
      const [AddPost] = await req.pool.query(
        `INSERT INTO \`${process.env
          .DB_POSTTABLE}\` (author_id, post_title, post_body, post_image) VALUES (?, ?, ?, ?)`,
        [UserId, post_title, post_body, ImageUrl]
      );

      //retrive the inserted post for sending a success message to the user
      const [
        RetriveInsertedPost
      ] = await req.pool.query(
        `SELECT post_id, author_id, post_title, post_image FROM \`${process.env
          .DB_POSTTABLE}\` WHERE post_id = ?`,
        [AddPost.insertId]
      );
      //declaring the retrived post object in a variable
      const InsertedPost = RetriveInsertedPost[0];

      //console logging the server that a new post has been posted
      console.log(
        `A New Post, ID = ${InsertedPost.post_id} Has Been Posted By User = ${InsertedPost.author_id}.`
      );

      //sending a success message to the user that the post has been created
      res.status(201).json({
        post_id: InsertedPost.post_id,
        author_id: InsertedPost.author_id,
        post_title: InsertedPost.post_title,
        post_image: InsertedPost.post_image
      });
    } else {
      //else case where the user doesnt have any image for the blog
      //save the retrived userid from cookie, cloudinary secure url post title and post body into the database
      const [AddPost] = await req.pool.query(
        `INSERT INTO \`${process.env
          .DB_POSTTABLE}\` (author_id, post_title, post_body) VALUES (?, ?, ?)`,
        [UserId, post_title, post_body]
      );

      //retrive the inserted post for sending a success message to the user
      const [
        RetriveInsertedPost
      ] = await req.pool.query(
        `SELECT post_id, author_id, post_title, post_image FROM \`${process.env
          .DB_POSTTABLE}\` WHERE post_id = ?`,
        [AddPost.insertId]
      );
      //declaring the retrived post object in a variable
      const InsertedPost = RetriveInsertedPost[0];

      //console logging the server that a new post has been posted
      console.log(
        `A New Post, ID = ${InsertedPost.post_id} Has Been Posted By User = ${InsertedPost.author_id}.`
      );

      //sending a success message to the user that the post has been created
      res.status(201).json({
        post_id: InsertedPost.post_id,
        author_id: InsertedPost.author_id,
        post_title: InsertedPost.post_title,
        post_image: InsertedPost.post_image
      });
    }
  } catch (error) {
    //basic error handling in case of error
    console.error(error);
  }
};

//this async await function will be a get request function which will be called on reload of the frontend and set posts for the user
const GetPosts = async (req, res) => {
  //first select all the posts from the database and then send it to the user as a json object
  const [SelectAllPosts] = await req.pool.query(
    `SELECT * FROM \`${process.env.DB_POSTTABLE}\``
  );

  //return the json object back to the user
  return res.status(200).json(SelectAllPosts);
};

//async await function which will first check if a token exists in the user end then checks if a post exists with the provided id from req.params.id ifexists sends the row with a success message
const GetPost = async (req, res) => {
  //check if cookie exists
  const CheckCookieExists = req.cookies.token;

  //if no cookie exists
  if (!CheckCookieExists) {
    return res.status(400).send("No Cookie Found, Login First");
  }

  //retrive id from req params
  const id = req.params.id;

  //check if id was recieved
  if (!id || id === "") {
    return res.status(400).send("ID Was Not Found");
  }

  try {
    //await query for checking is post exists with provided id
    const [
      CheckPostExists
    ] = await req.pool.query(
      `SELECT COUNT(*) AS count FROM \`${process.env
        .DB_POSTTABLE}\` WHERE post_id = ?`,
      [id]
    );

    //if theres no post
    if (CheckPostExists[0].count === 0) {
      return res.status(404).send(`No Post Found With ID = ${id}`);
    }

    //retrive post from database
    const [RetrivePost] = await req.pool.query(
      `SELECT * FROM \`${process.env.DB_POSTTABLE}\` WHERE post_id = ?`,
      [id]
    );

    //save the retrieved post object in a variable for accessing the object's value easily
    const FoundPost = RetrivePost[0];

    //send the object to the user
    res.status(200).json(FoundPost);
  } catch (error) {
    //basic error handling in case of error
    console.error(error);
  }
};

//async await post delete function which will first check if the user is logged in and then retrive the user id from the cookie then will check if the retrieved id is the auther of the post the user wants to delete if successful will send the success message
const DeletePost = async (req, res) => {
  //retrieve the cookie called token from the req
  const CheckCookieExists = req.cookies.token;

  //check if the user has the token
  if (!CheckCookieExists) {
    return res.status(400).send("No Cookie Found, Login First");
  }

  //the post id which will be retrieved from the url
  const id = req.params.id;

  //check if the user send a id
  if (!id || id === "") {
    return res.status(400).send("ID Was Not Found");
  }

  //try catch block for helpful error handling and maintainability
  try {
    //decoding and storing the user id from cookie called token
    const decoded = jwt.verify(CheckCookieExists, process.env.JWT_SECRET);
    const UserId = decoded.id;

    //delete the post after the author id and id from cookie matches
    const [DeletePost] = await req.pool.query(
      `DELETE FROM \`${process.env.DB_POSTTABLE}\` WHERE post_id = ?`,
      [id]
    );

    //console logging that a user has deleted a post
    console.log(`Post = ${id} Was Deleted By User = ${UserId}`);

    //send a success message
    return res.status(200).json(DeletePost);
  } catch (error) {
    //basic error handling in case of error
    console.log(error);
  }
};

//async await post update function which will first check if the user is logged in and then retrive the user id from the cookie and will procced check if the retrieved id is the auther of the post the user wants to update if successful will send the success message
const UpdatePost = async (req, res) => {
  //retrieve the cookie called token from the req
  const CheckCookieExists = req.cookies.token;

  //check if the user has the token
  if (!CheckCookieExists) {
    return res.status(400).send("No Cookie Found, Login First.");
  }

  //the post id which will be retrieved from the url
  const id = req.params.id;

  //check if the user send a id
  if (!id || id === "") {
    return res.status(400).send("ID Was Not Found.");
  }

  //the fields which will be recieved from the req body
  const { post_title, post_body } = req.body;

  //check if all the fields are recieved
  if (!post_title || post_title === "" || !post_body || post_body === "") {
    return res.status(400).send("All Fields Are Required.");
  }

  //try catch block for helpful error handling and maintainability
  try {
    //decoding and storing the user id from cookie called token
    const decoded = jwt.verify(CheckCookieExists, process.env.JWT_SECRET);
    const UserId = decoded.id;

    //check if the user id matches with the post author's id
    const [
      CheckIfIdMatches
    ] = await req.pool.query(
      `SELECT COUNT(*) AS count FROM \`${process.env
        .DB_POSTTABLE}\` WHERE author_id = ? AND post_id = ?`,
      [UserId, id]
    );

    //check if the specific post has auther being the user retrieved from the cookie
    if (CheckIfIdMatches[0].count === 0) {
      return res.status(400).send("You Aren't The Author, Can't Update Post.");
    }

    //console logging that a user has updated a post
    console.log(`Post = ${id} Was Updated By User = ${UserId}`);

    //if a file is passed to update the image of a blog post
    if (req.file) {
      //call the uploader function and pass the path of the file
      const result = await cloudinary.uploader.upload(req.file.path);

      //after it's completed save the secure url in a variable
      const ImageUrl = result.secure_url;

      //update the post after the author id and id from cookie matches with the cloudinary image url
      const [UpdatePost] = await req.pool.query(
        `UPDATE \`${process.env
          .DB_POSTTABLE}\` SET post_title = ?, post_body = ?, post_image = ? WHERE post_id = ?`,
        [post_title, post_body, ImageUrl, id]
      );

      //send a success message
      return res.status(200).json(UpdatePost);
    } else {
      //update the post after the author id and id from cookie matches
      const [UpdatePost] = await req.pool.query(
        `UPDATE \`${process.env
          .DB_POSTTABLE}\` SET post_title = ?, post_body = ? WHERE post_id = ?`,
        [post_title, post_body, id]
      );

      //send a success message
      return res.status(200).json(UpdatePost);
    }
  } catch (error) {
    //basic error handling in case of error
    console.log(error);
  }
};

module.exports = { AddPost, GetPosts, GetPost, DeletePost, UpdatePost };
