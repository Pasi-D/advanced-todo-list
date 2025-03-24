import TaskModel from "../models/task.model";
import { Recurrences, Task, TaskFilter, TaskSort } from "@workspace/shared-types";

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

  public handleRecurringTasks = async (): Promise<void> => {
    // Fetch all recurring tasks
    const recurringTasks = await this.taskModel.getRecurringTasks();
  
    for (const task of recurringTasks) {
      // Calculate the next due date based on the recurrence type
      const nextDueDate = this.calculateNextDueDate(task.dueDate!, task.recurrence);
  
      // If the next due date is valid and in the past or today, create a new task
      if (nextDueDate && nextDueDate <= new Date()) {
        await this.taskModel.createTask({
          ...task,
          dueDate: nextDueDate,
        });
      }
    }
  };

  // Helper method to calculate the next due date
  private calculateNextDueDate(dueDate: Date, recurrence: string): Date | null {
    const currentDate = new Date(dueDate);

    switch (recurrence) {
      case Recurrences.daily:
        return new Date(currentDate.setDate(currentDate.getDate() + 1));
      case Recurrences.weekly:
        return new Date(currentDate.setDate(currentDate.getDate() + 7));
      case Recurrences.monthly:
        return new Date(currentDate.setMonth(currentDate.getMonth() + 1));
      default:
        return null; // No recurrence
    }
  }
}

export default TaskService;
