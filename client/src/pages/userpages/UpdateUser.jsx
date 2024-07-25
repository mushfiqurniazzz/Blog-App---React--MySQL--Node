//importing neccessary functional components, libraries for completing the create post functional component use state and use ref for using state variables and having functionalities for rendering
import { useState } from "react";
//for sending HTTP reuests
import axios from "axios";
//for sending toast notifications to the user
import { toast } from "sonner";
//for dinamically navigating user to a different path
import { Link, useNavigate } from "react-router-dom";
//for having better functionality for getting and setting cookies
import Cookies from "js-cookie";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";
import styles from "../../styles/UpdateUser.module.css";

const UpdateUser = () => {
  //get hold of the cookie called token in user
  const CheckCookieExists = Cookies.get("token");

  //declaring the navigation function here as cannot be directly used in a function
  const navigate = useNavigate();

  //use state variables for getting hold of the input field variables
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //async await function for updating the user using axios which will be sent to the server
  const UpdateUserHandler = async () => {
    //first check if all the input fields are provided else return a toast notification
    if (
      !email ||
      email === "" ||
      !username ||
      username === "" ||
      !password ||
      password === ""
    ) {
      return toast.info("All fields are required.");
    }

    //using a try catch block for better readability of code
    try {
      //axios put request in a variable using await keyword
      const res = await axios.put(
        "http://localhost:5000/user/updateuser",
        {
          email: email,
          username: username,
          password: password
        },
        {
          withCredentials: true
        }
      );

      //hold the recieved data in a variable
      const data = res.data;

      //if the server sends a success message
      if (res.status === 200) {
        //console log the data which is the newly updated credentials
        console.log(data);

        //render a success message that the user has been updated
        toast.success("User updated, heading to profile");

        //after 3 sec navigate the user to the profile page
        setTimeout(() => {
          navigate("/userprofile");
        }, 3000);
      }
    } catch (error) {
      //basic error handling in case of error
      console.log(error);
      //rendering a toast notification about the error
      toast.error("Something went wrong.");
    }
  };

  return (
    <>
      <Navbar />
      {!CheckCookieExists ? (
        <div className="card" id={styles.card}>
          <div className="chidcard" id={styles.childcard}>
            <h3>Can&apos;t Update User</h3>
            <hr />
            <p>
              Can not update an unauthenticated user&apos;s credentials. Please
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
            <h3>Update User Credentials</h3>
            <hr />
            <div className="mb-3">
              <label htmlFor="EmailInput" className="form-label">
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="form-control"
                placeholder="Email"
                id="EmailInput"
                aria-describedby="emailHelp"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="UsernameInput" className="form-label">
                Username:
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                className="form-control"
                placeholder="Username"
                id="UsernameInput"
                aria-describedby="emailHelp"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="PasswordInput" className="form-label">
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="Password"
                className="form-control"
                id="PasswordInput"
              />
            </div>
            <hr />
            <div id={styles.button}>
              <button className="btn btn-success" onClick={UpdateUserHandler}>
                Update User
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default UpdateUser;
