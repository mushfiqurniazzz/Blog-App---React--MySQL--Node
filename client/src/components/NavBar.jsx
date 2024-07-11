//importing use state for having the value of input fields
import { useState } from "react";

//import the logo image
import LogoImg from "../styles/images/logo.png";

//importing styles sheet for nav bar
import styles from "../styles/NavBar.module.css";

//importing axios for creating a model which will show user details on the id provided
import axios from "axios";

//importing functions from react router dom for making the navigation bar more dynamic
import { Link } from "react-router-dom";

//importing toast from sonner for pushing toast notifications to indicate success, error and warnings
import { toast } from "sonner";

//react arrow functiom componenet called nav bar which will be used in all the pages
const NavBar = () => {
  //use state empty string  on id input fields for depecting null
  const [id, setId] = useState("");

  //use state null  on state variable for rendering a modal with user credentials, by default will depect null
  const [userdata, setUserdata] = useState(null);

  //check if there's a cookie exisiting in the localstorage of the user which will be saved during the log in proccess, if theres no cookie render the nav bar in a specific way using the conditonal statements
  const CheckCookieExists = localStorage.getItem("token");

  //function for sending a req to the server and then show the result using a modal
  const FetchUser = async (e) => {
    //will prevent the default form submission behaviour that is reloading the page
    e.preventDefault();

    //if no id is found in the input field, send a toast warning message
    if (!id || id === "") {
      return toast.warning("Id was not found.");
    }

    //try catch blocks for better readability and maintanibility
    try {
      //posting to the server with the id got from the input field
      const res = await axios.post("http://localhost:5000/user/searchuser", {
        id: id
      });

      //if the post request was a success
      if (res.status === 200) {
        setId(""); //first empty the input fields

        //declare the data object recieved in a variable
        const data = res.data;

        //set the response object as the data
        setUserdata(data);

        //if data is null
        if (!data) {
          return toast.info("No user exists with this id.");
        }

        toast.success("User found successfuly.");

        //the compiler needs time to react the end of the componenet function to auto call it
        setTimeout(() => {
          document.getElementById("userdetailsmodalbutton").click();
        }, 100);
      }
    } catch (error) {
      //basic error handling in case of error in both development and rendering
      console.error(error);
      toast.error("No user exists with this id.");
    }
  };

  //function used to clear the data object after the modal is closed
  const clearUserdata = () => {
    setUserdata(null);
  };

  //rendering the ui
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <img
              // use the imported logo image
              src={LogoImg}
              width="60"
              height="60"
              alt="logo of blog app website"
            />
            <b>Blog App</b>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0" id={styles.ul}>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  aria-current="page"
                  to="/famousauthors"
                >
                  Famous Authors
                </Link>
              </li>

              {/* conditional rendering in react, do not render the create post if no cookie is found*/}
              {CheckCookieExists ? (
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to="createpost"
                  >
                    Create Post
                  </Link>
                </li>
              ) : (
                ""
              )}

              {/* conditional rendering in react, do not render the user profile if no cookie is found*/}
              {CheckCookieExists ? (
                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    aria-current="page"
                    to="/userprofile"
                  >
                    User Profile
                  </Link>
                </li>
              ) : (
                ""
              )}

              <li className="nav-item">
                <Link
                  className="nav-link active"
                  aria-current="page"
                  to="/about"
                >
                  About
                </Link>
              </li>
            </ul>
            <form className="d-flex" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search User By ID"
                aria-label="Search"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
              <button
                className="btn btn-outline-success"
                onClick={FetchUser}
                type="submit"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* if the data hos value and is not null render the following */}
      {userdata ? (
        <>
          <button
            id="userdetailsmodalbutton"
            type="button"
            className={styles.userdetailsmodalbutton}
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
          ></button>

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
                    User Details
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={clearUserdata}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>User ID: {userdata.id}</p>{" "}
                  <p>User Email: {userdata.email}</p>{" "}
                  <p>Total Posts: {userdata.totalposts}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
};

//exporting the created nav bar componenet
export default NavBar;
