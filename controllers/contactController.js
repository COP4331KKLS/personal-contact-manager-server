exports.authenticate_user = function(req, res, next) {
	if (!req.headers.authorization) {
		return res.status(403).json({error: 'No credentials sent.'});
	}
	next();
};

exports.contacts_list = function(req, res) {
	res.send('NOT IMPLEMENTED: Contact list');
};

exports.contact_create = function(req, res) {
	res.send('NOT IMPLEMENTED: Contact create');
};

exports.contact_delete = function(req, res) {
	res.send('NOT IMPLEEMENTED: Contact delete');
};
