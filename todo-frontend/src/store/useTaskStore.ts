import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Task, TaskSort, TaskFilter } from "../types/task";

interface TaskState {
  tasks: Task[];
  sort: TaskSort;
  filter: TaskFilter;
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => string;
  updateTask: (
    id: string,
    updates: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>,
  ) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => boolean;
  setSort: (sort: TaskSort) => void;
  setFilter: (filter: Partial<TaskFilter>) => void;
  getFilteredSortedTasks: () => Task[];
  getDependencyChain: (taskId: string) => Task[];
  canCompleteTask: (taskId: string) => {
    canComplete: boolean;
    blockedBy?: Task[];
  };
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      sort: { field: "createdAt", direction: "desc" },
      filter: {
        searchTerm: "",
        priorities: ["low", "medium", "high"],
        showCompleted: true,
      },

      addTask: (taskData) => {
        const id = generateId();
        const newTask: Task = {
          id,
          ...taskData,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          tasks: [newTask, ...state.tasks],
        }));

        return id;
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date() }
              : task,
          ),
        }));
      },

      deleteTask: (id) => {
        // Check if any tasks depend on this one and remove the dependency
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
          };
        });
      },

      toggleTaskCompletion: (id) => {
        const { canComplete, blockedBy } = get().canCompleteTask(id);
        const task = get().tasks.find((t) => t.id === id);

        if (!canComplete && task && !task.completed) {
          return false;
        }

        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, completed: !task.completed, updatedAt: new Date() }
              : task,
          ),
        }));

        return true;
      },

      setSort: (sort) => {
        set({ sort });
      },

      setFilter: (filter) => {
        set((state) => ({ filter: { ...state.filter, ...filter } }));
      },

      getFilteredSortedTasks: () => {
        const { tasks, sort, filter } = get();

        const filtered = tasks.filter((task) => {
          const matchesSearch = filter.searchTerm
            ? task.title.toLowerCase().includes(filter.searchTerm.toLowerCase())
            : true;

          const matchesPriority = filter.priorities.includes(task.priority);
          const matchesCompletion = filter.showCompleted || !task.completed;
          const matchesRecurrence = filter.recurrence
            ? task.recurrence === filter.recurrence
            : true;

          return (
            matchesSearch &&
            matchesPriority &&
            matchesCompletion &&
            matchesRecurrence
          );
        });

        return filtered.sort((a, b) => {
          const field = sort.field;
          const direction = sort.direction === "asc" ? 1 : -1;

          if (field === "priority") {
            const priorityOrder = { high: 2, medium: 1, low: 0 };
            return (
              direction *
              (priorityOrder[b.priority] - priorityOrder[a.priority])
            );
          }

          if (field === "completed") {
            return direction * (Number(a.completed) - Number(b.completed));
          }

          if (field === "dueDate") {
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return direction;
            if (!b.dueDate) return -direction;
            return direction * (a.dueDate.getTime() - b.dueDate.getTime());
          }

          if (field === "createdAt") {
            return direction * (a.createdAt.getTime() - b.createdAt.getTime());
          }

          return 0;
        });
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
    }),
    {
      name: "task-storage",
      partialize: (state) => ({ tasks: state.tasks }),
      // Convert date strings back to Date objects when hydrating from storage
      onRehydrateStorage: () => (state) => {
        if (state && state.tasks) {
          state.tasks = state.tasks.map((task) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            updatedAt: new Date(task.updatedAt),
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          }));
        }
      },
    },
  ),
);

export default useTaskStore;
