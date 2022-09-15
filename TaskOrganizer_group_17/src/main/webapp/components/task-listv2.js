export default class extends HTMLElement {
	#cssfile = "main.css";
	#shadow;
	#statuses;
	#updateTaskCallbacks;
	#deleteTaskCallbacks;
	#addTaskCallbacks
	#changeStatusCallbacks;

	constructor() {
		super();

		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#statuses = new Array();
		this.#updateTaskCallbacks = new Array();
		this.#deleteTaskCallbacks = new Array();
		this.#addTaskCallbacks = new Array()
		this.#changeStatusCallbacks = new Array();


		this.#createLink();
		this.#createHTML();

		this.#shadow.querySelector("span").textContent = "Waiting for server data.";

		const bt = this.#shadow.querySelector("button[type=button]");
		bt.addEventListener("click", this.addTask.bind(this), false);
		bt.disabled = true;
	}

	#createLink() {
		const link = document.createElement("link");

		const path = import.meta.url.match(/.*\//)[0];
		link.href = path.concat(this.#cssfile);
		link.rel = "stylesheet";
		link.type = "text/css";
		this.#shadow.appendChild(link);
		return link;
	}

	#createHTML() {
		const wrapper = document.createElement("div");

		const content = `
		<p><span></span></p>
		
		<button id="newTask" type="button">New Task</button>
		<br>
	
			<table id="listTable">
				<tr>
					<td style="width: 50%;">Task</td>
					<td style="width: 20%;">Status</td>
					<td style="width: 15%;"></td>
					<td style="width: 15%;"></td>
				</tr>
			</table>
	
		
		`;

		wrapper.insertAdjacentHTML("beforeend", content);
		this.#shadow.appendChild(wrapper);

		return wrapper;
	}

	showTask(newtask) {
		this.addTaskToList(newtask);
	}




	addTaskToList(newTask) {
		
		const table = this.#shadow.querySelector("#listTable");

		let row = table.insertRow(1);

		row.insertCell(0).innerText = newTask.title
		row.insertCell(1).innerText = newTask.status

		row.className += "rows"
		row.setAttribute("id", newTask.id)

		/** Modify select list */
		let modifySelect = document.createElement("select");
		modifySelect.setAttribute("id", newTask.id)

		let option = document.createElement("option")
		option.setAttribute("value", "")
		option.textContent = "<Modify>"
		option.setAttribute("selected", "selected")
		option.setAttribute("disabled", "disabled")
		modifySelect.appendChild(option)

		for (let i = 0; i < this.#statuses.length; i++) {
			let option = document.createElement("option")
			option.setAttribute("value", i)
			option.text = this.#statuses[i]
			modifySelect.appendChild(option)
		}

		modifySelect.addEventListener("change", this.modifyStatus.bind(this), false)
		row.insertCell(2).appendChild(modifySelect);

		/** Remove button */
		let removeButton = document.createElement("button")
		removeButton.textContent = "Remove";
		removeButton.setAttribute("id", newTask.id)
		removeButton.addEventListener("click", this.deleteTask.bind(this), true)
		
		row.insertCell(3).appendChild(removeButton);


		
	
		
	}	

	updateTask(id, status) {
		const table = this.#shadow.querySelector("#listTable");
		
		let rows = table.rows

		for (let i = 0; i < rows.length; i++) {
			if (rows[i].id == id) {
				console.log("asdf")
				rows[i].childNodes[1].textContent = status
			}
		}
	}

	

	setStatusesList(list) {
		this.#statuses = list;
	}

	enableAddTask() {
		const bt = this.#shadow.querySelector("button[type=button]");
		bt.disabled = false;
	}

	/**
	 * 
	 * @param {any} method
	 */
	set addTaskCallback(method) {
		this.#addTaskCallbacks.push(method);
	}
	
	addTask(event) {
		this.#addTaskCallbacks.forEach((x) => x(event))
	}

	/**
	 * 
	 * @param {any} method
	 */
	set changeStatusCallback(method) {
		this.#changeStatusCallbacks.push(method);
	}

	modifyStatus(task) {
		let id = task.target.id
		let status = this.#statuses[task.target.value]

		let r = window.confirm("Change status to " + status + "?")
		if (r) {
			this.#changeStatusCallbacks.forEach((x) => x(id, status))
		} else {
			console.log("Cancelled by user.")
		}
	}

	/**
	 * 
	 * @param {any} method
	 */
	set deleteTaskCallback(method) {
		this.#deleteTaskCallbacks.push(method);
	}
	
	deleteTask(object) {
		
		let id = object.target.id
		let confirmation = window.confirm("Do you want to delete this task?")
		if (confirmation){
			
		   this.#deleteTaskCallbacks.forEach((x) => x(id))
	    }else{
		   console.log("User canceled")
	    }
	}
	
	removeTask(id) {
		let index = 1
		const table = this.#shadow.querySelector("#listTable")
		let rows = table.rows


		for (let i = 0; i < rows.length; i++) {

			if (rows[i].id == id) {
				index = i

			}
		}
		table.deleteRow(index);


		//this.noTask()
	}

	noTask() {

	}





}