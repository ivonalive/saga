const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const searchQuery = req.query.q;
    const page = req.query.page || 1;
    const limit = 25;
    const offset = (page - 1) * limit;
    const GIPHY_API_KEY = process.env.GIPHY_API_KEY;

    if (!searchQuery) {
      return res.status(400).send('Missing search query');
    }

    const response = await axios.get('https://api.giphy.com/v1/gifs/search', {
      params: {
        api_key: GIPHY_API_KEY,
        q: searchQuery,
        limit,
        offset
      }
    });

    res.send(response.data.data);
  } catch (error) {
    console.error('Error fetching from Giphy API', error.message);
    res.sendStatus(500);
  }
});

module.exports = router;
