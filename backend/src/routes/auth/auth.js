const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.JWT_SECRET;

// POST /auth/register
router.post('/register', async (req, res) => {
  const { email, name, firstname, password } = req.body;

  console.log('Requête reçue :', req.body);

  if (!email || !name || !firstname || !password) {
    return res.status(400).json({ msg: 'Bad parameter' });
  }

  try {
    const [existing] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ msg: 'Account already exists' }); 
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
    'INSERT INTO user (email, name, firstname, password) VALUES (?, ?, ?, ?)',
    [email, name, firstname, hashedPassword]
    );


    console.log('Utilisateur inséré, ID :', result.insertId);

    // Génération du token après inscription
    const token = jwt.sign({ userId: result.insertId, email }, SECRET, { expiresIn: '1h' });

    res.status(201).json({ token }); // renvoie le token
  } catch (err) {
    console.error('Erreur dans /register :', err); 
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Tentative de login :', req.body); 

  if (!email || !password) {
    return res.status(400).json({ msg: 'Bad parameter' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ msg: 'Invalid Credentials' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid Credentials' });
    }

    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Erreur dans /login :', err); 
    res.status(500).json({ msg: 'Internal server error' });
  }
});

module.exports = router;