import {
  CreateTaskDto,
  Recurrences,
  Task,
  TaskFilter,
  TaskSort,
} from "@workspace/shared-types";

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

const taskApi = {
  getAllTasks: jest.fn().mockResolvedValue([...mockTasks]),
  createTask: jest.fn((task: CreateTaskDto) => {
    const newTask: Task = {
      ...task,
      id: "3",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return Promise.resolve(newTask);
  }),
  searchTasks: jest
    .fn()
    .mockImplementation(
      (filter: Partial<TaskFilter>, sort: Partial<TaskSort>) => {
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
      },
    ),
  updateTask: jest
    .fn()
    .mockImplementation((id: string, updates: Partial<CreateTaskDto>) => {
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
  deleteTask: jest.fn().mockImplementation((id: string) => {
    const taskIndex = mockTasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      return Promise.reject(new Error("Task not found"));
    }

    mockTasks.splice(taskIndex, 1);
    return Promise.resolve();
  }),
};

export default taskApi;
