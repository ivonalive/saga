const express = require('express');
const pool = require('../modules/pool');

const router = express.Router();

// return all favorite images
router.get('/', (req, res) => {
  const queryText = `
    SELECT f.id, f.url, f.title, array_agg(c.name) as categories
    FROM favorites f
    LEFT JOIN favorite_categories fc ON f.id = fc.favorite_id
    LEFT JOIN categories c ON fc.category_id = c.id
    GROUP BY f.id;
  `;
  pool.query(queryText)
    .then((result) => {
      res.send(result.rows);
    })
    .catch((error) => {
      console.error('Error fetching favorites', error);
      res.sendStatus(500);
    });
});

// add a new favorite
router.post('/', (req, res) => {
  const { url, title, category_ids } = req.body;
  const queryText = `
    INSERT INTO favorites (url, title)
    VALUES ($1, $2)
    RETURNING id;
  `;
  const queryValues = [url, title];

  pool.query(queryText, queryValues)
    .then((result) => {
      const favoriteId = result.rows[0].id;
      const categoryInsertPromises = category_ids.map(category_id => {
        const categoryQuery = `
          INSERT INTO favorite_categories (favorite_id, category_id)
          VALUES ($1, $2);
        `;
        return pool.query(categoryQuery, [favoriteId, category_id]);
      });
      return Promise.all(categoryInsertPromises);
    })
    .then(() => {
      res.sendStatus(201);
    })
    .catch((error) => {
      console.error('Error adding favorite', error);
      res.sendStatus(500);
    });
});

// update a favorite's associated category
router.put('/:id', (req, res) => {
  const { category_ids } = req.body;
  const deleteQuery = `
    DELETE FROM favorite_categories WHERE favorite_id = $1;
  `;
  const insertQuery = `
    INSERT INTO favorite_categories (favorite_id, category_id)
    VALUES ($1, $2);
  `;

  pool.query(deleteQuery, [req.params.id])
    .then(() => {
      const categoryInsertPromises = category_ids.map(category_id => {
        return pool.query(insertQuery, [req.params.id, category_id]);
      });
      return Promise.all(categoryInsertPromises);
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error updating favorite categories', error);
      res.sendStatus(500);
    });
});

// delete a favorite
router.delete('/:id', (req, res) => {
  const deleteFavoriteCategories = `
    DELETE FROM favorite_categories
    WHERE favorite_id = $1;
  `;
  const deleteFavorite = `
    DELETE FROM favorites
    WHERE id = $1;
  `;

  pool.query(deleteFavoriteCategories, [req.params.id])
    .then(() => pool.query(deleteFavorite, [req.params.id]))
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error deleting favorite', error);
      res.sendStatus(500);
    });
});

module.exports = router;