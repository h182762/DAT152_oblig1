import TaskList from "../components/task-listv2.js";
import TaskBox from "../components/task-box.js";
import TaskView from "../components/task-view.js";


customElements.define("task-list", TaskList);
customElements.define("task-box", TaskBox);

new TaskView()