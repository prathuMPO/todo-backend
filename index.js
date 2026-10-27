/** @format */

const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

const taskSchema = new mongoose.Schema({
  taskText: { type: String, requred: true },
  isDone: { type: Boolean, default: false },
});

const Task = mongoose.model("Task", taskSchema);

app.use(express.json()); //middleware to read json because express cannot.
app.use(cors());
const PORT = 3000;

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// app.post("/tasks", (req, res) => {
//   const newTask = {
//     id: Date.now(),
//     taskText: req.body.taskText,
//     isDone: false,
//   };
//   tasks.push(newTask);
//   res.json(newTask);
// });

app.post("/tasks", async (req, res) => {
  const newTask = await Task.create({
    taskText: req.body.taskText,
  });
  res.json(newTask);
});

app.delete("/tasks/:id", async (req, res) => {
  const deleteTask = await Task.findByIdAndDelete(req.params.id);
  res.json(deleteTask);
});

app.put("/tasks/:id", async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.isDone = !task.isDone;
  await task.save();
  res.json(task);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
