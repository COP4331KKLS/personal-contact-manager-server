// middleware
const cors = require('cors');
const monk = require('monk');
const express = require('express');
const cookieParser = require('cookie-parser');

// local modules
const userRoute = require('./routes/user');
const controllerRouter = require('./routes/contacts');

// listening ports
const listeningPort = process.env.PORT || 5000;
const databasePort = process.env.MONGODB_URI;

if(databasePort == undefined || databasePort == null) {
  console.log("MONGODB_URI is missing")
  return 1;
} 

const app = express();
const database = monk(databasePort);

// collections
const userCollectionsName = 'users';
const usersCollection = database.get(userCollectionsName);

// setup express app
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.enable("trust proxy");

// Make db accessible to router
app.use(function(req, res, next) {
	req.database = database;
	next();
});

// contact routes
app.use('/contacts', controllerRouter);	

// authentication routes
userRoute.registerPost(app, usersCollection);
userRoute.loginPost(app, usersCollection);
userRoute.logoutPost(app);

// start application
app.listen(listeningPort, () => {
  console.log(`Listening on port ${listeningPort}`);
  console.log(`Database is set to port ${databasePort}`);
});