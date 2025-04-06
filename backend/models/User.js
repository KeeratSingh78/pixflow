// backend/models/User.js
const admin = require("firebase-admin");

const db = admin.firestore();
const User = db.collection("users");

module.exports = User;