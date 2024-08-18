import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import styles from "../../styles/DeleteUser.module.css";
import Cookies from "js-cookie";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

const DeleteUser = () => {
  //get hold of the cookie sent from server during the login process
  const CheckCookieExists = Cookies.get("token");

  //declaring navigate variable here as we cannot directly call it inside a function
  const navigate = useNavigate();

  //async function which will send a post request to the server using axios and the the server will delete the cookie of the user and send a success message when complited and then will render a success message that the user has been logged out and then will procced to log out the user
  const DeleteHandler = async () => {
    //using try catch blocks for better maintainability and readability of code
    try {
      //send a await axios post for sending a post request
      const res = await axios.delete("http://localhost:5000/user/deleteuser", {
        withCredentials: true,
      });

      //if the request was a success the server will return a success message
      toast.success("User deleted, will head to home.");

      //navigate to home after the toast notification is rendered
      setTimeout(() => {
        //navigating the user to the home page after successful logout
        navigate("/");
      }, 3000);
    } catch (error) {
      //basic error handling in case of error
      console.log(error);
 if (error.response.status === 401) {
   return toast.warning("To delete your account, login first.");
 }
 //rendering a toast notification
 return toast.error("Something went wrong.");
    }
  };
  return (
    <>
      <NavBar />
      {/* if no cookie is found in the user will render to login */}
      {!CheckCookieExists ? (
        <div className="card" id={styles.card}>
          <div className="clidcard" id={styles.childcard}>
            <h3>Can&apos;t Delete User</h3>
            <hr />
            <p>
              Can not delete an user who is unauthenticated. Please login first
            </p>
            <hr />
            <Link to={"/login"} className="btn btn-success">
              Login
            </Link>
          </div>
        </div>
      ) : (
        <div className="card" id={styles.card}>
          <div className="clidcard" id={styles.childcard}>
            <h3>Delete User Confirmation</h3>
            <hr />
            <p>
              Are you sure you want to delete your account? this action will
              cause all your posts and data to be deleted from server. This
              action can not be undo.
            </p>
            <hr />
            <button className="btn btn-success" onClick={DeleteHandler}>
              Yes, Delete User
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default DeleteUser;
