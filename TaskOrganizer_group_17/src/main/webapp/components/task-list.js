export default class extends HTMLElement {
	#cssfile = "../main.css";
	#shadow;

	#test;
	constructor() {
		super();

		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#createLink();
		this.#createHTML();

		const text = this.#shadow.querySelector("#text");
		text.innerHTML = "Waiting for server data.";

		const bt = this.#shadow.querySelector("button[type=button]");
		bt.addEventListener("click", this.newTask.bind(this));
		this.#shadow.querySelector("#taskList").setAttribute("href", this.#cssfile);

		this.#getTasks()
	}

	#createLink() {
		const link = document.createElement("link");

		this.#shadow.appendChild(link);
		return link;
	}

	#createHTML() {
		const wrapper = document.createElement("div");

		const content = `
		<p id="text"></p>
		
		<button type="button">New Task</button>
		<br>
		<div id="taskList">
		
		</div>
		
		`;

		const styleTag = document.createElement('style');
		styleTag.innerHTML = this.#cssfile;
		wrapper.insertAdjacentHTML("beforeend", content);
		this.#shadow.appendChild(wrapper);
		this.#shadow.appendChild(styleTag);
		return wrapper;
	}

	async newTask(data) {
		
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
			try {
				
			} catch (error) {
				console.log(error)
			}
		} catch (error) {
			console.log(error)
		}

		//location.reload();
	}

	async #getTasks() {

		const url = `../TaskServices/api/services/tasklist/`

		//await new Promise(r => setTimeout(r, 2000));

		try {
			
			const response = await fetch(url, { method: "GET" });
			
			try {

				const result = await response.json();

				this.#addTasksToList(result.tasks);

				this.#shadow.querySelector("#text").innerHTML = "Found " + Object.keys(result.tasks).length + " tasks.";

			} catch (error) {
				console.log(error);
			}
		} catch (error) {
		}
	}

	#addTasksToList(list) {

		const pre = this.#shadow.querySelector("#taskList")
		const table = document.createElement("table");
		const tr = document.createElement("tr");

		table.style.borderCollapse = "collapse";
		table.style.width = "100%"
		table.style.borderSpacing = "5em"

		const tasks = document.createElement("td")
		tasks.innerHTML = "Task";
		tasks.style.width = "20%"

		const status = document.createElement("td")
		status.innerHTML = "Status";
		status.style.width = "20%"

		tr.style.borderBottom = "1pt solid black"

		const empty = document.createElement("td")
		const empty2 = document.createElement("td")

		tr.appendChild(tasks);
		tr.appendChild(status);
		tr.appendChild(empty);
		tr.appendChild(empty2);

		table.appendChild(tr)

		list.forEach(obj => {

			const tr = document.createElement("tr");

			const task = document.createElement("td")
			task.innerHTML = obj.title;

			const status = document.createElement("td");
			status.innerHTML = obj.status;

			const modify = document.createElement("select");
			modify.setAttribute("id", "modify");
			modify.onchange = () => { this.#updateTask(obj, modify.value) }

			const defaultModify = document.createElement("option");
			defaultModify.innerHTML = "Modify";

			const active = document.createElement("option");
			active.innerHTML = "ACTIVE";
			const waiting = document.createElement("option");
			waiting.innerHTML = "WAITING";
			const done = document.createElement("option");
			done.innerHTML = "DONE";

			modify.appendChild(defaultModify);
			modify.appendChild(active);
			modify.appendChild(waiting);
			modify.appendChild(done);

			const removeButton = document.createElement("button")
			removeButton.innerHTML = "Remove";
			removeButton.addEventListener(("click"), () => { this.#removeTask(obj) })
			

			tr.appendChild(task);
			tr.appendChild(status);
			tr.appendChild(modify);
			tr.appendChild(removeButton);
			table.appendChild(tr);
		})

		pre.appendChild(table);

	}

	async #removeTask(obj) {

		const url = `../TaskServices/api/services/task/`

		try {
			const response = await fetch(url + obj.id, { method: "DELETE" })
			try {

				const result = await response.json()

				console.log(result)
			} catch (error) {
				console.log(error)
			}
		} catch (error) {
			console.log(error)
		}

		location.reload();
	}

	async #getStatuses() {

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

	async #updateTask(obj, newstatus) {

		const url = `../TaskServices/api/services/task/`
		
		const data = {
			"status": newstatus
		};
		
		const requestOptions = {
			method: 'PUT',
			headers: { "Content-Type": "application/json; charset=utf-8" },
			body: JSON.stringify(data),
			cache: "no-cache",
			redirect: "error"
		};

		try {
			const response = await fetch(url + obj.id, requestOptions)
			try {
				location.reload();
			} catch (error) {
				console.log(error)
			}
		} catch (error) {
			console.log(error)
		}

		//location.reload();
	}









}