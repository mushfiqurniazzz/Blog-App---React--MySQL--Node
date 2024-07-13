import { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import axios from "axios";
import { toast } from "sonner";
import styles from "../../styles/FeedPage.module.css";
import { Link, useNavigate } from "react-router-dom";

const FeedPage = () => {
  const navigate = useNavigate();

  //use state variable for setting the data
  const [postdata, setPostData] = useState([]);

  const maxLength = 70;

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    } else {
      return text;
    }
  };

  //function to check if a user clicking read more is authenticated or not
  const CheckAuthReadMore = (id) => {
    //check if the user has a cookie called token in their localstorage
    const CheckCookieExists = localStorage.getItem("token");

    if (!CheckCookieExists) {
      return document.getElementById("nocookieexistsmodalbutton").click();
    }

    navigate(`/postinfo/:${id}`);
  };

  const LoginButtonModal = () => {
    document.getElementById("nocookieexistsmodalbutton").click();

    navigate("/login");
  };

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

        //send a toast notification that users has been successfuly fetched
        toast.success("Users has been fetched.");
      } catch (error) {
        console.error(error);
        toast.error("Error fetching posts.");
      }
    };

    FetchPosts();
  }, []);

  return (
    <>
      <NavBar />
      <div className={styles.PostsBody}>
        {postdata.length === 0 ? (
          <h1>No blog posts in database.</h1>
        ) : (
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
                alt="Image ofog blog post"
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
                <h7>
                  For security and privacy, we require all users to log in to
                  view a blog post. This helps protect your personal data and
                  ensures a safer experience for everyone. Thank you for your
                  understanding.
                </h7>
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

export default FeedPage;
