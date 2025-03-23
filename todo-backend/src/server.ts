import App from "./app";
import TaskController from "./controllers/task.controller";

const app = new App([new TaskController()]);

app.listen();
