
export default class {
	#taskList
	#taskBox
	#ajaxHandler

	constructor(taskList, taskBox, ajaxHandler) {

		// Starts the Ajax Handler
		this.#ajaxHandler = ajaxHandler
		// Gets the task list
		this.#taskList = Array.from(taskList)
		// Gets the task box
		this.#taskBox = Array.from(taskBox)
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
		for (let i = 0; i < this.#taskList.length; i++) {
			this.#taskList[i].setStatusesList(statuses)
			this.#taskBox[i].setStatuseslist(statuses)

			// Shows the tasks that were fetched
			for (let j = 1; j <= tasks.length; j++) {
				this.#taskList[i].showTask(tasks[j - 1]);
			}

			// Enables adding new tasks
			this.#taskList[i].enableAddTask();


			// Callback for changing status
			this.#taskList[i].changeStatusCallback = (id, newStatus) => {

				this.#ajaxHandler.updateTask(id, newStatus, (id, status) => this.#taskList.forEach((list) => {
					list.updateTask(id, status);
				}))
			}
			// Callback for deleting tasks
			this.#taskList[i].deleteTaskCallback = (id) => {

				this.#ajaxHandler.removeTask(id, (id) => this.#taskList.forEach((list) => {
					list.removeTask(id);
				}))
			}

			// Shows the task box
			this.#taskList[i].addTaskCallback = () => {
				this.#taskBox[i].show();
			}

			// Adds a new task to the database
			this.#taskBox[i].newTaskCallback = (task) => {
				this.#ajaxHandler.addTask(task, (task) => this.#taskList.forEach((list) => {
					list.showTask(task);
				}))
			}
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
