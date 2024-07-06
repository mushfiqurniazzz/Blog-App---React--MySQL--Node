//importing express for using the unfciton express Router which is used for creating path and pass a controller function to that route
const express = require("express");
//declaring router
const router = express.Router();

//import the controller functions
const {
  SearchUser,
  GetUsers,
  UpdateUser,
  DeleteUser
} = require("../controllers/UserControllers");

//the SearchUser function will search a user and send a json object to the user
router.post("/:id", SearchUser);

//the GetUsers function will get a list of a few users and then send as a json object back to the user
router.get("/:id", GetUsers);

//the UpdateUser function will update a user and then send a json object to the user about the updated email
router.put("/:id", UpdateUser);

//the DeleteUser function will delete a user and will send a success message indicating the user has been deleted
router.delete("/:id", DeleteUser);

//exporting the created routes to be used in the app.use function in index.js
module.exports = router;
