//importing express for using the unfciton express Router which is used for creating path and pass a controller function to that route
const express = require("express");
//declaring router
const router = express.Router();

//import the controller functions
const {
  SearchUser,
  GetUsers,
  UpdateUser,
  ChangePassword,
  DeleteUser,
  UserProfile
} = require("../controllers/UserControllers");

//the SearchUser function will search a user and send a json object to the user
router.post("/:id", SearchUser);

//the UserProfile will look for a cookie then will retieve the id and then will retieve and send the users credentials
router.get("/userprofile", UserProfile);

//the GetUsers function will get a list of a few users and then send as a json object back to the user
router.get("/", GetUsers);

//the UpdateUser function will update a user and then send a json object to the user about the updated email
router.put("/updateuser", UpdateUser);

//the ChangePassword function will update a user's password and will send a success message indicating the user has been deleted
router.put("/changepass", ChangePassword);

//the DeleteUser function will delete a user and will send a success message indicating the user has been deleted
router.delete("/deleteuser", DeleteUser);

//exporting the created routes to be used in the app.use function in index.js
module.exports = router;
