const monk = require('monk');

exports.authenticate_user = function(req, res, next) {

	if (!req.headers.authorization) {
		return res.status(403).json({error: 'No credentials sent.'});
	}
	
	next();
};

// Get all contacts
exports.contacts_list = function(req, res) {
	const db = req.database;
	const collection = db.get('users');
	
	collection.findOne({_id: monk.id(req.headers.authorization)}, function(err, obj) {
		res.json(obj != null ? obj.contacts : 'null');
	});
};

// Search for a contact
exports.contact_search = function(req, res) {
	const searchString = req.query.searchstring;
	const regex = RegExp(".*" + searchString + ".*");
	const db = req.database;
	const collection = db.get('users');
	console.log(searchString);
	collection.aggregate([
		{$match: {_id: monk.id(req.headers.authorization)}},
		{$unwind: "$contacts"},
		{$project: {_id: 0, username: 0, password: 0}},
		{$match: 	
			{$or: [
				{'contacts.phoneNumber':regex},
				{'contacts.firstName':regex},
				{'contacts.lastName':regex},
				{'contacts.address':regex},
				{'contacts.company':regex},
				{'contacts.email':regex} ]
			}
		}], function(err, obj) {
		
		res.json(obj)}
	);
};

// Edit contact
exports.contact_edit = function(req, res) {
	const db = req.database;
	const collection = db.get('users');
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const phoneNumber = req.body.phoneNumber;
	const email = req.body.email;
	const address = req.body.address;
	const company = req.body.company;
	
	const editFirstName = req.body.editFirstName;
	const editLastName = req.body.editLastName;
	const editPhoneNumber = req.body.editPhoneNumber;
	const editEmail = req.body.editEmail;
	const editAddress = req.body.editAddress;
	const editCompany = req.body.editCompany;
	console.log(phoneNumber);
	console.log(editPhoneNumber);
	collection.update(
		{_id: monk.id(req.headers.authorization),
			contacts: {$elemMatch: {firstName: firstName, 
				lastName: lastName, 
				email: email, 
				address: address, 
				company: company, 
				phoneNumber: phoneNumber}}},
		{
			$set: {"contacts.$.firstName": editFirstName, 
				"contacts.$.lastName": editLastName, 
				"contacts.$.email": editEmail, 
				"contacts.$.address": editAddress, 
				"contacts.$.company": editCompany,
				"contacts.$.phoneNumber": editPhoneNumber
			}
		}, function (err, result) {
				res.send(
					(err === null) ? {msg: ''} : {msg: err}
				);
		});
};


// Add contact
exports.contact_create = function(req, res) {
	const db = req.database;
	const collection = db.get('users');
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const phoneNumber = req.body.phoneNumber;
	const email = req.body.email;
	const address = req.body.address;
	const company = req.body.company;
	collection.update(
		{_id: monk.id(req.headers.authorization)},
		{
			$push: {
				contacts: {
					firstName: firstName, 
					lastName: lastName, 
					phoneNumber: phoneNumber, 
					email: email,
					address: address,
					company: company
				}
			}
		}, function (err, result) {
			res.send(
      			(err === null) ? { msg: '' } : { msg: err }
    		);
		});
};

// Delete contact
exports.contact_delete = function(req, res) {
	const db = req.database;
	const collection = db.get('users');
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const phoneNumber = req.body.phoneNumber;
	const email = req.body.email;
	const address = req.body.address;
	const company = req.body.company;
	console.log(firstName);
	collection.update(
		{_id: monk.id(req.headers.authorization)},
		{		
			$pull: {
				contacts: {
					firstName: firstName, 
					lastName: lastName, 
					phoneNumber: phoneNumber, 
					email: email,
					address: address,
					company: company
				}
			}
		}, function (err, result) {
			res.send(
				(err === null) ? { msg: '' } : { msg: err }
			);
		});
};
