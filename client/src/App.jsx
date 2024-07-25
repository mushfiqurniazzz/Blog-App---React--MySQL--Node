//importing toaster from sonner to configure the toast notfications, BrowserRouter, Route, Routes from react router dom to create navigation between pages and the pages to be showen to the user on a specific page
import { Toaster } from "sonner";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/authpages/SignUpPage";
import LoginPage from "./pages/authpages/LoginPage";
import CreatePost from "./pages/postpages/CreatePost";
import FeedPage from "./pages/postpages/FeedPage";
import PostInfoPage from "./pages/postpages/PostInfoPage";
import About from "./pages/About";
import FourOFourPage from "./pages/FourOFourPage";
import FamousAuthors from "./pages/userpages/FamousAuthors";
import UserProfile from "./pages/userpages/UserProfile";
import LogoutConfirm from "./pages/userpages/LogoutConfirm";
import DeleteUser from "./pages/userpages/DeleteUser";
import UpdateUser from "./pages/userpages/UpdateUser";
import ChangePassword from "./pages/userpages/ChangePassword";

//app componenet function which will hold routing of the client side, toast notification configuration
const App = () => {
  return (
    <>
      <BrowserRouter>
        <Toaster duration={2000} position="top-center" richColors closeButton />
        <Routes>
          {/* auth pages */}
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* post pages */}
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/" element={<FeedPage />} />
          <Route path="/postinfo/:id" element={<PostInfoPage />} />
          {/* user pages */}
          <Route path="/famousauthors" element={<FamousAuthors />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/logout" element={<LogoutConfirm />} />
          <Route path="/deleteuser" element={<DeleteUser />} />
          <Route path="/updateuser" element={<UpdateUser />} />
          <Route path="/changeuserpassword" element={<ChangePassword/>}/>

          {/* others */}
          <Route path="/about" element={<About />} />
          <Route path="*" element={<FourOFourPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

//exporting the app controller function to main.jsx which will manipulate the dom using this componenets router configuaration
export default App;
