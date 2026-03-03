const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
// GET /users — liste de tous les utilisateurs
// router.get('/', auth, async (req, res) => {
//   try {
//     const [rows] = await db.query(
//       'SELECT id, email, created_at, firstname, name, successes FROM user'
//     );
//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ msg: 'Internal server error' });
//   }
// });
// GET /users/id/:id — récupérer un user spécifique par ID
router.get('/id/:id', auth, async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ msg: 'Bad parameter' });

  try {
    const [rows] = await db.query(
      'SELECT id, email, created_at, firstname, name, successes FROM user WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ msg: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// GET /users/email/:email — récupérer un user spécifique par email
router.get('/email/:email', auth, async (req, res) => {
  const { email } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT id, email, created_at, firstname, name, successes FROM user WHERE email = ?',
      [email]
    );
    if (rows.length === 0) return res.status(404).json({ msg: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// PUT /users/:id — mettre à jour un utilisateur (restriction: uniquement soi-même)
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { email, name, firstname, password } = req.body;

  if (isNaN(id) || !email || !name || !firstname || !password) {
    return res.status(400).json({ msg: 'Bad parameter' });
  }

  if (parseInt(id, 10) !== req.user.userId) {
    return res.status(403).json({ msg: 'Forbidden: you can only update your own account' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'UPDATE user SET email=?, name=?, firstname=?, password=? WHERE id=?',
      [email, name, firstname, hashedPassword, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ msg: 'Not found' });

    const [rows] = await db.query(
      'SELECT id, email, created_at, firstname, name, successes FROM user WHERE id = ?',
      [id]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// DELETE /users/:id — supprimer un utilisateur (restriction: uniquement soi-même)
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ msg: 'Bad parameter' });

  if (parseInt(id, 10) !== req.user.userId) {
    return res.status(403).json({ msg: 'Forbidden: you can only delete your own account' });
  }

  try {
    const [result] = await db.query('DELETE FROM user WHERE id=?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ msg: 'Not found' });

    res.json({ msg: `Successfully deleted record number : ${id}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

module.exports = router;
