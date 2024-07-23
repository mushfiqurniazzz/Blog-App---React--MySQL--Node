//importing use state, use effect and useRef for use of state variable, for mounting a function and to check if the users has been fetched
import { useState, useEffect, useRef } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
//importing axios for sending get request
import axios from "axios";
//for sending toast notifications to the user
import { toast } from "sonner";
import styles from "../../styles/FeedPage.module.css";
import { useNavigate } from "react-router-dom";
//js-cookie library makes it easy to retrieve or set cokies from the frontend for the user
import Cookies from "js-cookie";

//main component function which will first send a get request and show the posts in the ui and when a user click to read more a auth will take pplace and will send the user to login or will send to the post information page
const FeedPage = () => {
  const navigate = useNavigate(); //declaring useVavigate as navigate

  //use state variable for setting the data
  const [postdata, setPostData] = useState([]);

  //marking the has fetched data as false
  const hasFetchedPostData = useRef(false);

  //max length after which the character of post body will be "..."
  const maxLength = 70;

  //function to shorten the text of posts recieved from the get request
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    } else {
      return text;
    }
  };

  //function to check if a user clicking read more is authenticated or not, if not will call a modal and ask user to login
  const CheckAuthReadMore = (id) => {
    //check if the user has a cookie called token in their localstorage
    const CheckCookieExists = Cookies.get("token");

    //if user has no cookie will call the modal
    if (!CheckCookieExists) {
      return document.getElementById("nocookieexistsmodalbutton").click();
    }

    //if the user has the cookie forward the user to this url
    navigate(`/postinfo/:${id}`);
  };

  //this button is used to closs the modal when the user clicks on the login button
  const LoginButtonModal = () => {
    //closses the modal button
    document.getElementById("nocookieexistsmodalbutton").click();

    //after modal is clossed now navigate the user to login
    navigate("/login");
  };

  //use effect function takes a function as a parameter which is called when the ui is mounted
  useEffect(() => {
    //async await function for fetching the posts from the server using axios and then setting the data in a usestate variable
    const FetchPosts = async () => {
      //using try catch block for this function for better readability and maintainibilty of code
      try {
        const res = await axios.get("http://localhost:5000/post/getposts");

        //get access to the data from the axios get request
        const data = res.data;

        //declare the data as the value of use state variable data
        setPostData(data);

        //using the useRef current which is the same as initialized untill changes
        if (!hasFetchedPostData.current) {
          //send a toast notification that users has been successfuly fetched
          toast.success("Users has been fetched.");
          hasFetchedPostData.current = true; // set the ref to true after first fetch
        }
      } catch (error) {
        //basic error handling in case of error
        console.error(error);
        //using the useRef current which is the same as initialized untill changes
        if (!hasFetchedPostData.current) {
          //send a toast notification that users hasn't fetched
          toast.error("Error fetching posts.");
          hasFetchedPostData.current = true; // set the ref to true after first fetch
        }
      }
    };

    FetchPosts(); //calling the function
  }, []);

  return (
    <>
      <NavBar />
      <div className={styles.PostsBody}>
        {/* if the data recieved has no posts */}
        {postdata.length === 0 ? (
          <h1 className={styles.nopostfound}>No blog posts in database.</h1>
        ) : (
          // seperate the data and display them on the ui
          postdata.map((post) => (
            <div
              className="card"
              id={styles.card}
              key={post.post_id}
              style={{ width: "20rem", height: "30rem" }}
            >
              <img
                src={post.post_image}
                className="card-img-top"
                id={styles.image}
                alt="Image of blog post"
              />
              <small className="text-muted">{post.created_at}</small>
              <div className="card-body">
                <h5 className="card-title">{post.post_title}</h5>
                <p className="card-text">
                  {truncateText(post.post_body, maxLength)}
                </p>
                <button
                  onClick={() => CheckAuthReadMore(post.post_id)}
                  className="btn btn-primary"
                >
                  Read More
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
      <>
        {/* the modal which will be called when the user has no cookie*/}
        <button
          id="nocookieexistsmodalbutton"
          type="button"
          className={styles.nocookieexistsmodalbutton}
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
                  Login to view the blog post.
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <h6>
                  For security and privacy, we require all users to log in to
                  view a blog post. This helps protect your personal data and
                  ensures a safer experience for everyone. Thank you for your
                  understanding.
                </h6>
              </div>
              <div className="modal-footer">
                <button
                  id="tologinclosemodal"
                  type="button"
                  className="btn btn-success"
                  onClick={LoginButtonModal}
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

//exporting the feed page functional componenet
export default FeedPage;
