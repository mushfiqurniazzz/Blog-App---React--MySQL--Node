import React from "react";
import NavBar from "./components/NavBar";
import "./styles/App.css";
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
import SearchUser from "./pages/userpages/SearchUser";
import UserProfile from "./pages/userpages/UserProfile";
import UpdateUserInfo from "./pages/userpages/UpdateUserInfo";
import DeleteUser from "./pages/userpages/DeleteUser";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Toaster duration={2000} position="top-center" richColors closeButton />
        <NavBar />
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
          <Route path="/searchuser" element={<SearchUser />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/updateuser" element={<UpdateUserInfo />} />
          <Route path="/deleteuser" element={<DeleteUser />} />
          {/* others */}
          <Route path="/about" element={<About />} />
          <Route path="*" element={<FourOFourPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
