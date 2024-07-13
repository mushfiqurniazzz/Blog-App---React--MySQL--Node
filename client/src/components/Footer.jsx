import React from "react";
import styles from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <>
      <footer>
        <div className={styles.footercontainer}>
          <p>&copy; 2024 Blog App. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
