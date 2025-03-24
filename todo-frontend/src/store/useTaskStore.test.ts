import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";
import { Task, TaskFilter } from "@workspace/shared-types";
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
      recurrence: "daily",
      dependsOn: ["1"],
    },
  ];
  return {
    __esModule: true,
    default: {
      getAllTasks: jest
        .fn<() => Promise<Task[]>>()
        .mockResolvedValue([...mockTasks]),
      searchTasks: jest.fn().mockImplementation((filter: unknown) => {
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
        priorities: ["low", "medium", "high"],
        showCompleted: true,
      },
    });

    // Clear all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
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
  });
});
