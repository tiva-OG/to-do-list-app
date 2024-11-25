const Task = require("../models/task")
const asyncWrapper = require("../middleware/async-wrapper")
const { CustomAPIError } = require("../errors/custom-error")

// get all the tasks
exports.getAllTasks = asyncWrapper(async (req, res) => {
	const allTasks = await Task.find({})
	res.render("index", { tasks: allTasks })
})

// get single task
exports.getTask = asyncWrapper(async (req, res, next) => {
	const { taskId } = req.params
	const task = await Task.findById(taskId)

	if (!task) throw new CustomAPIError("Invalid Task Id", 400)
	res.send(`
		<h2>${task.title}</h2>
		<p><strong>Description:</strong> ${task.description}</p>
		`)
})

// create task
exports.createTask = asyncWrapper(async (req, res) => {
	const newTask = await Task.create(req.body)
	res.status(200).json({ newTask })
})

// update task
exports.updateTask = asyncWrapper(async (req, res) => {
	const { taskId } = req.params
	const task = await Task.findByIdAndUpdate(taskId, req.body, {
		new: true,
		runValidators: true,
	})

	if (!task) throw new CustomAPIError("Invalid Task Id", 400)
	res.status(200).json({ task })
})

// delete task
exports.deleteTask = asyncWrapper(async (req, res) => {
	const { taskId } = req.params
	const task = await Task.findByIdAndDelete(taskId)

	if (!task) throw new CustomAPIError("Invalid Task Id", 400)
	res.status(200).json({ task })
})

// get total number of tasks
exports._getTasksCount = asyncWrapper(async (req, res) => {
	const allTasks = await Task.find({})

	res.json({ count: allTasks.length })
})

// filter|sort tasks
