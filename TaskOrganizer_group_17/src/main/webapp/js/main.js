import TaskList from "../components/task-list.js";
import TaskBox from "../components/task-box.js";
import TaskView from "../components/task-view.js";
import AjaxHandler from "../components/ajax-handler.js";

customElements.define("task-list", TaskList);
customElements.define("task-box", TaskBox);


// All task list elements in html
const allLists = document.querySelectorAll('task-list');

// All task box elements in html
const allBoxes = document.querySelectorAll('task-box');

// Runs the constructor for TaskView
new TaskView(allLists, allBoxes, new AjaxHandler())

