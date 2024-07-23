import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import styles from "../../styles/LogoutModal.module.css";

const LogoutModal = () => {
  //declaring use navigate from react router dom in a variable as we cannot call use navigate function directly in a function
  const navigate = useNavigate();

  //async function which will send a post request to the server using axios and the the server will delete the cookie of the user and send a success message when complited and then will render a success message that the user has been logged out and then will procced to log out the user
  const LogoutHandler = async () => {
    //clicking on the modal close button before continuing with opening another modal as two modals cannot be opened at the same time
    document.getElementById("userprofilesettingsmodal").click();

    //using try catch blocks for better maintainability and readability of code
    try {
      //send a await axios post for sending a post request
      const res = await axios.post(
        "http://localhost:5000/auth/logout",
        { "": "" },
        {
          withCredentials: true
        }
      );

      //if the request was a success the server will return a success message
      if (res.status === 200) {
        setTimeout(() => {
          toast.success("Loging out, will head to home.");
          //navigating the user to the home page after successful logout
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      //basic error handling in case of error
      console.log(error);

      //rendering a toast notification incase of error
      toast.error("Something went wrong.");
    }
  };

  return (
    <>
      <p>
        <button
          className="btn"
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
          onClick={LogoutHandler}
        >
          Logout
        </button>
      </p>

      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Confirmation for logout
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body" id={styles.modalbody}>
              ok demo modal sex
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutModal;
