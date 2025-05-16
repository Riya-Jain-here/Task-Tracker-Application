const Task = require("../models/task");

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ projectId: req.params.projectId });
  res.json(tasks);
};

exports.createTask = async (req, res) => {
  const task = await Task.create({
    projectId: req.params.projectId,
    title: req.body.title,
    description: req.body.description,
    status: req.body.status || "Pending",
  });
  res.json(task);
};

exports.updateTask = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.status === "Completed") {
      updateData.completedAt = new Date();
    } else if (updateData.status && updateData.status !== "Completed") {
      updateData.completedAt = null;
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update task" });
  }
};

exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
};
