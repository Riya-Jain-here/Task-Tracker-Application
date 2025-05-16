const express = require("express");
const {
  getProjects,
  createProject,
  getProjectById,
  deleteProject,
} = require("../controllers/projectController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.use(auth);
router.get("/", getProjects);
router.post("/", createProject);
router.get("/:id", getProjectById);
router.delete("/:id", deleteProject);
module.exports = router;
