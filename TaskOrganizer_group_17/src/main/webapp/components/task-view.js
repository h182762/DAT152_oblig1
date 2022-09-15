"use strict";

import AjaxHandler from "../components/ajax-handler.js";

export default class {
	#taskList
	#taskBox
	#ajaxHandler


	constructor() {


		this.#ajaxHandler = new AjaxHandler();

		this.#taskList = document.querySelector("task-list");
		this.#taskBox = document.querySelector("task-box");

		this.setup()
	}


	async setup() {
		const tasksJson = await this.#ajaxHandler.getTasks()
		const tasks = tasksJson.tasks
		const statusesJson = await this.#ajaxHandler.getStatuses();
		const statuses = statusesJson.allstatuses

		this.#taskList.setStatusesList(statuses)
		this.#taskBox.setStatuseslist(statuses)
		

		for (let i = 1; i <= tasks.length; i++) {
			this.#taskList.showTask(tasks[i - 1]);
		}

		this.#taskList.enableAddTask();


		this.#taskList.changeStatusCallback = (id, newStatus) => {
			this.#ajaxHandler.updateTask(id, newStatus, this.#taskList.updateTask)
		}

		this.#taskList.deleteTaskCallback = (id) => {
			this.#ajaxHandler.removeTask(id, this.#taskList.removeTask)
		}



		this.#taskList.addTaskCallback = () => {
			this.#taskBox.show();
		}

		this.#taskBox.newTaskCallback = (task) => {
			this.#ajaxHandler.addTask(task, this.#taskList.showTask)
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
