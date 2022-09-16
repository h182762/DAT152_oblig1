"use strict";

export default class {
	
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
			
			if (response.ok){
	        	console.log("Success!")
		        callback(data)
	        }
		}

		catch (error) {
			console.log(error)
		}
	}


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
			console.log(response)
			if (response.ok){
	        	console.log("Success!")
		        callback(id, status)
	        }
		} catch (error) {
			console.log(error)
		}
	}

	/**
	  *	
	  * Returns all tasks
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