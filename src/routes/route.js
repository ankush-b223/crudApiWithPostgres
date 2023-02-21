
const { Router } = require("express");
const express = require("express");

const router = express.Router();

//connecting with db layer
const db = require("../databases/queries");

//req to get all users 
router.get("/",db.getUsers);

//req to get a user by reference id
router.get("/:id",db.getUserById);

//req to create a user 
router.post("/",db.createUser);

//request to (entirely) update a user -> put method
router.put("/:id",db.updateUser);

//request to delete a user
router.delete("/:id",db.deleteUser);

//implement a patch method 


//exproting
module.exports = router;