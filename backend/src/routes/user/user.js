const express = require('express');

// .Router -> Mini-serveur, il sert à regrouper les routes par thème   
const router = express.Router();

//
const db = require('../../config/db');

//
const auth = require('../../middleware/auth');

// GET /user — infos du user connecté
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, email, password, created_at, firstname, name, successes FROM user WHERE id = ?',
      [req.user.userId]
    );
    if (rows.length === 0) return res.status(404).json({ msg: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// GET /user/todos — todos du user connecté
router.get('/todos', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, title, description, created_at, due_time, user_id, status FROM todo WHERE user_id = ?',
      [req.user.userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

module.exports = router;
