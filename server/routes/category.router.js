const express = require('express');
const pool = require('../modules/pool');

const router = express.Router();

router.get('/', (req, res) => {
  const queryText = `
    SELECT * FROM "categories"
      ORDER BY "name" ASC;
  `;
  pool.query(queryText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.log(`Error on query ${error}`);
      res.sendStatus(500);
    });
});

router.post('/', (req, res) => {
  const { name } = req.body;
  const queryText = `
    INSERT INTO categories (name)
    VALUES ($1)
    RETURNING *;
  `;
  pool.query(queryText, [name])
    .then((result) => {
      res.status(201).send(result.rows[0]);
    })
    .catch((error) => {
      console.error('Error adding category', error);
      res.sendStatus(500);
    });
});

router.put('/:id', (req, res) => {
  const { name } = req.body;
  const queryText = `
    UPDATE categories
    SET name = $1
    WHERE id = $2;
  `;
  pool.query(queryText, [name, req.params.id])
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error updating category', error);
      res.sendStatus(500);
    });
});

router.delete('/:id', (req, res) => {
  const queryText = `
    DELETE FROM categories
    WHERE id = $1;
  `;
  pool.query(queryText, [req.params.id])
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error deleting category', error);
      res.sendStatus(500);
    });
});

module.exports = router;