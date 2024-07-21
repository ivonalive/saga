const express = require('express');
const app = express();
const favoriteRouter = require('./routes/favorite.router');
const categoryRouter = require('./routes/category.router');
const searchRouter = require('./routes/search.router');
require('dotenv').config();

const PORT = process.env.PORT || 5001;
const GIPHY_API_KEY = process.env.GIPHY_API_KEY;

/** ---------- MIDDLEWARE ---------- **/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('build'));

/** ---------- EXPRESS ROUTES ---------- **/
app.use('/api/favorites', favoriteRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/search', (req, res, next) => {
  req.giphyApiKey = GIPHY_API_KEY;
  next();
}, searchRouter);

/** ---------- START SERVER ---------- **/
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
