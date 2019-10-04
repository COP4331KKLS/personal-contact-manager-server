const express = require('express');
const router = express.Router();

const contactsController = require('../controllers/contactsController');

// GET request for list of all Contacts
router.get('/getContactsList', contactsController.authenticate_user, contactsController.contacts_list);

// GET request for searching for Contact
router.get('/searchContact', contactsController.authenticate_user, contactsController.contact_search);

// POST request for creating Contact
router.post('/addContact', contactsController.authenticate_user, contactsController.contact_create);

// DELETE request for deleting Contact
router.delete('/deleteContact', contactsController.authenticate_user, contactsController.contact_delete);

module.exports = router;