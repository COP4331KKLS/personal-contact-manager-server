const monk = require('monk');

exports.authenticate_user = function(req, res, next) {
	
	if (!req.cookies.authorization) {
		return res.status(403).json({error: 'No credentials sent.'});
	}
	
	next();
};

// Get all contacts
exports.contacts_list = function(req, res) {
	const db = req.database;
	const collection = db.get('users');
	collection.findOne({_id: monk.id(req.cookies.authorization)}, function(err, obj) {
		res.json(obj.contacts);
	});
};

// Search for a contact
exports.contact_search = function(req, res) {
	const searchString = req.query.searchstring;
	const regex = RegExp(".*" + searchString + ".*");
	const db = req.database;
	const collection = db.get('users');
	
	collection.aggregate([
		{$match: {_id: monk.id(req.cookies.authorization)}},
		{$unwind: "$contacts"},
		{$project: {_id: 0, username: 0, password: 0}},
		{$match: 	
			{$or: [
				{'contacts.phoneNumber':regex},
				{'contacts.name':regex},
				{'contacts.email':regex} ]
			}
		}], function(err, obj) {res.json(obj)}
	);
};

// Add contact
exports.contact_create = function(req, res) {
	const db = req.database;
	const collection = db.get('users');
	
	collection.update(
		{_id: monk.id(req.cookies.authorization)},
		{
			$push: {
				contacts: {
					name: req.body.name, phoneNumber: req.body.phoneNumber, email: req.body.email
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
	
	collection.update(
		{_id: monk.id(req.cookies.authorization)},
		{
			$pull: {
				contacts: {
					name: req.body.name, phoneNumber: req.body.phoneNumber, email: req.body.email
				}
			}
		}, function (err, result) {
			res.send(
				(err === null) ? { msg: '' } : { msg: err }
			);
		});
};