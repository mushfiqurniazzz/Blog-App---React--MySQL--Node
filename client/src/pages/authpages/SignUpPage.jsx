import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import styles from "../../styles/SignUpPage.module.css";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

const SignUpPage = () => {
  const navigate = useNavigate();

  //using state variablesfor accessing the values typed in the input fields for sign up
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirm_password] = useState("");

  //function for sending a axios post request to the server using the credentials provided in the input fields
  const SignupHandler = async (e) => {
    //will prevent the default form submission behaviour that is reloading the page
    e.preventDefault();

    //check if all the fields are provided in the input field if all the fields are not provided send a toast warning notification stating all fields are required
    if (
      !email ||
      email === "" ||
      !username ||
      username === "" ||
      !password ||
      password === "" ||
      !confirm_password ||
      confirm_password === ""
    ) {
      //returning a statement will end the function and will not continue
      return toast.warning("All fields are required.");
    }

    //after all fields are provided check if the user has provided the same password in password and confirm password if not return a warning message using toast notifications
    if (password != confirm_password) {
      return toast.warning("Passwords don't match.");
    }

    //after all checks continue with the sign up by sending a post request to the server using axios with the provided credentials in a try catch block for better readability and maintainibility of our code
    try {
      const res = await axios.post("http://localhost:5000/auth/signup", {
        email: email,
        username: username,
        password: password,
        confirm_password: confirm_password
      });

      //if the sign up was successfull the server will return a 201 created http res code then send a toast success notification, console log the user info like id, email and username of the user then finally navigate the user ot the login for logging in
      if (res.status === 201) {
        toast.success("User created, heading to login.");
        console.log(res.data);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      //basic error handler incase of error
      console.error(error);
      toast.error("Something went wrong try again later.");
    }
  };
  return (
    <>
      <NavBar />
      <div className={styles.formparent}>
        <form className={styles.form}>
          <h3>Create an account.</h3>
          <hr />
          <div className="mb-3">
            <label htmlFor="EmailInput" className="form-label">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Email"
              className="form-control"
              id="EmailInput"
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" className="form-text">
              We&apos;ll never share your email with anyone else.
            </div>
          </div>
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
          <div className="mb-3">
            <label htmlFor="ConfirmPasswordInput" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirm_password}
              onChange={(e) => {
                setConfirm_password(e.target.value);
              }}
              placeholder="Confirm Password"
              className="form-control"
              id="ConfirmPasswordInput"
            />
          </div>
          <div>
            <p id={styles.formfooterp}>
              Already a user? <Link to="/login">Login</Link>
            </p>
            <button
              id={styles.formfooterbutton}
              type="submit"
              onClick={SignupHandler}
              className="btn btn-primary"
            >
              Signup
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

//exporting the created function component sign up
export default SignUpPage;
