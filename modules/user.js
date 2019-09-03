
const { sha256 } = require('crypto-hash');

let collection = null;

// export main functions used in route
exports.registerUser = (userCollection, username, password, callback) => {
  collection = userCollection;

  sha256(password).then(
    result => addUserAndPassword(username, result, callback),
    error => callback(false, `Internal Server Error ${error}`)
  );
}

const addUserAndPassword = (username, password, callback) => {
  
  const newUser = {
    'username': username,
    'password': password
  }

  collection.findOne({'username': username}, 'username').then( result => {
    if(result != null) {
      callback(false, 'Username is taken')
    } else {
      collection.insert(newUser).then( 
        insertedUser => callback(true, insertedUser),
        error => callback(false, `Internal Server Error ${error}`)
      )
    }
  });
}

exports.authenticateUser = (username, password) => {

}