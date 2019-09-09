exports.authenticate_user = function(req, res, next) {
	if (!req.headers.authorization) {
		return res.status(403).json({error: 'No credentials sent.'});
	}
	next();
};

// Get contacts
exports.contacts_list = function(req, res) {
	const db = req.database;
	const collection = db.get('user-list');
	collection.findOne({_id: req.headers.authorization}, function(err, obj) {
		res.json(obj);
	});
};

// Add contact
exports.contact_create = function(req, res) {
	const db = req.database;
	const collection = db.get('user-list');
	collection.update(
		{_id: req.headers.authorization},
		{
			$push: {
				contacts: {
					name: req.body.name, phoneNumber: req.body.phoneNumber, email: req.body.email
				}
			}
		}
	);
};

// Delete contact
exports.contact_delete = function(req, res) {
	const db = req.database;
	const collection = db.get('user-list');
	collection.update(
		{_id: req.headers.authorization},
		{
			$pull: {
				contacts: {
					name: req.body.name, phoneNumber: req.body.phone-number
				}
			}
		}
	);
};