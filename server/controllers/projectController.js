const Project = require("../models/Project");
const Task = require("../models/task");

exports.getProjects = async (req, res) => {
  const projects = await Project.find({ userId: req.user._id });
  res.json(projects);
};

exports.createProject = async (req, res) => {
  const count = await Project.countDocuments({ userId: req.user._id });
  if (count >= 4) return res.status(400).send("Max 4 projects allowed");
  const project = await Project.create({
    userId: req.user._id,
    name: req.body.name,
  });
  res.json(project);
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findOne({
      _id: projectId,
      userId: req.user._id,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    await Task.deleteMany({ projectId });
    await Project.findByIdAndDelete(projectId);
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete project" });
  }
};
