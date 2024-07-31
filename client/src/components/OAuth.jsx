//importing the important functions, componenet functions and libraries to crate this firebase authentication function
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
//importing firebase config initialization app
import { app } from "../FireBaseConfig";
//dinamically navigating through the pages
import { useNavigate } from "react-router-dom";
//axios for sending http requests to the server
import axios from "axios";
//for rendering toast notifications
import { toast } from "sonner";
//importing module styles
import styles from "../styles/OAuth.module.css";
//for easy CRUD operations with the cookie from client side
import Cookies from "js-cookie";

const OAuth = () => {
  //using some important libraries for our desired tasks
  const auth = getAuth(app);
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);

      //using axios for sending the created account's email
      const res = await axios.post(
        "http://localhost:5000/auth/google",
        {
          email: resultsFromGoogle.user.email
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );

      //if the server sends back a response of 200
      if (res.status === 201) {
        console.log(res.data);
        //rendering a toast notification in case of success
        toast.success("Signup using email was successful.");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }

      if (res.status === 200) {
        console.log(res.data);
        //rendering a toast notification in case of success
        toast.success("Login using email was successful, heading to home.");
        const cookieTokenValue = res.data.token;
        Cookies.set("token", cookieTokenValue);

        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      //basic error handling
      console.log(error);
      //rendering an error message
      toast.error("Something went wrong.");
    }
  };
  return (
    <>
      <button
        type="button"
        className={"btn btn-warning"}
        onClick={handleGoogleClick}
        id={styles.button}
      >
        <i className="fa-brands fa-google" />
        Continue with Google
      </button>
    </>
  );
};

export default OAuth;
