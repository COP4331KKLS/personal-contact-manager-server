
const WordFilter = require('bad-words');
const user = require('../controllers/userController');

const filter = new WordFilter();

exports.registerPost = (app, usersCollection) => {

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
  
      result.message = "User registration successful";
      response.cookie('authorization', callbackObject, {maxAge: 1800000});
      response.status(200).json(result);
      return
    });
  });
}

exports.loginPost = (app, usersCollection) => {

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
  
    user.authenticateUser(usersCollection, JSON.stringify(username), JSON.stringify(password), (isSuccessful, callbackObject) => {
      if(!isSuccessful) {
        result.error = callbackObject
        response.status(401).json(result);
        return
      }
  
      result.message = "User login successful";
      response.cookie('authorization', callbackObject, {maxAge: 1800000});
      response.status(200).json(result);
      return;
    })
  });
}

exports.logoutPost = (app) => {
  app.post('/logout', (request,response) => {
    response.clearCookie('authorization');
    response.status(200).send('User logout successful');
  })
}

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