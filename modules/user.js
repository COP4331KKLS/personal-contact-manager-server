
const { sha256 } = require('crypto-hash');

let collection = null;

const addUserAndPassword = (username, password, callback) => {
  
  const newUser = {
    'username': username,
    'password': password
  }

  collection.findOne({'username': username}).then( result => {
    if(result != null) {
      callback(false, 'Username is taken')
    } else {
      collection.bulkWrite([
        { insertOne: { document: newUser }}
      ]).then(
        writeResults => callback(true, writeResults.insertedIds[0]),
        error => callback(false, `Internal Server Error ${error}`)
      )
    }
  });
}

const findUser = (username, password, callback) => {

  const userDetails = {
    'username': username,
    'password': password
  }

  collection.findOne({userDetails}).then(
    result => { 
      console.log(result);
      callback(result == null ? false : true);
    },
    error => callback(false)
  );
}

// export main functions used in routes
exports.registerUser = (userCollection, username, password, callback) => {
  collection = userCollection;

  sha256(password).then(
    result => addUserAndPassword(username, result, callback),
    error => callback(false, `Internal Server Error ${error}`)
  );
}

exports.authenticateUser = (userCollection, username, password, callback) => {
  collection = userCollection;

  sha256(password).then(
    result => findUser(username, result, callback),
    error => callback(false)
  );
}