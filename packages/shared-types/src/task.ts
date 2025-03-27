import { z } from "zod";
import { generateSchema } from '@anatine/zod-openapi';

export enum Recurrences {
  none = "none",
  daily = "daily",
  weekly = "weekly",
  monthly = "monthly",
}

export enum Priorities {
  low = "low",
  medium = "medium",
  high = "high",
}

export enum SortFields {
  priority = "priority",
  dueDate = "dueDate",
  createdAt = "createdAt",
  completed = "completed",
}

export enum SortDirections {
  asc = "asc",
  desc = "desc",
}

export type Priority = keyof typeof Priorities;

export type RecurrenceType = keyof typeof Recurrences;

const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  completed: z.boolean(),
  priority: z.enum([`${Priorities.low}`, `${Priorities.medium}`, `${Priorities.high}`]),
  createdAt: z.date(),
  updatedAt: z.date(),
  recurrence: z.enum([`${Recurrences.none}`, `${Recurrences.daily}`, `${Recurrences.weekly}`, `${Recurrences.monthly}`]),
  dueDate: z.date().optional(),
  dependsOn: z.array(z.string()),
});

export type Task = z.infer<typeof taskSchema>;

export const TaskOpenApiSchema = generateSchema(taskSchema);

export type SortField = keyof typeof SortFields;
export type SortDirection = keyof typeof SortDirections;

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

export type CreateTaskDto = Omit<Task, "id" | "createdAt" | "updatedAt">;
