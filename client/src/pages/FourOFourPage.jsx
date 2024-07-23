import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import styles from "../styles/FourOFourPage.module.css"

const FourOFourPage = () => {
  return (
    <>
      <NavBar />
      <div className={styles.parentdiv}>
        <h1>
          This URL doesn&apos;t exist, click here to return to the home page.
        </h1>
        <Link id={styles.button} to={"/"} type="button" className="btn btn-primary">
          Click Here
        </Link>
      </div>

      <Footer />
    </>
  );
};

export default FourOFourPage;
