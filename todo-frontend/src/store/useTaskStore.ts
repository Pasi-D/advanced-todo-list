import { create } from "zustand";
import taskApi from "@/services/taskApi";
import { Task, TaskSort, TaskFilter } from "@workspace/shared-types";

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  sort: TaskSort;
  filter: TaskFilter;
  fetchTasks: (
    filter?: Partial<TaskFilter>,
    sort?: Partial<TaskSort>,
  ) => Promise<void>;
  addTask: (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">,
  ) => Promise<string | null>;
  updateTask: (
    id: string,
    updates: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>,
  ) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  toggleTaskCompletion: (id: string) => Promise<boolean>;
  setSort: (sort: TaskSort) => void;
  setFilter: (filter: Partial<TaskFilter>) => void;
  getFilteredSortedTasks: () => Task[];
  getDependencyChain: (taskId: string) => Task[];
  canCompleteTask: (taskId: string) => {
    canComplete: boolean;
    blockedBy?: Task[];
  };
}

const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  sort: { field: "createdAt", direction: "desc" },
  filter: {
    searchTerm: "",
    priorities: ["low", "medium", "high"],
    showCompleted: undefined,
  },

  fetchTasks: async (filter = get().filter, sort = get().sort) => {
    set({ isLoading: true, error: null });
    try {

      const tasks = await taskApi.searchTasks(filter, sort);

      set({ tasks, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      set({ error: "Failed to fetch tasks", isLoading: false });
    }
  },

  addTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const newTask = await taskApi.createTask(taskData);

      set((state) => ({
        tasks: [newTask, ...state.tasks],
        isLoading: false,
      }));

      return newTask.id;
    } catch (error) {
      console.error("Failed to add task:", error);
      set({ error: "Failed to add task", isLoading: false });
      return null;
    }
  },

  updateTask: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updatedTask = await taskApi.updateTask(id, updates);

      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
        isLoading: false,
      }));

      return true;
    } catch (error) {
      console.error("Failed to update task:", error);
      set({ error: "Failed to update task", isLoading: false });
      return false;
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await taskApi.deleteTask(id);

      // Remove the task locally and update dependencies
      set((state) => {
        const updatedTasks = state.tasks.map((task) => {
          if (task.dependsOn.includes(id)) {
            return {
              ...task,
              dependsOn: task.dependsOn.filter((depId) => depId !== id),
              updatedAt: new Date(),
            };
          }
          return task;
        });

        return {
          tasks: updatedTasks.filter((task) => task.id !== id),
          isLoading: false,
        };
      });

      return true;
    } catch (error) {
      console.error("Failed to delete task:", error);
      set({ error: "Failed to delete task", isLoading: false });
      return false;
    }
  },

  toggleTaskCompletion: async (id) => {
    const { canComplete, blockedBy } = get().canCompleteTask(id);
    const task = get().tasks.find((t) => t.id === id);

    if (!canComplete && task && !task.completed) {
      return false;
    }

    set({ isLoading: true, error: null });
    try {
      // Get the current completion status, then toggle it
      const updatedTask = await taskApi.updateTask(id, {
        completed: !task?.completed,
      });

      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === id ? updatedTask : task)),
        isLoading: false,
      }));

      return true;
    } catch (error) {
      console.error("Failed to toggle task completion:", error);
      set({ error: "Failed to toggle task completion", isLoading: false });
      return false;
    }
  },

  setSort: (sort) => {
    set({ sort });
    const { filter } = get();
    get().fetchTasks(filter, sort);
  },

  setFilter: (filter) => {
    set((state) => ({ filter: { ...state.filter, ...filter } }));
    const { sort } = get();
    get().fetchTasks(filter, sort);
  },

  getFilteredSortedTasks: () => {
    const { tasks } = get();
    return tasks;
  },

  getDependencyChain: (taskId) => {
    const { tasks } = get();
    const result: Task[] = [];

    const findDependencies = (id: string) => {
      const dependsOn = tasks.find((t) => t.id === id)?.dependsOn || [];

      for (const depId of dependsOn) {
        const task = tasks.find((t) => t.id === depId);
        if (task && !result.some((t) => t.id === task.id)) {
          result.push(task);
          findDependencies(depId);
        }
      }
    };

    findDependencies(taskId);
    return result;
  },

  canCompleteTask: (taskId) => {
    const dependencies = get().getDependencyChain(taskId);
    const uncompletedDeps = dependencies.filter((task) => !task.completed);

    return {
      canComplete: uncompletedDeps.length === 0,
      blockedBy: uncompletedDeps.length > 0 ? uncompletedDeps : undefined,
    };
  },
}));

export default useTaskStore;
