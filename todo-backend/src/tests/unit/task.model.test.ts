import TaskModel from "../../models/task.model";
import { createTaskPayload, sampleTask, updateTaskPayload } from "../fixtures/task.fixtures";

describe("TaskModel", () => {
  let taskId: string;

  const taskModel = new TaskModel();

  beforeEach(async () => {
    // Create a test task
    const task = await taskModel.createTask(sampleTask);
    taskId = task.id;
  });

  describe("createTask", () => {
    it("should create a new task", async () => {
      const task = await taskModel.createTask(createTaskPayload);

      expect(task).toHaveProperty("id");
      expect(task.title).toBe(createTaskPayload.title);
      expect(task.description).toBe(createTaskPayload.description);
      expect(task.priority).toBe(createTaskPayload.priority);
      expect(task.completed).toBe(createTaskPayload.completed);
      expect(task.recurrence).toBe(createTaskPayload.recurrence);
      expect(task).toHaveProperty("createdAt");
      expect(task).toHaveProperty("updatedAt");
    });
  });

  describe("getTaskById", () => {
    it("should retrieve a task by ID", async () => {
      const task = await taskModel.getTaskById(taskId);

      expect(task).not.toBeNull();
      expect(task?.id).toBe(taskId);
      expect(task?.title).toBe(sampleTask.title);
    });

    it("should return null for non-existent task ID", async () => {
      const task = await taskModel.getTaskById("non-existent-id");
      expect(task).toBeNull();
    });
  });

  describe("getAllTasks", () => {
    it("should retrieve all tasks", async () => {
      // Create additional task
      await taskModel.createTask(createTaskPayload);

      const tasks = await taskModel.getAllTasks();
      expect(tasks.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("updateTask", () => {
    it("should update a task", async () => {
      const updatedTask = await taskModel.updateTask(taskId, updateTaskPayload);

      expect(updatedTask).not.toBeNull();
      expect(updatedTask?.title).toBe(updateTaskPayload.title);
      expect(updatedTask?.description).toBe(updateTaskPayload.description);
      expect(updatedTask?.priority).toBe(updateTaskPayload.priority);
      expect(updatedTask?.completed).toBe(updateTaskPayload.completed);
    });

    it("should return null when updating non-existent task", async () => {
      const result = await taskModel.updateTask("non-existent-id", updateTaskPayload);
      expect(result).toBeNull();
    });
  });

  describe("deleteTask", () => {
    it("should delete a task", async () => {
      const result = await taskModel.deleteTask(taskId);
      expect(result).toBe(true);

      const deletedTask = await taskModel.getTaskById(taskId);
      expect(deletedTask).toBeNull();
    });

    it("should return false when deleting non-existent task", async () => {
      const result = await taskModel.deleteTask("non-existent-id");
      expect(result).toBe(false);
    });
  });
});
