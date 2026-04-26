const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/index');
const { requireLogin } = require('../middleware/index');

router.post('/login', ctrl.login);
router.post('/logout', ctrl.logout);
router.get('/profile', ctrl.getProfile);

router.get('/heavy-sync', ctrl.heavySync);
router.get('/heavy-async', ctrl.heavyAsync);

router.use(requireLogin); 

router.get('/students/stats', ctrl.getStats);
router.get('/students/stats/class', ctrl.getClassStats);
router.get('/students', ctrl.getStudents);
router.get('/students/:id', ctrl.getStudentById);
router.post('/students', ctrl.createStudent);
router.put('/students/:id', ctrl.updateStudent);
router.delete('/students/:id', ctrl.deleteStudent);

module.exports = router;