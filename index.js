
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
  let username = request.headers.username;
  let password = request.headers.password;

  let result = {
    'error': '',
    'message': ''
  }

  if(username == undefined || username == null || password == undefined || password == null ) {
    result.error = 'Invalid Headers'
    response.status(500).json(result);
    return;
  }

  if(!isWordAppropriate(username)) {
    result.error = 'Username contains inappropriate words'
    response.status(500).json(result);
    return;
  }

  user.registerUser(usersCollection, username, password, (isSuccessful, result) => {
    console.log(isSuccessful)
    console.log(result)
  });

  result.message = 'User has been registered'
  response.status(200).json(result);
});

app.post('/login', (request,response) => {
  response.status(200).json('NOT IMPLEMENTED');
});

// helper functions
const isWordAppropriate = (input) => {
  return filter.clean(input) == input
}

// start application
app.listen(listeningPort, () => {
  console.log(`Listening on port ${listeningPort}`);
  console.log(`Database is set to port ${databasePort}`);
});