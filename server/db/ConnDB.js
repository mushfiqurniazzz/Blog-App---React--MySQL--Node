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
    if (SwtichDatabase) {
      console.log(`Couldn't Switch to ${process.env.DB_DATABASE}`);
    }
    //if switched to the created database successfully
    console.log(`Switched to ${process.env.DB_DATABASE}`);

    //await create table for email, username, password, posts
  } catch (error) {}
};
