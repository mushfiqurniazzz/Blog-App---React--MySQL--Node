//importing neccessary libraries, functions and stylesheets
import axios from "axios"; //axios for http requests
//for dinamically navigating to another page without reloading the page
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner"; //for rendering toast notifications
import styles from "../../styles/LogoutConfirm.module.css";
//for easy cookie manupulation
import Cookies from "js-cookie";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

//logout confirm page which will first check if the user has a cookie and then will procceed to send a post request to the server and incase of success will procceed to head to the home page
const LogoutConfirm = () => {
  //get hold of the cookie sent from server during the login process
  const CheckCookieExists = Cookies.get("token");

  //declaring navigate variable here as we cannot directly call it inside a function
  const navigate = useNavigate();

  //async function which will send a post request to the server using axios and the the server will delete the cookie of the user and send a success message when complited and then will render a success message that the user has been logged out and then will procced to log out the user
  const LogoutHandler = async () => {
    //using try catch blocks for better maintainability and readability of code
    try {
      //send a await axios post for sending a post request
      const res = await axios.post(
        "http://localhost:5000/auth/logout",
        { "": "" },
        {
          withCredentials: true,
        }
      );

      //render a toast notification
      toast.success("Loging out, will head to home.");

      //navigate to home after the toast notification is rendered
      setTimeout(() => {
        //navigating the user to the home page after successful logout
        navigate("/");
      }, 3000);
    } catch (error) {
      //basic error handling in case of error
      console.log(error);
      if (error.response.status === 401) {
        return toast.warning("To logout, login first.");
      }
      //rendering a toast notification incase of error
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
            <h3>Can&apos;t Logout</h3>
            <hr />
            <p>Can not logout an unauthenticated user. Please login first.</p>
            <hr />
            <Link to={"/login"} className="btn btn-success">
              Login
            </Link>
          </div>
        </div>
      ) : (
        <div className="card" id={styles.card}>
          <div className="clidcard" id={styles.childcard}>
            <h3>Logout Confirmation</h3>
            <hr />
            <p>
              Logging out will remove your existing information on you device
              and will have to login once again to have authenticated abilities.
              This action can not be undo.
            </p>
            <hr />
            <button className="btn btn-success" onClick={LogoutHandler}>
              Yes, Logout
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

//exporting the created logout functional componenet
export default LogoutConfirm;
