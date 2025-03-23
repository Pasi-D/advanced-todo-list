export type Priority = "low" | "medium" | "high";

export type RecurrenceType = "none" | "daily" | "weekly" | "monthly";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
  recurrence: RecurrenceType;
  dueDate?: Date;
  dependsOn: string[];
}

export type SortField = "priority" | "dueDate" | "createdAt" | "completed";
export type SortDirection = "asc" | "desc";

export interface TaskSort {
  field: SortField;
  direction: SortDirection;
}

export interface TaskFilter {
  searchTerm: string;
  priorities: Priority[];
  showCompleted: boolean | undefined;
  recurrence?: RecurrenceType;
}
