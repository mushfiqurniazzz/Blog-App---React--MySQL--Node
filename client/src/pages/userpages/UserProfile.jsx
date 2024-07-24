import { useState, useEffect, useRef } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import Cookies from "js-cookie";
import styles from "../../styles/UserProfile.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const UserProfile = () => {
  //check if cookie exists in the user
  const CheckCookieExists = Cookies.get("token");

  //use state variable for initializing the variable with res data for easy access
  const [userprofiledata, setUserprofiledata] = useState([]);

  //use ref variable for rendering the toast notification once during the use effect function
  const hasFetcheduserprofiledata = useRef(false);

  //function for closing the modal when a user clicks on a specific setting
  const CloseModalonClick = () => {
    document.getElementById("Update user credentials(email, username)").click();
  };

  //use effecct function expects a call back function which will be called when the app is mounted
  useEffect(() => {
    const FetchUserprofiledata = async () => {
      //using a try catch block for better readability
      try {
        //send a post request to the server for fetching user profile infoormation
        const res = await axios.get("http://localhost:5000/user/userprofile", {
          withCredentials: true
        });

        //if the server sends a response of 200 which indicates successful operation
        if (res.status === 200) {
          //create a data variable and set the empty array with data retrieved from the axios post request
          const data = res.data;

          setUserprofiledata(data);

          //render a success message to the user as the user profile info fetching was a success using the use ref variable for rendering the success message once
          if (!hasFetcheduserprofiledata.current) {
            toast.success("User info was fetched successfuly.");
            hasFetcheduserprofiledata.current = true;
          }
        }
      } catch (error) {
        //basic error handling in case of error
        console.error(error);

        //if there was an error the error will be rendered to the user through using the use ref declared variable only once
        if (!hasFetcheduserprofiledata.current) {
          toast.error("Something went wrong.");
          hasFetcheduserprofiledata.current = true;
        }
      }
    };
    FetchUserprofiledata();
  }, []);

  return (
    <>
      <NavBar />
      {!CheckCookieExists ? (
        <div className={styles.nocookiecard}>
          <h1>
            This page can&apos;t be accessed by an unauthenticated user. Please
            login first.
          </h1>
          <Link to={"/login"} id={styles.Linklogin} className="btn btn-primary">
            Click Here to Login
          </Link>
        </div>
      ) : (
        <>
          <div className={styles.settings}>
            <button
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
            >
              Settings
            </button>
          </div>
          <div className="box" id={styles.card}>
            <div className={styles.leftsiderender}>
              <h2>
                Hello, <b>{userprofiledata.username}</b>
              </h2>
              <hr />
              <h4>
                <b>Your User id:</b> {userprofiledata.id}
              </h4>
              <h4>
                <b>Your Email:</b> {userprofiledata.email}
              </h4>
              <h4>
                <b>Joined on blog app:</b> {userprofiledata.created_at}
              </h4>
              <h4>
                <b>Total posts :</b> {userprofiledata.totalposts}
              </h4>
            </div>
          </div>

          {/* when user clicks on settings this modal will appear */}
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
                    User Settings
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    id="userprofilesettingsclosemodal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body" id={styles.modalbody}>
                  <p>
                    <Link
                      className="btn"
                      onClick={CloseModalonClick}
                      to={"/updateuser"}
                    >
                      Update user credentials(email, username)
                    </Link>
                  </p>
                  <p>
                    <Link
                      className="btn"
                      onClick={CloseModalonClick}
                      to={"/changeuserpassword"}
                    >
                      Change user password
                    </Link>
                  </p>
                  <p>
                    <Link
                      className="btn"
                      onClick={CloseModalonClick}
                      to={"/deleteuser"}
                    >
                      Delete user
                    </Link>
                  </p>
                  <p>
                    <Link
                      className="btn"
                      onClick={CloseModalonClick}
                      to={"/logout"}
                    >
                      Logout
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <Footer />
    </>
  );
};

export default UserProfile;
