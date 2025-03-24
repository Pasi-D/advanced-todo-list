import cron from "node-cron";
import TaskService from "../services/task.service";

const taskService = new TaskService();

const initializeScheduler = () => {
    // Runs at every dat midnight (00:00)
  cron.schedule("0 0 * * *", async () => {
    console.log("Running recurring task scheduler...");
    await taskService.handleRecurringTasks();
  });
  console.log("Recurring task scheduler initialized ⏰");
};

export default initializeScheduler;