import { useEffect, useState, useRef } from "react";
import NavBar from "../../components/NavBar";
import { toast } from "sonner";
import Footer from "../../components/Footer";
import Cookies from "js-cookie";
import styles from "../../styles/PostInfoPage.module.css";
import { Link } from "react-router-dom";
import axios from "axios";

//PostInfoPage functional componenet which will run a function when the application mounted and it will send a get request to the server and render the data
const PostInfoPage = () => {
  //check if the user has a cookie to view theblog post
  const CheckCookieExists = Cookies.get("token");

  //use state, use ref variables for saving the data and for rendering the toast notification once
  const [postdata, setPostdata] = useState([]);
  const hasFetchedPostData = useRef(false);

  const id = new URL(window.location.href).pathname
    .split("/")
    .pop()
    .replace(":", "");

  //passing a function and then calling it in use effect which will be rendered when the app gets mounted
  useEffect(() => {
    const FetchPostInfo = async () => {
      //using try catch block for better readability of code
      try {
        const res = await axios.get(`http://localhost:5000/post/${id}`, {
          withCredentials: true,
        });

        //hold the data recieved from the http request in a variable
        const data = res.data;

        //set the state varuable with the data
        setPostdata(data);

        //render a success message indicating the fetching was a success
        if (!hasFetchedPostData.current) {
          toast.success("Blog post data fetched.");
          //set the ref variable as true after rendering
          hasFetchedPostData.current = true;
        }
      } catch (error) {
        //basic error handling incase of error
        console.log(error);
        if (error.response.status === 422) {
          return toast.warning("Id was not found for the post.");
        }
        if (error.response.status === 401) {
          return toast.warning("To read this blog, login first.");
        }
        //render a toast notification using the use ref variable
        if (!hasFetchedPostData.current) {
          toast.error("Something went wrong.");
          //set the ref variable as true after rendering
          hasFetchedPostData.current = true;
        }
      }
    };

    FetchPostInfo();
  }, [id]);

  return (
    <>
      <NavBar />
      {/*  if no token is found render the user is not authenticated to view the blog post */}
      {!CheckCookieExists ? (
        <>
          <div className={styles.parentdiv}>
            <h1>
              You aren&apos;t authenticated to view the blog post. Please login
              first
            </h1>
            <Link to={"/login"} className="btn btn-success" id={styles.Link}>
              Click Here to Login
            </Link>
          </div>
        </>
      ) : (
        <div className="card" id={styles.card}>
          <div className={styles.childcard}>
            <h1>
              {postdata.post_id}. {postdata.post_title}
            </h1>
            <h5>This Blog post was made by author: {postdata.author_id}</h5>
            <p>Was uploaded at: {postdata.created_at}</p>
            <img
              id={styles.image}
              src={postdata.post_image}
              alt="image of the blog post used by the author"
            />
            <p>{postdata.post_body}</p>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

//exporting the created PostInfoPage functional component
export default PostInfoPage;
