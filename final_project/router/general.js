const express = require('express');
const axios = require('axios'); // أضفنا هذه المكتبة لأنها مطلوبة
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// 1. دالة تسجيل مستخدم جديد (مطلوبة في مشاريع أخرى)
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// 2. دالة جلب كل الكتب (Get all books) - مطلوبة للسؤال 11
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).json({error: "Error fetching all books"});
  }
});

// 3. دالة جلب الكتب حسب ISBN (Get book details based on ISBN) - مطلوبة للسؤال 11
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    if (response.data) {
      res.send(JSON.stringify(response.data, null, 4));
    } else {
      res.status(404).json({message: "Book not found"});
    }
  } catch (error) {
    res.status(404).json({message: "Book not found"});
  }
});
  
// 4. دالة جلب الكتب حسب المؤلف (Get book details based on author) - مطلوبة للسؤال 11
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
    const booksFound = response.data.books;
    if (booksFound && Object.keys(booksFound).length > 0) {
      res.send(JSON.stringify({books: booksFound}, null, 4));
    } else {
      res.status(404).json({message: "No books found for this author"});
    }
  } catch (error) {
    res.status(500).json({error: "Error fetching books by author"});
  }
});

// 5. دالة جلب الكتب حسب العنوان (Get all books based on title) - مطلوبة للسؤال 11
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    const booksFound = response.data.books;
    if (booksFound && Object.keys(booksFound).length > 0) {
      res.send(JSON.stringify({books: booksFound}, null, 4));
    } else {
      res.status(404).json({message: "No books found with this title"});
    }
  } catch (error) {
    res.status(500).json({error: "Error fetching books by title"});
  }
});

// 6. دالة جلب المراجعات (Get book review)
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
