import { Priority, RecurrenceType } from "../../types/task";

// Sample task data for testing
export const sampleTask = {
  title: "Test Task",
  description: "This is a test task",
  completed: false,
  priority: "medium" as Priority,
  recurrence: "none" as RecurrenceType,
  dependsOn: [],
};

export const createTaskPayload = {
  title: "New Task",
  description: "Task description",
  priority: "high" as Priority,
  completed: false,
  recurrence: "none" as RecurrenceType,
  dependsOn: [],
};

export const updateTaskPayload = {
  title: "Updated Task Title",
  description: "Updated task description",
  priority: "low" as Priority,
  completed: true,
};

// Create multiple tasks with different properties
export const createMultipleTasks = [
  {
    title: "Low Priority Task",
    description: "This is a low priority task",
    priority: "low" as Priority,
    completed: false,
    recurrence: "none" as RecurrenceType,
    dependsOn: [],
  },
  {
    title: "High Priority Task",
    description: "This is a high priority task",
    priority: "high" as Priority,
    completed: false,
    recurrence: "none" as RecurrenceType,
    dependsOn: [],
  },
  {
    title: "Completed Task",
    description: "This is a completed task",
    priority: "medium" as Priority,
    completed: true,
    recurrence: "none" as RecurrenceType,
    dependsOn: [],
  },
  {
    title: "Daily Recurring Task",
    description: "This is a daily recurring task",
    priority: "high" as Priority,
    completed: false,
    recurrence: "daily" as RecurrenceType,
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    dependsOn: [],
  },
];

// Tasks with dependencies
export const tasksWithDependencies = [
  {
    id: "task-1",
    title: "Task 1",
    description: "Dependency task",
    priority: "medium" as Priority,
    completed: false,
    recurrence: "none" as RecurrenceType,
    dependsOn: [],
  },
  {
    id: "task-2",
    title: "Task 2",
    description: "Depends on Task 1",
    priority: "medium" as Priority,
    completed: false,
    recurrence: "none" as RecurrenceType,
    dependsOn: ["task-1"],
  },
];
