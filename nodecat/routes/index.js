const express = require('express');

const router = express.Router();
const URL = 'http://localhost:8002/v2';

const request = async (req, api) => {
  try {
    if (!req.session.jwt) {
      const response = await fetch(`${URL}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientSecret: process.env.CLIENT_SECRET }),
      });
      const tokenResult = await response.json();
      req.session.jwt = tokenResult.token;
    }
    const response = await fetch(`${URL}${api}`, {
      method: 'GET',
      headers: { authorization: req.session.jwt },
    });
    const result = await response.json();
    if (result.code === 419) {
      // 토큰 만료 시
      delete req.session.jwt;
      return request(req, api);
    }
    return result;
  } catch (error) {
    return error.response;
  }
};

router.get('/mypost', async (req, res, next) => {
  try {
    const result = await request(req, '/posts/my');
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/search/:hashtag', async (req, res, next) => {
  try {
    const result = await request(
      req,
      `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`
    );
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/', (req, res) => {
  res.render('main', { key: process.env.CLIENT_SECRET });
});

module.exports = router;
