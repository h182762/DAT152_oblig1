"use strict";

import AjaxHandler from "../components/ajax-handler.js";

export default class {
	#taskList
	#taskBox
	#ajaxHandler

	constructor() {
		// Starts the Ajax Handler
		this.#ajaxHandler = new AjaxHandler();
		// Gets the task list
		this.#taskList = document.querySelector("task-list");
		// Gets the task box
		this.#taskBox = document.querySelector("task-box");
		// Starts the setup function
		this.setup()
	}


	async setup() {
		// Fetches tasks from the database
		const tasksJson = await this.#ajaxHandler.getTasks()
		const tasks = tasksJson.tasks
		// Fetches statuses from the database
		const statusesJson = await this.#ajaxHandler.getStatuses();
		const statuses = statusesJson.allstatuses

		// Sets the statuses
		this.#taskList.setStatusesList(statuses)
		this.#taskBox.setStatuseslist(statuses)

		// Shows the tasks that were fetched
		for (let i = 1; i <= tasks.length; i++) {
			this.#taskList.showTask(tasks[i - 1]);
		}
		// Enables adding new tasks
		this.#taskList.enableAddTask();

		// Callback for changing status
		this.#taskList.changeStatusCallback = (id, newStatus) => {
			// TODO: Make the status change without reloading
			this.#ajaxHandler.updateTask(id, newStatus, (id, status) => this.#taskList.updateTask(id, status))
		}
		// Callback for deleting tasks
		this.#taskList.deleteTaskCallback = (id) => {
			// TODO: Make the task disappear without reloading
			this.#ajaxHandler.removeTask(id, (id) => this.#taskList.removeTask(id))
		}

		// Shows the task box
		this.#taskList.addTaskCallback = () => {
			this.#taskBox.show();
		}

		// Adds a new task to the database
		this.#taskBox.newTaskCallback = (task) => {
			this.#ajaxHandler.addTask(task, (task) => this.#taskList.showTask(task))
		}


	}



	async test() {

		const tasksJson = await this.#ajaxHandler.getTasks()
		const tasks = tasksJson.tasks
		const statusesJson = await this.#ajaxHandler.getStatuses();
		const statuses = statusesJson.allstatuses

		this.#taskList.setStatusesList(statuses)


		const newtask = {
			"id": 5,
			"title": "Do DAT152 home work",
			"status": "ACTIVE"
		};

		this.#taskList.showTask(newtask);

		const status = {
			"id": 5,
			"status": "ACTIVE"
		};
		this.#taskList.updateTask(status.id, status.status);


		//this.#taskList.removeTask(5);
	}


}
