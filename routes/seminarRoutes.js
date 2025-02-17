const {
    createSeminar, getSeminars, getSeminarById,  updateSeminar, deleteSeminar
  } = require('../controllers/seminarController');
const upload = require('../middleware/uploadMiddleware.js');
const express = require('express');
const router = express.Router();

router.post("/", upload.single("image"), createSeminar);
router.get("/", getSeminars);
router.get("/:id", getSeminarById);
router.put("/:id", updateSeminar);
router.delete("/:id", deleteSeminar);

module.exports = router;
