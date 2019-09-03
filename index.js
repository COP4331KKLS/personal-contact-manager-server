// middleware
const cors = require('cors');
const monk = require('monk');
const express = require('express');
const WordFilter = require('bad-words');

// local modules
const user = require('./modules/user');
const controllerRouter = require('./routes/contacts');

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
app.use('/contacts', controllerRouter);	

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

// start application
app.listen(listeningPort, () => {
  console.log(`Listening on port ${listeningPort}`);
  console.log(`Database is set to port ${databasePort}`);
});
