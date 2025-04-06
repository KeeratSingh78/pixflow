const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username,
    });
    const token = jwt.sign({ uid: userRecord.uid }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    res.status(201).json({ token, user: { uid: userRecord.uid, username, email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    const token = jwt.sign({ uid: userRecord.uid }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    res.json({ token, user: { uid: userRecord.uid, username: userRecord.displayName, email } });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

module.exports = router;