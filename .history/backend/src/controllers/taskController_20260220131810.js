const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  const task = await Task.create({
    ...req.body,
    userId: req.user.id
  });
  res.status(201).json(task);
};

exports.getTasks = async (req, res) => {
  let tasks;
  if (req.user.role === "admin") {
    tasks = await Task.find();
  } else {
    tasks = await Task.find({ userId: req.user.id });
  }
  res.json(tasks);
};

exports.updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json({ msg: "Not found" });

  if (req.user.role !== "admin" && task.userId.toString() !== req.user.id)
    return res.status(403).json({ msg: "Forbidden" });

  Object.assign(task, req.body);
  await task.save();

  res.json(task);
};

exports.deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).json({ msg: "Not found" });

  if (req.user.role !== "admin" && task.userId.toString() !== req.user.id)
    return res.status(403).json({ msg: "Forbidden" });

  await task.deleteOne();
  res.json({ msg: "Deleted" });
};