const express = require('express');
const router = express.Router();

// GET request for list of all Contact
router.get('/getContactsList', contactsController.contacts_list);

// POST request for creating Contact
router.post('/addContact', contactsController.contact_create);

// DELETE request for deleting Contact
router.delete('/deleteContact/:id', contactsController.contact_delete);

module.exports = router;