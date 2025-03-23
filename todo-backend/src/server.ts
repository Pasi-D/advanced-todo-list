import App from "./app";
import TaskController from "./controllers/taskController";

const app = new App([new TaskController()]);

app.listen();
