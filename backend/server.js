require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const imageRoutes = require('./routes/images');
const userRoutes = require('./routes/users');
const { initializeApp } = require('firebase/app');
const { getStorage } = require('firebase/storage');
const multer = require('multer');
const admin = require('firebase-admin'); // Import Firebase Admin

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Adjust to your frontend URL
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});
app.use('/api/images', upload.single('image'), imageRoutes);

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Keerat78@',
  database: 'pixflow_db'
});

db.connect((err) => {
  if (err) {
    console.error('MySQL Connection Error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL Database');
});

// Firebase Client SDK Config (for Storage)
const firebaseConfig = {
  apiKey: "AIzaSyDqTPjFLk6QV81M_RarhQZgURW9o4cz59o",
  authDomain: "imageediting-352df.firebaseapp.com",
  projectId: "imageediting-352df",
  storageBucket: "imageediting-352df.appspot.com",
  messagingSenderId: "619949434824",
  appId: "619949434824:web:96f3878e05d4b7a7d782fd"
};

// Initialize Firebase Client SDK
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);
app.locals.storage = storage;
app.locals.db = db;

// Initialize Firebase Admin SDK with service account JSON file
const serviceAccount = require('./imageediting-352df-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://imageediting-352df.firebaseio.com` // Optional, only if using Realtime Database
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('PixFlow API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));