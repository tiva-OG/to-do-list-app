const express = require("express")
const {
	getAllTasks,
	getTask,
	createTask,
	updateTask,
	deleteTask,
	_getTasksCount,
} = require("../controllers/tasks")

const router = express.Router()

router.route("/tasks").get(getAllTasks)
router.route("/task/:taskId").get(getTask)
router.route("/tasks").post(createTask)
router.route("/task/:taskId").patch(updateTask)
router.route("/task/:taskId").delete(deleteTask)

router.route("/_getTasksCount").get(_getTasksCount)

module.exports = router
