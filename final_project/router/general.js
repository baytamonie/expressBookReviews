const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (username && password){
    if(isValid(username)){
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(401).json({message: "User already exists!"});    
    }
  }
  return res.status(400).json({message: "Unable to register user."});
})

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const { isbn } = req.params;
  if(isbn){
    const book = books[isbn]
    if(book){
     return res.send(JSON.stringify(book,null,4));
    }
    return res.status(404).json({message: "Book not found."});
  }
  return res.status(400).json({message: "Unable to look for book."});

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const { author } = req.params
  if(author){
    const booksByAuthor = []  
    for(index in books){
      if(books[index].author.replaceAll(' ', '').toLowerCase() === author.toLowerCase()){
        booksByAuthor.push(books[index])
      }
    }
    if(booksByAuthor.length > 0){
      return res.send(JSON.stringify(booksByAuthor,null,4));
    }
    return res.status(404).json({message: `No books were found by ${author}`});
  }
  return res.status(400).json({message: "Unable to look for books."});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const { title } = req.params
  if(title){
    const booksWithTitle = []  
    for(index in books){
      if(books[index].title.replaceAll(' ', '').toLowerCase() === title.toLowerCase()){
        booksWithTitle.push(books[index])
      }
    }
    if(booksWithTitle.length > 0){
      return res.send(JSON.stringify(booksWithTitle,null,4));
    }
    return res.status(404).json({message: `No books were found with this title ${title}`});
  }
  return res.status(400).json({message: "Unable to look for books."});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const { isbn } = req.params;
  if(isbn){
    const book = books[isbn]
    if(book && book.review){
     return res.send(JSON.stringify(book.review,null,4));
    }
    return res.status(404).json({message: "Review not found."});
  }
  return res.status(400).json({message: "Unable to look for book."});
});

module.exports.general = public_users;
