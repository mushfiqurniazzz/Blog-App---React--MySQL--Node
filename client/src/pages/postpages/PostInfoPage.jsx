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

  //passing a function and then calling it in use effect which will be rendered when the app gets mounted
  useEffect(() => {
    const FetchPostInfo = async () => {
      const res = await axios.get("http://localhost:5000/post/:");
    };
  }, []);

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
        ""
      )}
      <Footer />
    </>
  );
};

//exporting the created PostInfoPage functional component
export default PostInfoPage;
