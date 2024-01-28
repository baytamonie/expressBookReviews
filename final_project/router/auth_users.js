const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { 
  const found = users.filter(user => {
    user.username === username;
  })
  if(found.length > 0){
    return false;
  }
  return true;
}

const authenticatedUser = (username,password)=>{  
   const found = users.filter(user => {
   user.username === username && user.password === password;
})
  if(found.length > 0){
  return true;
}
  return false;
}
//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body
  if(!username || !password){
    return res.status(404).json({message: "Error logging in"});
  }
  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
    };
    return res.status(200).send("User successfully logged in");
    } 
  return res.status(208).json({message: "Invalid Login. Check username and password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
