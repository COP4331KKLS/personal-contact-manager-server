
const express = require('express');
const user = require('./modules/user');

const port = process.env.PORT || 5000;

const app = express();

app.get('/status', (request,response) => {
  response.status(200).json(`Server Live: ${Date.now()}`);
});

app.post('/register', (request,response) => {
  user.registerUser('user', '123');
  response.status(200).json('NOT IMPLEMENTED');
});

app.post('/login', (request,response) => {
  response.status(200).json('NOT IMPLEMENTED');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});