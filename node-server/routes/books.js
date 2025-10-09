
const express = require('express');
const router = express.Router();

// Menggunakan array sebagai penyimpanan data sementara [cite: 142]
let books = [
  { id: 1, title: 'Book 1', author: 'Author 1' },
  { id: 2, title: 'Book 2', author: 'Author 2' }
];
let nextId = 3;

// READ: Mendapatkan semua buku (GET /api/books)
router.get('/', (req, res) => {
  res.json(books);
});

// READ: Mendapatkan buku berdasarkan ID (GET /api/books/:id)
router.get('/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
});

// CREATE: Menambahkan buku baru (POST /api/books)
router.post('/', (req, res) => {
  const { title, author } = req.body;

  // Validasi input
  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }

  const newBook = {
    id: nextId++,
    title,
    author
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

// UPDATE: Memperbarui buku berdasarkan ID (PUT /api/books/:id)
router.put('/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: 'Book not found' });

  const { title, author } = req.body;

  // Validasi input
  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }

  book.title = title;
  book.author = author;
  res.json(book);
});

// DELETE: Menghapus buku berdasarkan ID (DELETE /api/books/:id)
router.delete('/:id', (req, res) => {
  const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
  if (bookIndex === -1) return res.status(404).json({ message: 'Book not found' });

  const deletedBook = books.splice(bookIndex, 1);
  res.json({ message: 'Book deleted successfully', book: deletedBook[0] });
});

module.exports = router;