export default class {

	/**
	 * Adds task to database
	 *
	 * @param {Task} data - Task to be added
	 * @param {function} callback - callback function to be called on successful execution
	 * @async
	 */
	async addTask(data, callback) {
		const url = `../TaskServices/api/services/task/`

		const requestOptions = {
			method: 'POST',
			headers: { "Content-Type": "application/json; charset=utf-8" },
			body: JSON.stringify(data),
			cache: "no-cache",
			redirect: "error"
		};

		try {
			const response = await fetch(url, requestOptions)

			if (response.ok) {

				let json = await response.json()
				let id = json.task.id

				console.log("Success on adding task with id " + id);

				const newdata = {
					"id": id,
					"title": data.title,
					"status": data.status
				}

				callback(newdata)
			}
		}
		catch (error) {
			console.log(error)
		}
	}

	/**
	 * Updates task status
	 *
	 * @param {integer} id - id of the task
	 * @param {string} status - new status
	 * @param {function} callback - callback function to be called on successful execution
	 * @async
	 */
	async updateTask(id, status, callback) {

		const url = `../TaskServices/api/services/task/`

		const data = {
			"status": status
		};

		const requestOptions = {
			method: 'PUT',
			headers: { "Content-Type": "application/json; charset=utf-8" },
			body: JSON.stringify(data),
			cache: "no-cache",
			redirect: "error"
		};

		try {
			const response = await fetch(url + id, requestOptions)

			if (response.ok) {
				console.log("Success on updating task with id " + id)
				callback(id, status)
			}
		} catch (error) {
			console.log(error)
		}
	}

	/**
	  * Returns all tasks
	  *
	  * @async
	  * @returns tasks in JSON format
	  */
	async getTasks() {

		const url = `../TaskServices/api/services/tasklist/`

		try {
			const response = await fetch(url, { method: "GET" });

			try {
				const result = await response.json();

				return result;
			} catch (error) {
				console.log(error);
			}
		} catch (error) {
		}
	}

	/**
	 * Returns all statuses
	 *
	 * @async
	 * @returns statuses in JSON format
	 */
	async getStatuses() {

		const url = `../TaskServices/api/services/allstatuses`

		try {
			const response = await fetch(url, { method: "GET" })
			try {
				const result = await response.json()

				return result;
			} catch (error) {
				console.log(error)
			}
		} catch (error) {
			console.log(error)
		}
	}

	/**
	 * Remove task from database
	 *
	 * @param {Integer} id - id of the task
	 * @param {function} callback - callback function to be called on successful execution
	 * @async
	 */
	async removeTask(id, callback) {

		const url = `../TaskServices/api/services/task/`;

		try {
			const response = await fetch(url + id, { method: "DELETE" });

			if (response.ok) {
				console.log("Success on removing task with id " + id);
				callback(id);
			}
		} catch (error) {
			console.log(error)
		}
	}
}