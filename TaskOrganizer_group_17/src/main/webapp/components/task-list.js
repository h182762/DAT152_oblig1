export default class extends HTMLElement {
	#cssfile = "../css/task-list-style.css";
	#shadow;
	#statuses;
	#deleteTaskCallbacks;
	#addTaskCallbacks
	#changeStatusCallbacks;
	
	/**
	* Constructor for task-list.js
	*/
	constructor() {
		// Must have super
		super();
		// Arrays for status and callbacks
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#statuses = new Array();
		this.#deleteTaskCallbacks = new Array();
		this.#addTaskCallbacks = new Array()
		this.#changeStatusCallbacks = new Array();
		// Link and HTML
		this.#createLink();
		this.#createHTML();
		
		// Waiting for server data text
		this.#shadow.querySelector("span").textContent = "Waiting for server data.";
		
		// Create new task button
		const bt = this.#shadow.querySelector("button[type=button]");
		bt.addEventListener("click", this.addTask.bind(this), false);
		// Sets button as disabled
		bt.disabled = true;
		
		
	}
	
	/**
    * Links the CSS style sheet
    */
	#createLink() {
		const link = document.createElement("link");
		// Imports URL
		const path = import.meta.url.match(/.*\//)[0];
		link.href = path.concat(this.#cssfile);
		link.rel = "stylesheet";
		link.type = "text/css";
		this.#shadow.appendChild(link);
		return link;
	}

	/**
	* Html for task list
	*/
	#createHTML() {
		// Sets wrapper as a div
		const wrapper = document.createElement("div");
		// Content of the div
		const content = `
		<p><span></span></p>
		
		<button id="newTask" type="button">New Task</button>
		<br>
		<br>
	
			<table id="listTable">
				<tr id="top">
					<td style="width: 50%;">Task</td>
					<td style="width: 20%;">Status</td>
					<td style="width: 15%;"></td>
					<td style="width: 15%;"></td>
				</tr>
			</table>
	
		
		`;
		// Wraps content to HTML
		wrapper.insertAdjacentHTML("beforeend", content);
		this.#shadow.appendChild(wrapper);
		
		return wrapper;
	}
	
	/**
    * @param {any} newTask
    *
    * Shows task 
    */
	showTask(newTask) {
		// Gets the table
		const table = this.#shadow.querySelector("#listTable");
		// Inserts a row
		let row = table.insertRow(1);
		// Inserts the cells
		row.insertCell(0).innerText = newTask.title;
		row.insertCell(1).innerText = newTask.status;

		row.className += "rows";
		row.setAttribute("id", newTask.id);

		// Modify select list
		let modifySelect = document.createElement("select");
		modifySelect.setAttribute("id", newTask.id);

		let option = document.createElement("option");
		option.setAttribute("value", "");
		option.textContent = "<Modify>";
		option.setAttribute("selected", "selected");
		option.setAttribute("disabled", "disabled");
		modifySelect.appendChild(option);

		for (let i = 0; i < this.#statuses.length; i++) {
			let option = document.createElement("option");
			option.setAttribute("value", i);
			option.text = this.#statuses[i];
			modifySelect.appendChild(option);
		}

		modifySelect.addEventListener("change", this.modifyStatus.bind(this), false);
		row.insertCell(2).appendChild(modifySelect);

		// Remove button
		let removeButton = document.createElement("button");
		removeButton.textContent = "Remove";
		removeButton.setAttribute("id", newTask.id);
		removeButton.addEventListener("click", this.deleteTask.bind(this), true)
		
		row.insertCell(3).appendChild(removeButton);

		
		this.noTask();
	}	
	
    /**
    * @param {any} id
    * @param {any} status
    *
    * Updates the task list
    */
	updateTask(id, status) {
		
		// Gets the table
		const table = this.#shadow.querySelector("#listTable");
		// Gets the rows
		let rows = table.rows;
		// For each row...
		for (let i = 0; i < rows.length; i++) {
			// If the row ID equals the updated task ID...
			if (rows[i].id == id) {
				// Updates the status
				rows[i].childNodes[1].textContent = status;
			}
		}
	}

    /** 
    * @param {any} list
    *
    * Sets status of list [ACTIVE, WATING, CLOSED]
    */
	setStatusesList(list) {
		this.#statuses = list;
	}

	/**
	* Enables addTask button 
	*/
	enableAddTask() {
		const bt = this.#shadow.querySelector("button[type=button]");
		bt.disabled = false;
	}

	/**
	 * @param {any} method
	 *
	 * Adds task callback
	 */
	set addTaskCallback(method) {
		this.#addTaskCallbacks.push(method);
	}
	
	/** 
	* @param {any} event
	*
	* Adds new task 
	*/
	addTask(event) {
		this.#addTaskCallbacks.forEach((x) => x(event))
	}

	/**
	 * @param {any} method
	 *
	 * Changes status callback
	 */
	set changeStatusCallback(method) {
		this.#changeStatusCallbacks.push(method);
	}
	
    /**
    * @param {any} task
    *
    * Modifies status of task
    */
	modifyStatus(task) {
		// The ID of the task to modify the status of
		let id = task.target.id
		// The new status
		let status = this.#statuses[task.target.value]
		
		// Asks the user to confirm the change
		let r = window.confirm("Change status to " + status + "?")
		if (r) {
			this.#changeStatusCallbacks.forEach((x) => x(id, status))
		} else {
			console.log("Cancelled by user.")
		}
	}

	/**
	 * @param {any} method
	 *
	 * Deletes task callback
	 */
	set deleteTaskCallback(method) {
		this.#deleteTaskCallbacks.push(method);
	}
	
	/**
	 * @param {any} object
	 *
	 * Deletes task based on id from task list
	 */
	deleteTask(object) {
		
		let id = object.target.id
		let confirmation = window.confirm("Do you want to delete this task?");
		if (confirmation){
			
		   this.#deleteTaskCallbacks.forEach((x) => x(id));
	    }else{
		   console.log("User canceled");
	    }
	}
	
	/**
	* @param {any} id
	*
	* Removes task based on id from task list
	*/
	removeTask(id) {
		let index = 1;
		
		// Sets the task table as a const
		const table = this.#shadow.querySelector("#listTable");
		let rows = table.rows;
		
		// Looks for corresponding task id to id input
		for (let i = 0; i < rows.length; i++) {

			if (rows[i].id == id) {
				index = i;
			}
		}
		
		table.deleteRow(index);

		this.noTask();
	}

    /**
    * Sets text as "No tasks were found if there are no tasks"
    * Sets text as "Found numberOfTasks tasks"
    */ 
	noTask() {
		const table = this.#shadow.querySelector("#listTable");
		let rows = table.rows;
		let numberofTasks = -1;
		
		for (let i = 0; i < rows.length; i++) {
			numberofTasks++;
		}
		
		if (numberofTasks == 0) {
			this.#shadow.querySelector("span").textContent = "No tasks were found.";
			this.#shadow.querySelector("#top").style.visibility = "hidden";
			
			return;
		}
		this.#shadow.querySelector("#top").style.visibility = "visible";
		this.#shadow.querySelector("span").textContent = "Found " + numberofTasks + " tasks.";
	}

}