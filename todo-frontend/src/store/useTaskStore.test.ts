import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import {
  CreateTaskDto,
  Priorities,
  Recurrences,
  Task,
  TaskFilter,
  TaskSort,
} from "@workspace/shared-types";
import useTaskStore from "./useTaskStore";

// Mock the taskApi module
jest.mock("../services/taskApi", () => {
  // Define mock tasks
  const mockTasks: Task[] = [
    {
      id: "1",
      title: "Test task 1",
      description: "Test description",
      completed: false,
      priority: "medium",
      createdAt: new Date("2023-01-01"),
      updatedAt: new Date("2023-01-01"),
      recurrence: "none",
      dependsOn: [],
    },
    {
      id: "2",
      title: "Test task 2",
      description: "Test description 2",
      completed: true,
      priority: "high",
      createdAt: new Date("2023-01-02"),
      updatedAt: new Date("2023-01-02"),
      recurrence: Recurrences.daily,
      dependsOn: ["1"],
    },
  ];
  return {
    __esModule: true,
    default: {
      getAllTasks: jest
        .fn<() => Promise<Task[]>>()
        .mockResolvedValue([...mockTasks]),
      createTask: jest.fn<(task: CreateTaskDto) => Promise<Task>>((task) => {
        const newTask: Task = {
          ...task,
          id: "3",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return Promise.resolve(newTask);
      }),
      searchTasks: jest
        .fn<
          (
            filter: Partial<TaskFilter>,
            sort: Partial<TaskSort>,
          ) => Promise<Task[]>
        >()
        .mockImplementation((filter, _sort) => {
          const typedFilter = filter as TaskFilter;
          let filtered = [...mockTasks];

          if (typedFilter.searchTerm) {
            filtered = filtered.filter((task) =>
              task.title
                .toLowerCase()
                .includes(typedFilter.searchTerm.toLowerCase()),
            );
          }

          if (!typedFilter.showCompleted) {
            filtered = filtered.filter((task) => !task.completed);
          }

          if (
            typedFilter.priorities.length > 0 &&
            typedFilter.priorities.length < 3
          ) {
            filtered = filtered.filter((task) =>
              typedFilter.priorities.includes(task.priority),
            );
          }

          return Promise.resolve(filtered);
        }),
      updateTask: jest
        .fn<(id: string, updates: Partial<CreateTaskDto>) => Promise<Task>>()
        .mockImplementation((id, updates) => {
          const taskIndex = mockTasks.findIndex((t) => t.id === id);
          if (taskIndex === -1) {
            return Promise.reject(new Error("Task not found"));
          }

          const updatedTask = {
            ...mockTasks[taskIndex],
            ...updates,
            updatedAt: new Date(),
          };

          mockTasks[taskIndex] = updatedTask;
          return Promise.resolve(updatedTask);
        }),
      deleteTask: jest
        .fn<(id: string) => Promise<void>>()
        .mockImplementation((id) => {
          const taskIndex = mockTasks.findIndex((t) => t.id === id);
          if (taskIndex === -1) {
            return Promise.reject(new Error("Task not found"));
          }

          mockTasks.splice(taskIndex, 1);
          return Promise.resolve();
        }),
    },
  };
});

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
});
