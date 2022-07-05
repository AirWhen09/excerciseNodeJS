const express = require('express');
const router = express.Router();
const regController = require('../controllers/authAccount');

router.post('/login', regController.login);
router.post('/addStudent', regController.addStudent);
router.get('/delete/:email', regController.delete);
router.get('/update/:email', regController.update);
router.post('/updateStudent', regController.updateStudent);

module.exports = router;