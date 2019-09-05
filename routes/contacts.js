const express = require('express');
const router = express.Router();

const contractsController = require('../controllers/contactController');

// GET request for list of all Contact
router.get('/getContactsList', contactsController.authenticate_user, contactsController.contacts_list);

// POST request for creating Contact
router.post('/addContact', contactsController.authenticate_user, contactsController.contact_create);

// DELETE request for deleting Contact
router.delete('/deleteContact/:id', contactsController.authenticate_user, contactsController.contact_delete);

module.exports = router;
