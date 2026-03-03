// Serveur 

// Import Express 
const express = require('express');
const app = express();

app.use(express.json());

// Import MySQL2 
const mysql2 = require ('mysql2');

// Import cors 
const cors = require("cors");

app.use(cors({                        // Active le middleware CORS pour toutes les routes
  origin: (origin, callback) => {     // Fonction qui vérifie l’origine du client
    callback(null, true);             // Autorise toutes les origines (dev uniquement)
  },
  credentials: true                  // Autorise l’envoi des cookies / sessions
}));

app.options("*", cors());             // Autorise toutes les requêtes OPTIONS (preflight)

// Charger les variables environnements 
require('dotenv').config();
console.log('DB_USER =', process.env.DB_USER);

// Middleware -> JSON
app.use(express.json());

// Route de test -> test server
app.get('/ping', (req, res) => {
  res.json({ msg: 'pong' });
});

// Routes principales
app.use('/auth', require('./routes/auth/auth'));
app.use('/user', require('./routes/user/user'));
app.use('/todos', require('./routes/todos/todos'));
app.use('/users', require('./routes/users/users'));

// Erreur 404 -> Root Not Found 
app.use((req, res) => {
  res.status(404).json({ error: 'Route introuvable', path: req.url });
});

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API lancée sur http://localhost:${PORT}`);
});

