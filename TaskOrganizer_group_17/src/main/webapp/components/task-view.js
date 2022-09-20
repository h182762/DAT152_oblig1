export default class {
	#taskList
	#taskBox
	#ajaxHandler

	constructor(taskList, taskBox, ajaxHandler) {

		// Gets the Ajax Handler
		this.#ajaxHandler = ajaxHandler

		// Gets the task lists
		this.#taskList = Array.from(taskList)

		// Gets the task boxes
		this.#taskBox = Array.from(taskBox)

		// Starts the setup function
		this.setup()
	}

	/**
	 * Setup function
	 * Injects database content
	 * and initiate callback functions
	 */
	async setup() {

		// Fetches tasks from the database
		const tasksJson = await this.#ajaxHandler.getTasks()
		const tasks = tasksJson.tasks

		// Fetches statuses from the database
		const statusesJson = await this.#ajaxHandler.getStatuses();
		const statuses = statusesJson.allstatuses

		// Looping through all list and box objects
		for (let i = 0; i < this.#taskList.length; i++) {

			// Sets the statuses
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
}
