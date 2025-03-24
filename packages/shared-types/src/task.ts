import { z } from "zod";
import { generateSchema } from '@anatine/zod-openapi';

export type Priority = "low" | "medium" | "high";

export type RecurrenceType = "none" | "daily" | "weekly" | "monthly";

const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  completed: z.boolean(),
  priority: z.enum(["low", "medium", "high"]),
  createdAt: z.date(),
  updatedAt: z.date(),
  recurrence: z.enum(["none", "daily", "weekly", "monthly"]),
  dueDate: z.date().optional(),
  dependsOn: z.array(z.string()),
});

export type Task = z.infer<typeof taskSchema>;

export const TaskOpenApiSchema = generateSchema(taskSchema);

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
