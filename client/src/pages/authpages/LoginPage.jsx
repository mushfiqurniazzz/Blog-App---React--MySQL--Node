//importing important functions, libraries and style sheet to complete the login page functional componenet
//use state for using use state variables in input fields
import { useState } from "react";
//axios for sending HTTP request
import axios from "axios";
//for sending toast notifications
import { toast } from "sonner";
//navigation and link function from dynamically go through pages without reloading the page
import { useNavigate, Link } from "react-router-dom";
import styles from "../../styles/LoginPage.module.css";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
//js-cookie library makes it easy to retrieve or set cokies from the frontend for the user
import Cookies from "js-cookie";
import OAuth from "../../components/OAuth";

//the login page functional componenet which will first check if the user has a cookie called token in the cookie section else will continue to log the user in ans set a cookie
const LoginPage = () => {
  //check if the user has a cookie,dont let the user login once again
  const CheckCookieExists = Cookies.get("token");

  //use nagivation varibale as cannot derictly use useNavigate in a function
  const navigate = useNavigate();

  //using state variablesfor accessing the values typed in the input fields for sign up
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //function for sending a axios post request to the server using the credentials provided in the input fields
  const LoginHandler = async (e) => {
    //will prevent the default form submission behaviour that is reloading the page
    e.preventDefault();

    //check if all the fields are provided in the input field if all the fields are not provided send a toast warning notification stating all fields are required
    if (!username || username === "" || !password || password === "") {
      //returning a statement will end the function and will not continue
      return toast.warning("All fields are required.");
    }

    //after all checks continue with the logging in the user by sending a post request to the server using axios with the provided credentials in a try catch block for better readability and maintainibility of our code
    try {
      const res = await axios.post(
        "http://localhost:5000/auth/login",
        {
          username: username,
          password: password,
        },
        { withCredentials: true }
      );
      //render a toast notification
      toast.success("Login successful, heading to home page.");
      console.log(res.data);

      //setting a token using the value recieved from the response data from the axios post request
      const cookieTokenValue = res.data.token;
      Cookies.set("token", cookieTokenValue);

      //after about 3 sec navigate the user to the home page
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      //basic error handler incase of error
      console.error(error);
      toast.error("Something went wrong try again later.");
    }
  };
  return (
    <>
      {/* react conditional rendering which will state some message if the cookie is present */}
      {CheckCookieExists ? (
        <div>
          <NavBar />
          <h1 className={styles.LoggedInUser}>
            Cannot login when a user&apos;s already logged in.
          </h1>
          <Footer />
        </div>
      ) : (
        <>
          <NavBar />
          <div className={styles.formparent}>
            <form className={styles.form}>
              <h3>Welcome Back.</h3>
              <hr />
              <div className="mb-3">
                <label htmlFor="UsernameInput" className="form-label">
                  Username
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
                  Password
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
              <div>
                <p id={styles.formfooterp}>
                  Don&apos;t have an account? <Link to="/signup">Signup</Link>
                </p>
                <div id={styles.buttons}>
                  <button
                    type="submit"
                    onClick={LoginHandler}
                    className="btn btn-primary"
                  >
                    Login
                  </button>
                  <OAuth />{" "}
                </div>
              </div>
            </form>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

//exporting the created function component sign up
export default LoginPage;
