//importing neccessary functional components, libraries for completing the update post functional component use state and use ref for using state variables and having functionalities for rendering
import { useState, useRef, useEffect } from "react";
//for sending HTTP reuests
import axios from "axios";
//for sending toast notifications to the user
import { toast } from "sonner";
//for having better functionality for getting and setting cookies
import Cookies from "js-cookie";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";
//importing the same stylesheet as create post for re usability
import styles from "../../styles/CreatePost.module.css";
//for navigating through the pages dinamicaly
import { Link, useNavigate } from "react-router-dom";

//update post functional componenet which first checks if the user is authenticated to update a post then continues to render input fields and send to server and if success sends a 200 success message
const UpdatePost = () => {
  //get the cookie called token recieved from server during the login proccess
  const CheckCookieExists = Cookies.get("token");

  //get the id of the post we are updating using few javascript functions
  const id = new URL(window.location.href).pathname
    .split("/")
    .pop()
    .replace(":", "");

  //use state variable for holding the use eddect data into which will be used for the uther state variables
  const [PostData, setPostData] = useState([]);

  //use state variable for dynamically changing and having hold of the value of post title input field
  const [post_title, setPost_title] = useState();

  //use state variable for dynamically changing and having hold of the value of post body input field
  const [post_body, setPost_body] = useState();

  //use ref variable for changing and having hold of the value of image input field
  const fileInputRef = useRef(null);

  //declaring the use navigate function for dynamically navigate to pages as cannot be directly used in a function
  const navigate = useNavigate();

  //passing a function and then calling it in use effect which will be used to set the values of input fields for easy updating when the app gets mounted
  useEffect(() => {
    const FetchPostInfo = async () => {
      //using try catch block for better readability of code
      try {
        const res = await axios.get(`http://localhost:5000/post/${id}`, {
          withCredentials: true
        });

        //hold the data recieved from the http request in a variable
        const data = res.data;

        //if the server returns a success message indicating data has been recieved
        if (res.status === 200) {
          //set the state varuable with the data
          setPostData(data);
          setPost_title(PostData.post_title);
          setPost_body(PostData.post_body);
        }
      } catch (error) {
        //basic error handling incase of error
        console.log(error);
      }
    };

    FetchPostInfo();
  }, [id]);

  //async await function which will send a put request to the server and incase of success will render a success message and a few tasks and incase of error will render an error toast notification
  const UpdatePostHandler = async (e) => {
    //will prevent the default form submission behaviour that is reloading the page
    e.preventDefault();

    //check if all the  fields are entered
    if (!post_title || post_title === "" || !post_body || post_body === "") {
      return toast.warning("All fields are required.");
    }

    //if all fields are given continue with creating the post by sending the credentials to the server
    try {
      // Create FormData object and append form fields
      const formData = new FormData();
      formData.append("post_title", post_title);
      formData.append("post_body", post_body);
      if (fileInputRef.current.files[0]) {
        formData.append("image", fileInputRef.current.files[0]);
      }

      // Send the form data using Axios
      const res = await axios.put(
        `http://localhost:5000/post/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          withCredentials: true
        }
      );

      if (res.status === 200) {
        console.log(res.data);
        toast.success("Your post was updated, heading to profile.");

        //now set the input fields as it was before
        setPost_title("");
        setPost_body("");
        fileInputRef.current.value = null;

        //after 3sec navigate the user to the profile page
        setTimeout(() => {
          navigate("/userprofile");
        }, 3000);
      }
    } catch (error) {
      //basic error handler incase of error, console log the error mesage and send a toast message stating something went wrong
      console.error(error);
      //render an error message incase of error
      toast.error("Something went wrong.");
    }
  };

  return (
    <>
      {!CheckCookieExists ? (
        <>
          <Navbar />
          <div className={styles.cannotpost}>
            <h1>
              Cannot update a blog post without authentication, login first.
            </h1>
            <Link to={"/login"}>Click Here to Login</Link>
          </div>
          <Footer />
        </>
      ) : (
        <>
          <Navbar />
          <div className={styles.formparent}>
            <form className={styles.form}>
              <h3>Update Post.</h3>
              <hr />
              <div className="mb-3">
                <label htmlFor="PostTitleInput" className="form-label">
                  New Post Title
                </label>
                <input
                  type="text"
                  value={post_title}
                  onChange={(e) => {
                    setPost_title(e.target.value);
                  }}
                  className="form-control"
                  placeholder="Post Title"
                  id="PostTitleInput"
                  aria-describedby="emailHelp"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="PostBodyInput" className="form-label">
                  New Post Body
                </label>
                <textarea
                  type="text"
                  value={post_body}
                  onChange={(e) => {
                    setPost_body(e.target.value);
                  }}
                  placeholder="Post Body"
                  className="form-control"
                  id="PostBodyInput"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="inputGroupFile04" className="form-label">
                  Select a New Image
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="inputGroupFile04"
                  aria-describedby="inputGroupFileAddon04"
                  aria-label="Upload"
                  ref={fileInputRef}
                />
              </div>
              <div>
                <button
                  id={styles.formfooterbutton}
                  type="submit"
                  onClick={UpdatePostHandler}
                  className="btn btn-primary"
                >
                  Update Post
                </button>
              </div>
            </form>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

//exporting the created update post functional component
export default UpdatePost;
