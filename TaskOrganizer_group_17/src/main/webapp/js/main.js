import TaskList from "../components/task-list.js";
import TaskBox from "../components/task-box.js";
import TaskView from "../components/task-view.js";


customElements.define("task-list", TaskList);
customElements.define("task-box", TaskBox);

// Runs the constructor for TaskView
new TaskView()