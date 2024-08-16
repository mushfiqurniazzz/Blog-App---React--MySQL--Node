//importing useRef, useEffect, useState for rendering the toast notification once as use effect loads when the apps in mounted and renders the toast notification twice and use state for using state variables
import { useRef, useEffect, useState } from "react";
//axios for sending HTTP requests to the server
import axios from "axios";
//for rendering toast notification
import { toast } from "sonner";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import styles from "../../styles/FamousAuthors.module.css";

//famous author function componenet which sends a get request to the server then renders the top users with most blog posts
const FamousAuthors = () => {
  //fetched data state variables
  const [topusersdata, setTopusersdata] = useState([]);

  //marking the has fetched data as false
  const hasFetchedtopusersdata = useRef(false);

  //use effect hook which calls the function when the app is mounted
  useEffect(() => {
    //async await fetch data function with axios
    const Fetchtopusersdata = async () => {
      //try catch blocks for better code readability and maintainibilty
      try {
        //sending a get request using axios
        const res = await axios.get("http://localhost:5000/user");

        //saving the res data in a variable
        const topusersfetcheddata = res.data;

        //console logging the data
        console.log(topusersfetcheddata);

        if (!hasFetchedtopusersdata.current) {
          //render a toast success message
          toast.success("Users fetched successfuly");
          hasFetchedtopusersdata.current = true;
        }

        //set the use state variable
        setTopusersdata(topusersfetcheddata);
      } catch (error) {
        if (!hasFetchedtopusersdata.current) {
          //render a toast error message
          toast.error("Something went wrong");
          hasFetchedtopusersdata.current = true;
        }
        console.log(error);
      }
    };
    Fetchtopusersdata();
  }, []);
  return (
    <>
      <NavBar />
      <div className="card" id={styles.parentcard}>
        {/* if the data recieved has no posts */}
        {topusersdata.length === 0 ? (
          <div className={styles.nopostfoundbody}>
            <h1 className={styles.nopostfound}>No users found in database.</h1>
          </div>
        ) : (
          // seperate the data and display them on the ui
          topusersdata.map((topusers) => (
            <div
              className="card"
              id={styles.card}
              key={topusers.id}
              style={{ width: "20rem", height: "12rem" }}
            >
              <div className="card-body">
                <h5 className="card-title">Id: {topusers.id}</h5>
                <hr />
                <h5 className="card-title">Username: {topusers.username}</h5>
                <hr />
                <h5 className="card-title">
                  Total posts: {topusers.totalposts}
                </h5>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </>
  );
};

export default FamousAuthors;
