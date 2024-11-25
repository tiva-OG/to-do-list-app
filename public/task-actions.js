;(() => {
	const addTaskDOM = document.querySelector(".add-task")
	// const tasksContainer = document.querySelector(".tasks-list-container")

	const tasksOnly = document.querySelector(".tasks-only")
	const tasksCountDOM = document.querySelector(".tasks-count")
	const tasksListContainerDOM = document.querySelector(".tasks-list-container")

	// const tagsDropdownTemplate = document.getElementById("tags-dropdown-template")
	const taskFormTemplate = document.getElementById("task-form-template")
	const taskWrapperTemplate = document.getElementById("task-wrapper-template")

	const largeAddBtnDOM = document.getElementById("large-add-btn")

	let clonedFragment
	let taskWrapper
	let taskItem
	let taskForm

	function addGlobalEventListener(type, selector, callback, parent = document) {
		parent.addEventListener(type, (e) => {
			if (e.target.matches(selector)) {
				callback(e)
			}
		})
	}

	const createElement = (tag, attributes) => {
		return Object.assign(document.createElement(tag), attributes)
	}

	function createForm(type, text) {
		taskForm = clonedFragment.querySelector(".task-form-wrapper")
		const cancelBtn = clonedFragment.querySelector(".cancel-btn")
		const typeBtn = clonedFragment.querySelector(".add-edit-btn")

		cancelBtn.setAttribute("btn-id", `cancel-${type}-btn`)
		typeBtn.setAttribute("btn-id", `${type}-btn`)
		typeBtn.firstChild.textContent = text
	}

	function getTaskRef(title, taskId) {
		return title.toLowerCase().split(" ").join("-") + "-" + taskId.slice(-8)
	}

	function addTaskToList(data) {
		clonedFragment = taskWrapperTemplate.content.cloneNode(true)
		const taskRef = getTaskRef(data.title, data._id)

		taskWrapper = clonedFragment.querySelector(".task-wrapper")
		taskWrapper.setAttribute("id", data._id)
		taskWrapper.setAttribute("task-ref", taskRef)

		clonedFragment
			.getElementById("delete-task")
			.setAttribute("task-id", data._id)
		clonedFragment.querySelector(".title").textContent = data.title

		if (data.description) {
			const taskBody = clonedFragment.querySelector(".task-body")
			const taskDesc = createElement("div", { className: "task-desc" })
			const description = createElement("div", { className: "description" })
			description.textContent = data.description

			taskDesc.appendChild(description)
			taskBody.appendChild(taskDesc)
		}

		tasksOnly.appendChild(taskWrapper)
	}

	addGlobalEventListener("click", "#large-add-btn", (e) => {
		openAddTaskForm(e)
	})

	addGlobalEventListener("click", "#edit-task", (e) => {
		openEditTaskForm(e)
	})

	// cancel & close form to add task
	addGlobalEventListener("click", ".cancel-btn", (e) => {
		cancelForm(e)
	})

	// add task from filled form
	addGlobalEventListener("click", "[btn-id=add-btn]", (e) => {
		addTask(e)
	})

	// update task from edited form
	addGlobalEventListener("click", "[btn-id=edit-btn]", (e) => {
		updateTask(e)
	})

	// delete task
	addGlobalEventListener("click", "#delete-task", (e) => {
		deleteTask(e)
	})

	// addGlobalEventListener("click", "#dropdown-btn", (e) => {
	// 	toggleTagsDropdown(e)
	// })

	const openAddTaskForm = async (e) => {
		try {
			if (taskForm) {
				cancelForm(e)
			}
			clonedFragment = taskFormTemplate.content.cloneNode(true)
			createForm("add", "Add task")

			// clonedFragment self-destruct right after inserting taskForm???
			tasksListContainerDOM.insertBefore(taskForm, addTaskDOM)
			addTaskDOM.style.display = "none"
		} catch (err) {
			console.log(err)
		}
	}

	const openEditTaskForm = async (e) => {
		try {
			if (taskForm) cancelForm(e)

			const taskId = e.target.getAttribute("task-id")

			taskWrapper = e.target.parentElement
			while (taskWrapper.getAttribute("id") != `${taskId}`) {
				taskWrapper = taskWrapper.parentElement
			}
			taskItem = taskWrapper.querySelector(".task-item")

			const taskTitle = taskItem.querySelector(".title").textContent
			const taskDesc = taskItem.querySelector(".description")
				? taskItem.querySelector(".description").textContent
				: ""

			clonedFragment = taskFormTemplate.content.cloneNode(true)
			clonedFragment.getElementById("title-input").value = taskTitle
			clonedFragment.getElementById("desc-input").value = taskDesc

			createForm("edit", "Update")

			taskWrapper.replaceChild(taskForm, taskItem)
		} catch (err) {
			console.log(err)
		}
	}

	const toggleTagsDropdown = async (e) => {
		try {
			// this has to load inside the function as the elements are dynamic
			const titleInput = document.getElementById("title-input")
			const descInput = document.getElementById("desc-input")

			const taskTitle = titleInput.value
			const taskDesc = descInput.value

			const taskPostRes = await axios.post("/api/v1/tasks", {
				title: taskTitle,
				description: taskDesc,
			})
			titleInput.value = ""
			descInput.value = ""

			addTaskToList(taskPostRes.data.newTask)

			const tasksCountRes = await axios.get("/api/v1/_getTasksCount")
			const tasksCount = tasksCountRes.data.count

			const identifier = tasksCount <= 1 ? "task" : "tasks"
			tasksCountDOM.textContent = `${tasksCount} ${identifier}`
		} catch (err) {
			console.log(err)
		}
	}

	const addTask = async (e) => {
		try {
			// this has to load inside the function as the elements are dynamic
			const titleInput = document.getElementById("title-input")
			const descInput = document.getElementById("desc-input")

			const taskTitle = titleInput.value
			const taskDesc = descInput.value

			const taskPostRes = await axios.post("/api/v1/tasks", {
				title: taskTitle,
				description: taskDesc,
			})
			titleInput.value = ""
			descInput.value = ""

			addTaskToList(taskPostRes.data.newTask)

			const tasksCountRes = await axios.get("/api/v1/_getTasksCount")
			const tasksCount = tasksCountRes.data.count

			const identifier = tasksCount <= 1 ? "task" : "tasks"
			tasksCountDOM.textContent = `${tasksCount} ${identifier}`
		} catch (err) {
			console.log(err)
		}
	}

	const updateTask = async (e) => {
		try {
			const taskId = taskItem.getAttribute("task-id")

			const taskTitle = document.getElementById("title-input").value
			const taskDesc = document.getElementById("desc-input").value

			await axios.patch(`/api/v1/task/${taskId}`, {
				taskId,
				title: taskTitle,
				description: taskDesc,
			})

			taskItem.querySelector(".title").textContent = taskTitle
			taskItem.querySelector(".description").textContent = taskDesc

			taskWrapper.replaceChild(taskItem, taskForm)
		} catch (err) {
			console.log(err)
		}
	}

	const deleteTask = async (e) => {
		try {
			const taskId = e.target.getAttribute("task-id")

			let taskWrapper = e.target.parentElement
			while (taskWrapper.getAttribute("id") != `${taskId}`) {
				taskWrapper = taskWrapper.parentElement
			}

			await axios.delete(`/api/v1/task/${taskId}`)
			taskWrapper.remove()

			const tasksCountResponse = await axios.get("/api/v1/_getTasksCount")
			const tasksCount = tasksCountResponse.data.count

			const identifier = tasksCount <= 1 ? "task" : "tasks"
			tasksCountDOM.textContent = `${tasksCount} ${identifier}`
		} catch (err) {
			console.log(err)
		}
	}

	const cancelForm = async (e) => {
		try {
			element = e.target

			if (element.hasAttribute("id")) {
				const id = element.getAttribute("id")

				if (id.includes("edit")) {
					if (taskItem) taskWrapper.replaceChild(taskItem, taskForm)
					else {
						taskForm.remove()
						addTaskDOM.style.display = ""
					}
				} else if (id.includes("add")) {
					taskWrapper.replaceChild(taskItem, taskForm)
					addTaskDOM.style.display = ""
				}
			} else if (element.hasAttribute("btn-id")) {
				const btnId = element.getAttribute("btn-id")

				if (btnId === "cancel-edit-btn") {
					taskWrapper.replaceChild(taskItem, taskForm)
				} else if (btnId === "cancel-add-btn") {
					taskForm.remove()
					addTaskDOM.style.display = ""
				}
			}

			clonedFragment = null
			taskWrapper = null
			taskItem = null
			taskForm = null
		} catch (err) {}
	}
})()

// const cancelEditForm = async (e) => {}

// formDOM.addEventListener('submit', async (e) => {
//   e.preventDefault()
//   const name = taskInputDOM.value

//   try {
//     await axios.post('/api/v1/tasks', { name })
//     showTasks()
//     taskInputDOM.value = ''
//     formAlertDOM.style.display = 'block'
//     formAlertDOM.textContent = `success, task added`
//     formAlertDOM.classList.add('text-success')
//   } catch (error) {
//     formAlertDOM.style.display = 'block'
//     formAlertDOM.innerHTML = `error, please try again`
//   }
//   setTimeout(() => {
//     formAlertDOM.style.display = 'none'
//     formAlertDOM.classList.remove('text-success')
//   }, 3000)
// })

// const formWrapper = document.createElement("li")
// 	formWrapper.setAttribute("class", "task-form-wrapper")

// 	// form.task-form
// 	const taskForm = document.createElement("form")
// 	taskForm.setAttribute("class", "task-form")

// 	// .task-form-main
// 	const formMain = document.createElement("div")
// 	formMain.setAttribute("class", "task-form-main")

// 	// .task-input-fields
// 	const inputFields = document.createElement("div")
// 	inputFields.setAttribute("class", "task-input-fields")

// 	// .data-field#title-data
// 	const titleData = document.createElement("div")
// 	titleData.setAttribute("class", "data-field")
// 	titleData.setAttribute("id", "title-data")

// 	// .task-data#title-input
// 	const titleInput = document.createElement("input")
// 	titleInput.setAttribute("class", "task-data")
// 	titleInput.setAttribute("id", "title-input")

// 	// .data-field#desc-data
// 	const descData = document.createElement("div")
// 	descData.setAttribute("class", "data-field")
// 	descData.setAttribute("id", "desc-data")

// 	// .task-data#desc-input
// 	const descInput = document.createElement("textarea")
// 	descInput.setAttribute("class", "task-data")
// 	descInput.setAttribute("id", "desc-input")

// 	// .task-form-footer
// 	const formFooter = document.createElement("div")
// 	formFooter.setAttribute("class", "task-form-footer")

// 	// .form-tags-dropdown
// 	const tagsDropdown = document.createElement("div")
// 	tagsDropdown.setAttribute("class", "form-tags-dropdown")

// 	const universalBtn = document.createElement("button")
// 	universalBtn.setAttribute("type", "button")

// 	const universalSpan = document.createElement("span")

// 	// .form-actions-btn
// 	const actionsBtn = document.createElement("div")
// 	actionsBtn.setAttribute("class", "form-actions-btn")

// 	const cancelBtn = document.createElement("button")
// 	cancelBtn.setAttribute("type", "button")
// 	cancelBtn.setAttribute("id", "cancel-btn")

// 	const addBtn = document.createElement("button")
// 	addBtn.setAttribute("type", "button")
// 	addBtn.setAttribute("id", "add-btn")
