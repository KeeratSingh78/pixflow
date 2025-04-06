// backend/routes/users.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const auth = require('../middleware/auth');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Keerat78@',
  database: 'pixflow_db'
});

router.get('/:id', auth, (req, res) => {
  db.query(
    'SELECT id, username, email FROM users WHERE id = ?',
    [req.params.id],
    (err, userResults) => {
      if (err || userResults.length === 0) return res.status(404).json({ error: 'User not found' });
      const user = userResults[0];
      db.query(
        'SELECT * FROM images WHERE user_id = ?',
        [req.params.id],
        (err2, imageResults) => {
          if (err2) return res.status(400).json({ error: err2.message });
          res.json({ user, images: imageResults });
        }
      );
    }
  );
});

router.put('/profile', auth, (req, res) => {
  const { username } = req.body;
  db.query(
    'UPDATE users SET username = ? WHERE id = ?',
    [username, req.user.userId],
    (err, result) => {
      if (err || result.affectedRows === 0) return res.status(400).json({ error: err?.message || 'Update failed' });
      res.json({ id: req.user.userId, username });
    }
  );
});

module.exports = router;