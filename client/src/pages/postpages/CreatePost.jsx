//importing neccessary functional components, libraries for completing the create post functional component use state and use ref for using state variables and having functionalities for rendering
import { useState, useRef } from "react";
//for sending HTTP reuests
import axios from "axios";
//for sending toast notifications to the user
import { toast } from "sonner";
//for having better functionality for getting and setting cookies
import Cookies from "js-cookie";
import Navbar from "../../components/NavBar";
import Footer from "../../components/Footer";
import styles from "../../styles/CreatePost.module.css";

//create post functional componenet which first checks if the user is authenticated to create a post then continues to render input fields and send to server and if success sends a 200 success message
const CreatePost = () => {
  //get the cookie called token recieved from server during the login proccess
  const CheckCookieExists = Cookies.get("token");

  //use state variable for dynamically changing and having hold of the value of post title input field
  const [post_title, setPost_title] = useState("");

  //use state variable for dynamically changing and having hold of the value of post title input field
  const [post_body, setPost_body] = useState("");

  //use ref variable for changing and having hold of the value of image input field
  const fileInputRef = useRef(null);

  const CreatePostHandler = async (e) => {
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
      const res = await axios.post(
        "http://localhost:5000/post/addpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          withCredentials: true
        }
      );

      if (res.status === 201) {
        console.log(res.data);
        toast.success("Your post was added.");

        //now set the input fields as it was before
        setPost_title("");
        setPost_body("");
        fileInputRef.current.value = null;
      }
    } catch (error) {
      //basic error handler incase of error, console log the error mesage and send a toast message stating something went wrong
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <>
      {!CheckCookieExists ? (
        <>
          <Navbar />
          <h1 className={styles.cannotpost}>
            Cannot create a blog post without authentication, login first.
          </h1>
          <Footer />
        </>
      ) : (
        <>
          <Navbar />
          <div className={styles.formparent}>
            <form className={styles.form}>
              <h3>Create Post.</h3>
              <hr />
              <div className="mb-3">
                <label htmlFor="PostTitleInput" className="form-label">
                  Post Title
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
                  Post Body
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
                  Select an Image
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
                  onClick={CreatePostHandler}
                  className="btn btn-primary"
                >
                  Create Post
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

//exporting the created functional componenet
export default CreatePost;
