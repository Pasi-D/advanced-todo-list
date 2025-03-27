import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import {
  CreateTaskDto,
  Priorities,
  Recurrences,
} from "@workspace/shared-types";
import useTaskStore from "./useTaskStore";

// Mock the taskApi module
jest.mock("../services/taskApi");

describe("useTaskStore", () => {
  // Reset the store before each test
  beforeEach(() => {
    useTaskStore.setState({
      tasks: [],
      isLoading: false,
      error: null,
      sort: { field: "createdAt", direction: "desc" },
      filter: {
        searchTerm: "",
        priorities: [Priorities.low, Priorities.medium, Priorities.high],
        showCompleted: true,
      },
    });
  });

  describe("fetchTasks", () => {
    it("should fetch all tasks successfully", async () => {
      await useTaskStore.getState().fetchTasks();

      const { tasks, isLoading, error } = useTaskStore.getState();
      expect(tasks).toHaveLength(2);
      expect(isLoading).toBe(false);
      expect(error).toBeNull();
    });

    it("should use search endpoint when filters are active", async () => {
      const taskApi = (await import("../services/taskApi")).default;
      useTaskStore.setState({
        filter: {
          searchTerm: "test",
          priorities: ["high"],
          showCompleted: false,
        },
      });

      await useTaskStore.getState().fetchTasks();

      expect(taskApi.searchTasks).toHaveBeenCalled();
      expect(taskApi.getAllTasks).not.toHaveBeenCalled();
    });

    it("should handle fetch error", async () => {
      const taskApi = (await import("../services/taskApi")).default;
      (
        taskApi.searchTasks as jest.MockedFunction<() => Promise<never>>
      ).mockRejectedValueOnce(new Error("API error"));

      await useTaskStore.getState().fetchTasks();

      const { tasks, isLoading, error } = useTaskStore.getState();
      expect(tasks).toHaveLength(0);
      expect(isLoading).toBe(false);
      expect(error).toBe("Failed to fetch tasks");
    });
  });

  describe("addTask", () => {
    it("should add a task successfully", async () => {
      const taskApi = (await import("../services/taskApi")).default;

      const newTask: CreateTaskDto = {
        title: "New task",
        description: "Description",
        completed: false,
        priority: Priorities.medium,
        recurrence: Recurrences.none,
        dependsOn: [],
        dueDate: new Date(),
      };

      await useTaskStore.getState().addTask(newTask);

      expect(taskApi.createTask).toHaveBeenCalledWith(newTask);

      const { tasks, isLoading, error } = useTaskStore.getState();
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe("New task");
      expect(isLoading).toBe(false);
      expect(error).toBeNull();
    });

    it("should handle add task error", async () => {
      const taskApi = (await import("../services/taskApi")).default;
      (
        taskApi.createTask as jest.MockedFunction<() => Promise<never>>
      ).mockRejectedValueOnce(new Error("API error"));

      const newTask = {
        title: "New task",
        description: "Description",
        completed: false,
        priority: "medium" as const,
        recurrence: "none" as const,
        dependsOn: [],
      };

      const taskId = await useTaskStore.getState().addTask(newTask);

      const { tasks, isLoading, error } = useTaskStore.getState();
      expect(taskId).toBeNull();
      expect(tasks).toHaveLength(0);
      expect(isLoading).toBe(false);
      expect(error).toBe("Failed to add task");
    });
  });

  describe("updateTask", () => {
    it("should update a task successfully", async () => {
      useTaskStore.setState({
        tasks: [
          {
            id: "1",
            title: "Test task",
            description: "Test description",
            completed: false,
            priority: "medium",
            createdAt: new Date(),
            updatedAt: new Date(),
            recurrence: "none",
            dependsOn: [],
          },
        ],
      });

      await useTaskStore.getState().updateTask("1", { title: "Updated title" });

      const taskApi = (await import("../services/taskApi")).default;
      expect(taskApi.updateTask).toHaveBeenCalledWith("1", {
        title: "Updated title",
      });

      const { tasks, isLoading, error } = useTaskStore.getState();

      expect(tasks[0].title).toBe("Updated title");
      expect(isLoading).toBe(false);
      expect(error).toBeNull();
    });

    it("should handle update task error", async () => {
      const taskApi = (await import("../services/taskApi")).default;
      (
        taskApi.updateTask as jest.MockedFunction<() => Promise<never>>
      ).mockRejectedValueOnce(new Error("API error"));

      const success = await useTaskStore
        .getState()
        .updateTask("1", { title: "Updated title" });

      const { isLoading, error } = useTaskStore.getState();
      expect(success).toBe(false);
      expect(isLoading).toBe(false);
      expect(error).toBe("Failed to update task");
    });
  });

  describe("deleteTask", () => {
    it("should delete a task successfully", async () => {
      useTaskStore.setState({
        tasks: [
          {
            id: "1",
            title: "Test task",
            description: "Test description",
            completed: false,
            priority: "medium",
            createdAt: new Date(),
            updatedAt: new Date(),
            recurrence: "none",
            dependsOn: [],
          },
        ],
      });

      const success = await useTaskStore.getState().deleteTask("1");

      const taskApi = (await import("../services/taskApi")).default;

      expect(taskApi.deleteTask).toHaveBeenCalledWith("1");

      const { tasks, isLoading, error } = useTaskStore.getState();
      expect(success).toBe(true);
      expect(tasks).toHaveLength(0);
      expect(isLoading).toBe(false);
      expect(error).toBeNull();
    });

    it("should handle delete task error", async () => {
      const taskApi = (await import("../services/taskApi")).default;
      (
        taskApi.deleteTask as jest.MockedFunction<() => Promise<never>>
      ).mockRejectedValueOnce(new Error("API error"));

      // Act
      const success = await useTaskStore.getState().deleteTask("1");

      // Assert
      const { isLoading, error } = useTaskStore.getState();
      expect(success).toBe(false);
      expect(isLoading).toBe(false);
      expect(error).toBe("Failed to delete task");
    });
  });
  describe("toggleTaskCompletion", () => {
    it("should not toggle task completion if task is not found", async () => {
      const success = await useTaskStore
        .getState()
        .toggleTaskCompletion("non-existent-id");

      const { tasks } = useTaskStore.getState();
      expect(success).toBe(false);
      expect(tasks).toHaveLength(0);
    });

    it("should not toggle task completion if dependencies are not met", async () => {
      useTaskStore.setState({
        tasks: [
          {
            id: "1",
            title: "Task with dependency",
            description: "This task has unmet dependencies",
            completed: false,
            priority: "medium",
            createdAt: new Date(),
            updatedAt: new Date(),
            recurrence: "none",
            dependsOn: ["2"],
          },
          {
            id: "2",
            title: "Dependency task",
            description: "This task is incomplete",
            completed: false,
            priority: "medium",
            createdAt: new Date(),
            updatedAt: new Date(),
            recurrence: "none",
            dependsOn: [],
          },
        ],
      });

      jest.spyOn(useTaskStore.getState(), "canCompleteTask").mockReturnValue({
        canComplete: false,
        blockedBy: [
          {
            id: "2",
            title: "Dependency task",
            completed: false,
            priority: "medium",
            createdAt: new Date(),
            updatedAt: new Date(),
            recurrence: "none",
            dependsOn: [],
          },
        ],
      });

      const success = await useTaskStore.getState().toggleTaskCompletion("1");

      const { tasks } = useTaskStore.getState();
      expect(success).toBe(false);
      expect(tasks[0].completed).toBe(false);
    });
  });
});
