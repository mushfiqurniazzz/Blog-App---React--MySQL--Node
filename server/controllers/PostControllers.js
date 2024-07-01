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
    }

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
  } catch (error) {
    //basic error handling in case of error
    console.error(error);
  }
};

const GetPosts = async () => {
  console.log("GetPosts function was hit.");
};

const GetPost = async () => {
  console.log("GetPost function was hit.");
};

const DeletePost = async () => {
  console.log("DeletePost function was hit.");
};

const UpdatePost = async () => {
  console.log("UpdatePost function was hit.");
};

module.exports = { AddPost, GetPosts, GetPost, DeletePost, UpdatePost };
