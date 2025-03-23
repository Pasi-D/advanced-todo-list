import TaskModel from "../models/task.model";
import { Task, TaskFilter, TaskSort } from "../types";

class TaskService {
  public taskModel = new TaskModel();

  public getAllTasks = async () => {
    return await this.taskModel.getAllTasks();
  };

  public createTask = async (task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> => {
    return await this.taskModel.createTask(task);
  };

  public updateTask = async (
    taskId: string,
    updates: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>,
  ) => {
    return await this.taskModel.updateTask(taskId, updates);
  };

  public deleteTask = async (taskId: string) => {
    const dependentTasks = await this.taskModel.getDependentTasks(taskId);
    if (dependentTasks.length > 0) {
      const taskNames = dependentTasks.map((t) => `"${t.title}"`).join(", ");
      throw new Error(`Cannot delete task because it's a dependency for: ${taskNames}`);
    }

    return await this.taskModel.deleteTask(taskId);
  };

  public searchTasks = async (filter: TaskFilter, sort?: TaskSort) => {
    return this.taskModel.searchTasks(filter, sort);
  };

  public validateDependencies = async (
    taskId: string,
    dependsOn: string[],
  ): Promise<{ valid: boolean; reason?: string }> => {
    // Check for circular dependencies
    const visited = new Set();
    const stack: string[] = [...dependsOn];

    while (stack.length > 0) {
      const currentId = stack.pop()!;

      if (currentId === taskId) {
        return { valid: false, reason: "Circular dependency detected" };
      }

      if (!visited.has(currentId)) {
        visited.add(currentId);
        const task = await this.taskModel.getTaskById(currentId);

        if (task && task.dependsOn.length > 0) {
          stack.push(...task.dependsOn);
        }
      }
    }

    // Verify all dependency IDs exist
    for (const depId of dependsOn) {
      const task = this.taskModel.getTaskById(depId);
      if (!task) {
        return { valid: false, reason: `Dependency task with ID ${depId} does not exist` };
      }
    }

    return { valid: true };
  };
}

export default TaskService;
