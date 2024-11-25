;(() => {
	const tasksListContainerDOM = document.querySelector(".tasks-list-container")
	const addTaskDOM = document.querySelector(".add-task")
	const largeAddBtnDOM = document.getElementById("large-add-btn")
	const taskFormTemplate = document.getElementById("task-form-template")

	let taskForm

	const createElement = (tag, attributes) => {
		return Object.assign(document.createElement(tag), attributes)
	}

	function createForm(clone, type, text) {
		const taskForm = clone.querySelector(".task-form-wrapper")
		const editBtn = clone.querySelector(".add-edit-btn")
		const cancelBtn = clone.querySelector(".cancel-btn")

		cancelBtn.setAttribute("btn-id", `cancel-${type}-btn`)
		editBtn.setAttribute("btn-id", `${type}-btn`)
		editBtn.firstChild.textContent = text

		return taskForm
	}

	function cancelForm() {}

	// largeAddBtnDOM.addEventListener("click", async (e) => {
	// 	try {
	// 		const clonedFragment = taskFormTemplate.content.cloneNode(true)
	// 		const taskForm = createForm(clonedFragment, "add-btn", "Add task")

	// 		tasksListContainerDOM.insertBefore(taskForm, addTaskDOM)
	// 		addTaskDOM.style.display = "none"
	// 	} catch (err) {
	// 		console.log(err)
	// 	}
	// })
})()
/* <script>
    function getContent(){
        document.getElementById("my-textarea").value = document.getElementById("my-content").innerHTML;
    }
</script>



<div id="my-content" contenteditable="true"><a href="page.html">Some</a> Text</div>

<form action="some-page.php" onsubmit="return getContent()">
    <textarea id="my-textarea" style="display:none"></textarea>
    <input type="submit" />
</form> */

// .textarea {
//   width:250px;
//   min-height:50px;
//   height:auto;
//   border:2px solid rgba(63,63,63,1);

//   <div class="textarea" contenteditable="true"></div>

// document.querySelectorAll("textarea").forEach(function(textarea) {
//   textarea.style.height = textarea.scrollHeight + "px";
//   textarea.style.overflowY = "hidden";

//   textarea.addEventListener("input", function() {
//     this.style.height = "auto";
//     this.style.height = this.scrollHeight + "px";
//   });
// });

// <textarea placeholder="Type, paste, cut text here...">PRELOADED TEXT. This JavaScript should now add better support for IOS browsers and Android browsers.</textarea>
// <textarea placeholder="Type, paste, cut text here..."></textarea>
