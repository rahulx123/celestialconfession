// server.js
const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');
const ejs = require('ejs');
const fs = require("fs");

const app = express();
const db = new sqlite3.Database('confessions.db');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('../styles.css', (req, res) => {
    const cssPath = path.join(__dirname, 'public', 'styles.css');
    fs.readFile(cssPath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error loading CSS file');
        return;
      }
      res.setHeader('Content-Type', 'text/css');
      res.send(data);
    });
  });
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    db.all('SELECT * FROM confessions ORDER BY id DESC LIMIT 10', (err, rows) => {
      if (err) {
        res.status(500).send('Error fetching confessions');
      } else {
        res.render('index', { confessions: rows });
      }
    });
  });

app.post('/confess', (req, res) => {
  const confession = req.body.confession;
  db.run('INSERT INTO confessions (text) VALUES (?)', confession, (err) => {
    if (err) {
      res.status(500).send('Error saving confession');
    } else {
      res.redirect('/');
    }
  });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
