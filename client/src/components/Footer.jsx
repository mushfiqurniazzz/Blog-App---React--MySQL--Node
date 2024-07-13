import React from "react";
//importing module styles from module.css
import styles from "../styles/Footer.module.css";

//basic arrow functional component footer which will be used in all pages
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

//exporting the footer
export default Footer;
