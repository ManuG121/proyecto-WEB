const express = require('express');
const router = express.Router();
const controller = require('../controllers/announcementController');
const auth = require('../middlewares/authMiddleware');

router.get('/', auth, controller.getAllAnnouncements);
router.post('/', auth, controller.createAnnouncement);
router.delete('/:id', auth, controller.deleteAnnouncement);

module.exports = router;