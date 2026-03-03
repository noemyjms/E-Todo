const express = require('express');
const router = express.Router();
const db = require('../../config/db');
const auth = require('../../middleware/auth');

const validStatuses = ['not started', 'todo', 'in progress', 'done'];

// Fonction pour ajouter un succès permanent
async function addSuccess(userId, successKey) {
  await db.query(
    `UPDATE user 
     SET successes = CASE 
       WHEN successes IS NULL THEN JSON_ARRAY(?) 
       WHEN JSON_CONTAINS(successes, JSON_QUOTE(?)) = 0 THEN JSON_ARRAY_APPEND(successes, "$", ?)
       ELSE successes
     END
     WHERE id=?`,
    [successKey, successKey, successKey, userId]
  );
}

// Route = Adresse (URL) qui correspond à une action précise 
// Métaphore : Quand on prend tel chemin, tel action s'enclenche comme en JDR 
// Métaphore : C'est notre boite à outils, nos fonctions natives qu'on crée nous mêmes 

// GET /todos
// But : Récupère toutes les tâches 
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, title, description, created_at, due_time, user_id, status FROM todo'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// POST /todos
// But : Crée une tâche 
router.post('/', auth, async (req, res) => {
  const { title, description, due_time, status } = req.body;
  if (!title || !description || !due_time) {
    return res.status(400).json({ msg: 'Bad parameter' });
  }

  const finalStatus = validStatuses.includes(status) ? status : 'not started';

  try {
    const [result] = await db.query(
      'INSERT INTO todo (title, description, due_time, status, user_id) VALUES (?, ?, ?, ?, ?)',
      [title, description, due_time, finalStatus, req.user.userId]
    );

    const [rows] = await db.query(
      'SELECT id, title, description, created_at, due_time, user_id, status FROM todo WHERE id = ?',
      [result.insertId]
    );

    const todo = rows[0];
    const successMessages = [];

    if (title.toLowerCase().includes('oignon') || description.toLowerCase().includes('oignon')) {
      successMessages.push("Morgane ne t'aime plus !!");
      await addSuccess(req.user.userId, 'oignon');
    }

    const [countRows] = await db.query(
      'SELECT COUNT(*) AS count FROM todo WHERE user_id=? AND status="in progress"',
      [req.user.userId]
    );
    if (countRows[0].count > 10) {
      successMessages.push('Tu es débordé !!'); // message unifié
      await addSuccess(req.user.userId, 'in_progress_over_10');
    }

    if (successMessages.length > 0) {
      todo.success = successMessages;
    }

    res.status(201).json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// PUT /todos/:id
// Modifier une tâche existante
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { title, description, due_time, status } = req.body;
  if (isNaN(id) || !title || !description || !due_time) {
    return res.status(400).json({ msg: 'Bad parameter' });
  }

  const finalStatus = validStatuses.includes(status) ? status : 'not started';

  try {
    const [result] = await db.query(
      'UPDATE todo SET title=?, description=?, due_time=?, status=? WHERE id=? AND user_id=?',
      [title, description, due_time, finalStatus, id, req.user.userId]
    );

    if (result.affectedRows === 0) return res.status(404).json({ msg: 'Not found' });

    const [rows] = await db.query(
      'SELECT id, title, description, created_at, due_time, user_id, status FROM todo WHERE id = ?',
      [id]
    );

    const todo = rows[0];
    const successMessages = [];

    if (title.toLowerCase().includes('oignon') || description.toLowerCase().includes('oignon')) {
      successMessages.push("Morgane ne t'aime plus !!");
      await addSuccess(req.user.userId, 'oignon');
    }

    const [countRows] = await db.query(
      'SELECT COUNT(*) AS count FROM todo WHERE user_id=? AND status="in progress"',
      [req.user.userId]
    );
    if (countRows[0].count > 10) {
      successMessages.push('Tu es débordé !!'); // message unifié
      await addSuccess(req.user.userId, 'in_progress_over_10');
    }

    if (successMessages.length > 0) {
      todo.success = successMessages;
    }

    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// DELETE /todos/:id
// But : Supprimer une tâche 
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ msg: 'Bad parameter' });

  try {
    const [result] = await db.query(
      'DELETE FROM todo WHERE id=? AND user_id=?',
      [id, req.user.userId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ msg: 'Not found' });

    res.json({ msg: `Successfully deleted record number : ${id}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// GET /todos/:id
// But : Récupère une tâche par son ID -> Pas besoin actuellement 
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ msg: 'Bad parameter' });

  try {
    const [rows] = await db.query(
      'SELECT id, title, description, created_at, due_time, user_id, status FROM todo WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ msg: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

module.exports = router;
