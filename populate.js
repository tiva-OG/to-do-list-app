require("dotenv").config()

const connectDB = require("./db/connect")
const Task = require("./models/task")
const dummyTasks = require("./dummyTasks.json")
const asyncWrapper = require('./middleware/async-wrapper')

const populateTasks = async () => {
	await connectDB(process.env.MONGO_URI)
	await console.log("Connected to Database...")
	await Task.deleteMany({})
	await Task.create(dummyTasks)
	console.log("...Process Completed")
	await process.exit(0)
}

populateTasks()
