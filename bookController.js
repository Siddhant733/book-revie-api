const Book = require('../models/Book');

exports.createBook = async (req, res) => {
  try {
    const book = await Book.create({ ...req.body, userId: req.user });
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ userId: req.user });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, userId: req.user });
    if (!book) return res.status(404).json({ msg: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      req.body,
      { new: true }
    );
    if (!book) return res.status(404).json({ msg: "Book not found or unauthorized" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ _id: req.params.id, userId: req.user });
    if (!book) return res.status(404).json({ msg: "Book not found or unauthorized" });
    res.json({ msg: "Book deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
