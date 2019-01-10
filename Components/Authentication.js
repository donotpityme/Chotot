const GoogleAuthentication = require('@authentication/google');
const express = require('express');

const app = express();

const googleAuthentication = new GoogleAuthentication({
  callbackURL: '/__/auth/google'
});

app.get('/', (req, res, next) => {
  res.send(
    `<form action=${
      googleAuthentication.callbackPath
    } method="post"><button type="submit">Login</button></form>`
  );
});

app.post(googleAuthentication.callbackPath, async (req, res, next) => {
  googleAuthentication.redirectToProvider(req, res, next, {
    state: {message: 'Hello world'}
  });
});
app.get(googleAuthentication.callbackPath, async (req, res, next) => {
  try {
    if (googleAuthentication.userCancelledLogin(req)) {
      return res.redirect('/');
    }
    const {
      accessToken, 
      refreshToken,
      profile,
      state // => {message: 'Hello world'}
    } = await googleAuthentication.completeAuthentication(req, res);
    res.json(profile);
  } catch (ex) {
    next(ex);
  }
});

app.listen(3000);