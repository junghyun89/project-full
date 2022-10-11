const express = require('express');

const router = express.Router();
const URL = 'http://localhost:8002/v2';

const request = async (req, api) => {
  try {
    if (!req.session.jwt) {
      const response = await fetch(`${URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          origin: 'http://localhost:4000',
        },
        body: JSON.stringify({ clientSecret: process.env.CLIENT_SECRET }),
      });
      const tokenResult = await response.json();
      req.session.jwt = tokenResult.token;
    }
    const response = await fetch(`${URL}${api}`, {
      method: 'GET',
      headers: {
        authorization: req.session.jwt,
        origin: 'http://localhost:4000',
      },
    });
    const result = await response.json();
    if (result.code !== 200) {
      if (result.code === 419) {
        const err = new Error(`${result.message}`);
        err.name = 'ExpiredToken';
        throw err;
      } else {
        const err = new Error(`${result.message}`);
        err.name = `${result.code}`;
        throw err.message;
      }
    }
    return result;
  } catch (error) {
    if (error.name === 'ExpiredToken') {
      //   // 토큰 만료 시
      delete req.session.jwt;
      return request(req, api);
    }
    return { error };
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

router.get('/followers', async (req, res, next) => {
  try {
    const result = await request(req, '/followers/my');
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/followings', async (req, res, next) => {
  try {
    const result = await request(req, '/followings/my');
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
