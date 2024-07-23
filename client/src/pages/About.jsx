import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import styles from "../styles/About.module.css";

//about functional component which will render a paraghraph about how i built the application
const About = () => {
  return (
    <>
      <NavBar />
      <div id={styles.cardbody}>
        <div className="card" id={styles.card}>
          <div className="mb-3" id={styles.mb3}>
            <h1>About Us</h1>
            <hr />
            <p>
              Hey everyone that&apos;s reading this page, I am Mushfiqur a JS
              developer. I built this kinda complex and simple blog app using
              react and express. In this blog app all CRUD operations for both
              blog posts and user can be achived. The stack technologies are
              MySQL for storing users in database, react for building the
              frontend, axios for HTTP requests to the backend, react-router-dom
              for dynamically navigating through the pages and finally for the
              backend I built this app on express with some popular libraries
              like bcryptjs for hashing the password before saving it in
              database, jsonwebtoken for sending a token as a cookie. There were
              also some 3rd party applications used during the build of this
              application. They are cloudinary and firebase, I used clouidinary
              to save the images in the cloud and firebase to have gmail
              authentication. Repo of this app:{" "}
              <a
                href="https://github.com/mushfiqurniazzz/blog-App---React--MySQL--Node/tree/main"
                target="_blank"
              >
                Click Here
              </a>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

//exporting the functional componenet
export default About;
