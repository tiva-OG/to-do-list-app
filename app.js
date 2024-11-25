require("dotenv").config()

const express = require("express")
const path = require("path")
const methodOverride = require("method-override")
const connectDB = require("./db/connect")
const tasksRouter = require("./routes/tasks")
const { errorHandler } = require("./middleware/error-handler")

const app = express()
const port = process.env.PORT || 3000

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

app.use(express.json())
app.use(express.static("./public"))
app.use("/api/v1", tasksRouter)
app.use(errorHandler)

const run = async () => {
	try {
		// connect to database & server
		await connectDB(process.env.MONGO_URI)
		await console.log("CONNECTED TO DB...")
		app.listen(port, console.log(`Server listening on port: ${port}...`))
	} catch (err) {
		console.log(err.message)
	}
}

run()
