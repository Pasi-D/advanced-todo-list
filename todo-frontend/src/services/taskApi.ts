import { Task, TaskSort, TaskFilter } from "../types/task";

const API_HOST = import.meta.env.VITE_API_HOST || "http://localhost:3000";

const taskApi = {
  // Get all tasks
  getAllTasks: async (): Promise<Task[]> => {
    const response = await fetch(`${API_HOST}/task`);
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    const data = await response.json();

    // Convert date strings to Date objects
    return data.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    }));
  },

  // Create a new task
  createTask: async (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">,
  ): Promise<Task> => {
    const response = await fetch(`${API_HOST}/task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error("Failed to create task");
    }

    const data = await response.json();
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    };
  },

  // Search and filter tasks
  searchTasks: async (
    filter: Partial<TaskFilter>,
    sort: Partial<TaskSort>,
  ): Promise<Task[]> => {
    // Build query parameters
    const params = new URLSearchParams();

    // Add search parameters
    if (filter.searchTerm) params.append("searchTerm", filter.searchTerm);
    if (filter?.priorities?.length) {
      filter.priorities.forEach((priority) => {
        params.append("priorities", priority);
      });
    }
    if (filter.showCompleted) {
      params.append("showCompleted", String(filter.showCompleted));
    }
    if (filter.recurrence) params.append("recurrence", filter.recurrence);

    // Add sort parameters
    params.append("sortField", sort.field || "createdAt");
    params.append("sortDirection", sort.direction || "desc");

    const response = await fetch(
      `${API_HOST}/task/search?${params.toString()}`,
    );
    if (!response.ok) {
      throw new Error("Failed to search tasks");
    }

    const data = await response.json();

    // Convert date strings to Date objects
    return data.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    }));
  },

  // Update a task
  updateTask: async (
    id: string,
    updates: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Task> => {
    const response = await fetch(`${API_HOST}/task/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Failed to update task");
    }

    const data = await response.json();
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    };
  },

  // Delete a task
  deleteTask: async (id: string): Promise<void> => {
    const response = await fetch(`${API_HOST}/task/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete task");
    }
  },
};

export default taskApi;
