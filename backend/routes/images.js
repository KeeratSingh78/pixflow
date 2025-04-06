const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const auth = require('../middleware/auth');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Keerat78@',
  database: 'pixflow_db'
});

const uploadImage = async (fileBuffer, filename, storage) => {
  const storageRef = ref(storage, `images/${filename}`);
  const snapshot = await uploadBytes(storageRef, fileBuffer);
  return getDownloadURL(snapshot.ref);
};

router.post('/', auth, async (req, res) => {
  console.log('Request body:', req.body); // Debug log
  console.log('Request files:', req.file); // Debug log

  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const filename = `${Date.now()}_${req.user.userId}.jpg`;
    const url = await uploadImage(file.buffer, filename, req.app.locals.storage);

    db.query(
      'INSERT INTO images (user_id, url) VALUES (?, ?)',
      [req.user.userId, url],
      (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(400).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, url });
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;