//importing the mysql2/promise for async await connection with database
const mysql = require("mysql2/promise");

//async await database connection function using the credentials stored in environmental variables
const ConnDb = async (req, res) => {
  //using a try-catch block for making the function developer friendly
  try {
    const pool = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      waitForConnections: process.env.DB_WAITFORCONNECTIONS,
      connectionLimit: process.env.DB_CONENCTIONLIMIT,
      queueLimit: process.env.DB_QUEUELIMIT
    });

    //await querys which would create if not exists a database, table for email, username, password, and a post

    //await create database query with error and success handling
    const CreateDatabase = await pool.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_DATABASE}\``
    );
    //if not successfully created the database console log the error
    if (!CreateDatabase) {
      console.log(`Error Creating Database ${process.env.DB_DATABASE}`);
    }
    //if successfully the database was created
    console.log(`Successfully Created DataBase ${process.env.DB_DATABASE}`);

    //await switching to the created database query with error and success handling
    const SwtichDatabase = await pool.query(
      `USE \`${process.env.DB_DATABASE}\``
    );
    //if not successfully switched to the created database
    if (!SwtichDatabase) {
      console.log(`Couldn't Switch to ${process.env.DB_DATABASE}`);
    }
    //if switched to the created database successfully
    console.log(`Switched to ${process.env.DB_DATABASE}`);

    //await create table for email, username, password, posts and users for access
    const CreateAuthTable = await pool.query(
      `CREATE TABLE IF NOT EXISTS \`${process.env.DB_AUTHTABLE}\`(
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(50) NOT NULL UNIQUE,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    );

    //if not successfully created the user authentication table
    if (!CreateAuthTable) {
      console.log(`Error Creating Table, ${process.env.DB_AUTHTABLE}`);
    }

    //else case, if the user authentication table was created successfully
    console.log(`Successfully Created Table, ${process.env.DB_AUTHTABLE}`);

    //await create table for storing post data, post tittle, post image, post paragraph
    const CreatePostTable = await pool.query(
      `CREATE TABLE IF NOT EXISTS \`${process.env.DB_POSTTABLE}\`(
        post_id INT AUTO_INCREMENT PRIMARY KEY,
        author_id INT,
        post_title VARCHAR(250) NOT NULL,
        post_body TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES \`${process.env.DB_AUTHTABLE}\` (id)
      )`
    );

    //if not successfully created the post table
    if (!CreatePostTable) {
      console.log(`Error Creating Table, ${process.env.DB_POSTTABLE}`);
    }

    //if the post table was successfully created
    console.log(`Successfully Created Table, ${process.env.DB_POSTTABLE}`);

    //returning the pool for using in the controller functions
    return pool;
    
  } catch (error) {
    console.error("Error Connecting to DataBase")
  }
};

//exporting the database connection function
module.exports = ConnDb;
