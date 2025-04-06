// backend/models/Image.js
const admin = require("firebase-admin");

const db = admin.firestore();
const Image = db.collection("images");

module.exports = Image;