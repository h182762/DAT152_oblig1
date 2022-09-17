export default class extends HTMLElement {
	#cssfile = "./modal.css";
	#shadow;
	#statuses;
	#newTaskCallbacks;
		
	constructor() {
		super();

		this.#shadow = this.attachShadow({ mode: "closed" });
		
		this.#statuses = new Array();
		this.#newTaskCallbacks = new Array();

		this.#createLink();
		this.#createHTML();
		
		let modal = this.#shadow.querySelector("#myModal");
		modal.style.display = "none";
		
		let form = this.#shadow.querySelector("#form");
		form.addEventListener("submit", this.submit)
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
		<div id="myModal" class="modal">

		  <div id="taskBox" class="modal-content">
		    <span id="close" class="close">&times;</span>
		    <form id="form">
		    
		    <label for="title">Title:</label>
		    <input id="title" name="title" type="text"></input>
		    <br>
		     
		    <label for="status">Status:</label>
		    
		    </form>
		  </div>
		
		</div>
		`;
		
		wrapper.insertAdjacentHTML("beforeend", content);
		this.#shadow.appendChild(wrapper);

		return wrapper;
	}

	show() {
		let modal = this.#shadow.querySelector("#myModal");
		modal.style.display = "block";
	}
	
	submitEvent(event) {
		event.preventDefault();
		let title = event.target.title.value;
		let status = event.target.status.value;
		
		const newtask = {
			"title": title,
			"status": status
		};
		
		this.#newTaskCallbacks.forEach((x) => x(newtask))
		this.close();
	}
	
	closeEvent() {
		this.close();
	}

	setStatuseslist(list) {
		this.#statuses = list;
		this.#addStatus();
	}

	/**
     * @param {any} callback
     */
	set newTaskCallback(callback) {
		this.#newTaskCallbacks.push(callback);
	}

	close() {
		let modal = this.#shadow.querySelector("#myModal");
		modal.style.display = "none";
		
	}

	#addStatus() {
		let close = this.#shadow.querySelector("#close");
		close.addEventListener("click", this.closeEvent.bind(this));
		
		let div = this.#shadow.querySelector("#form");
		
		let modifySelect = document.createElement("select");
		modifySelect.setAttribute("id", "status");
		let option = document.createElement("option")
		option.setAttribute("value", "")
		option.textContent = "<Modify>"
		option.setAttribute("selected", "selected")
		option.setAttribute("disabled", "disabled")
		modifySelect.appendChild(option)

		for (let i = 0; i < this.#statuses.length; i++) {
			let option = document.createElement("option")
			option.setAttribute("value", this.#statuses[i])
			option.text = this.#statuses[i]
			modifySelect.appendChild(option)
		}
		
		div.appendChild(modifySelect)
		div.appendChild(document.createElement("br"))
		
	    let submit = document.createElement("input");
	    submit.setAttribute("type", "submit");
	    div.appendChild(submit)
	    div.addEventListener("submit", this.submitEvent.bind(this))
	}
}