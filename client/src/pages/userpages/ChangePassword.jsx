//importing neccessary dybctuins kibraries to complete the change passwird functional component
import { useState } from "react"; //state variables for the hold of input values
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
//for easy manipulation of cookies
import Cookies from "js-cookie";
import styles from "../../styles/ChangePassword.module.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const ChangePassword = () => {
  //getting hold of the cookie called token saved in the user during login proccess
  const CheckCookieExists = Cookies.get("token");

  //declaring use state variables for the hold of input values
  const [old_password, setOld_Password] = useState("");
  const [new_password, setNew_Password] = useState("");
  const [confirm_new_password, setConfirm_New_Password] = useState("");

  //declaring use navigate as cannot be directly be used in function
  const navigate = useNavigate("");

  //async await function for sending a put request to the server for changing the user password
  const ChangePasswordHandler = async () => {
    //if all the input fields are not provided
    if (
      !old_password ||
      old_password === "" ||
      !new_password ||
      new_password === "" ||
      !confirm_new_password ||
      confirm_new_password === ""
    ) {
      return toast.info("All fields are required");
    }

    //check if the new password and confirm new password matches
    if (new_password != confirm_new_password) {
      return toast.info("Passwords do not match.");
    }
    //using try catch block for better code readability
    try {
      //sending a axios put request to the server using a variable
      const res = await axios.put(
        "http://localhost:5000/user/changepass",
        {
          old_password: old_password,
          new_password: new_password,
          confirm_new_password: confirm_new_password,
        },
        {
          withCredentials: true,
        }
      );

      //set the recieved data in a variable
      const data = res.data;

      //incase the axios http request to the server was a success

      //console log the data recieved from the server
      console.log(data);

      //render a toast notfication that the user password has been updated
      toast.success("Password updated, heading to profile", {
        description: "You will be now required to log in again.",
      });

      //after 3sec navigate the user to profile
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      //basic error handling in case of error
      console.log(error);
      //rendering a toast notification
      toast.error("Something went wrong.");
    }
  };
  return (
    <>
      <NavBar />
      {!CheckCookieExists ? (
        <div className="card" id={styles.card}>
          <div className="chidcard" id={styles.childcard}>
            <h3>Can&apos;t Change User Password</h3>
            <hr />
            <p>
              Can not change an unauthenticated user&apos;s password. Please
              login first.
            </p>
            <hr />
            <div id={styles.linktologin}>
              <Link
                to={"/login"}
                id={styles.linktologin}
                className="btn btn-success"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="card" id={styles.card}>
          <div className="chidcard" id={styles.childcard}>
            <h3>Change User Password</h3>
            <hr />
            <div className="mb-3">
              <label htmlFor="old_password" className="form-label">
                Old Password:
              </label>
              <input
                type="password"
                value={old_password}
                onChange={(e) => {
                  setOld_Password(e.target.value);
                }}
                className="form-control"
                placeholder="Old Password"
                id="old_password"
                aria-describedby="emailHelp"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="new_password" className="form-label">
                New Password:
              </label>
              <input
                type="password"
                value={new_password}
                onChange={(e) => {
                  setNew_Password(e.target.value);
                }}
                className="form-control"
                placeholder="New Password"
                id="new_password"
                aria-describedby="emailHelp"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirm_new_password" className="form-label">
                Confirm New Password:
              </label>
              <input
                type="password"
                value={confirm_new_password}
                onChange={(e) => {
                  setConfirm_New_Password(e.target.value);
                }}
                placeholder="Confirm New Password"
                className="form-control"
                id="confirm_new_password"
              />
            </div>
            <hr />
            <div id={styles.button}>
              <button
                className="btn btn-success"
                onClick={ChangePasswordHandler}
              >
                Change User Password
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default ChangePassword;
