
// middleware
const cors = require('cors');
const monk = require('monk');
const express = require('express');
const WordFilter = require('bad-words');

// local modules
const user = require('./modules/user');

// listening ports
const listeningPort = process.env.PORT || 5000;
const databasePort = process.env.MONGODB_URI;

if(databasePort == undefined || databasePort == null) {
  console.log("MONGODB_URI is missing")
  return 1;
} 

const app = express();
const filter = new WordFilter();
const database = monk(databasePort);

// collections
const userCollectionsName = 'users';
const contactsCollectionName = 'contacts';
const usersCollection = database.get(userCollectionsName);
const contactsCollection = database.get(contactsCollectionName);

// setup express app
app.use(cors());
app.use(express.json());
app.enable("trust proxy");

// routes
app.get('/status', (request,response) => {
  response.status(200).json(`Server Live${request.url}: ${Date.now()}`);
});

app.post('/register', (request,response) => {
  
  const username = request.headers.username;
  const password = request.headers.password;

  let result = {
    'error': '',
    'message': ''
  }

  validateUsernameAndPassword(username, password, result);
  if(result.error !== '') {
    response.status(500).json(result);
    return;
  }

  user.registerUser(usersCollection, JSON.stringify(username), JSON.stringify(password), (isSuccessful, callbackObject) => {
    if(!isSuccessful) {
      result.error = callbackObject
      response.status(500).json(result);
      return
    }

    result.message = callbackObject;
    response.status(200).json(result);
    return
  });
});

app.post('/login', (request,response) => {

  const username = request.headers.username;
  const password = request.headers.password;

  let result = {
    'error': '',
    'message': ''
  }

  validateUsernameAndPassword(username, password, result);
  if(result.error !== '') {
    response.status(500).json(result);
    return;
  }

  user.authenticateUser(usersCollection, JSON.stringify(username), JSON.stringify(password), (isSuccessful) => {
    if(!isSuccessful) {
      result.error = 'User not found'
      response.status(401).json(result);
      return
    }

    result.message = 'User authenticated';
    response.status(200).json(result);
    return;
  })
});

// helper functions
const validateUsernameAndPassword = (username, password, result) => {
  if(username == undefined || username == null || password == undefined || password == null ) {
    result.error = 'Invalid Headers'
  } else if (!isWordAppropriate(username)) {
    result.error = 'Username contains inappropriate words'
  }
}

const isWordAppropriate = (input) => {
  return filter.clean(input) == input
}

// start application
app.listen(listeningPort, () => {
  console.log(`Listening on port ${listeningPort}`);
  console.log(`Database is set to port ${databasePort}`);
});