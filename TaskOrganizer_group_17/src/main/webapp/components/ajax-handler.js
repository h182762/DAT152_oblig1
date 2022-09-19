"use strict";

export default class {
	
	/**
	 * Adds task to database
	 *
	 * @param data Task to be added
	 * @param callback callback function to be called on successful execution
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

				const taskjson = await this.getTasks()
				const alltasks = taskjson.tasks
				let id = -1

				for (let i = 0; i < alltasks.length; i++) {
					if (alltasks[i].id > id) {
						id = alltasks[i].id
					}
				}
				
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
	 * @param id id of the task
	 * @param status new status
	 * @param callback callback function to be called on successful execution
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
				console.log("Success!")
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
	 * @param id id of the task
	 * @param callback callback function to be called on successful execution
	 * @async
	 */
	async removeTask(id, callback) {

		const url = `../TaskServices/api/services/task/`;

		try {
			const response = await fetch(url + id, { method: "DELETE" });

			if (response.ok) {
				console.log("Success");
				callback(id);
			}
		} catch (error) {
			console.log(error)
		}
	}
}