import { db } from "../config/database";
import { v4 as uuidv4 } from "uuid";
import { Priority, RecurrenceType, Task, TaskFilter, TaskSort } from "@workspace/shared-types";

class TaskModel {
  public getAllTasks = async (): Promise<Task[]> => {
    const stmt = db.prepare("SELECT * FROM tasks");
    const tasks = stmt.all();

    return tasks.map(this.mapTaskFromDb);
  };

  public createTask = async (task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> => {
    const now = new Date();
    const id = uuidv4();

    const dependsOnStr = JSON.stringify(task.dependsOn || []);

    const stmt = db.prepare(`
      INSERT INTO tasks (id, title, description, completed, priority, createdAt, updatedAt, recurrence, dueDate, dependsOn)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      task.title,
      task.description || null,
      task.completed ? 1 : 0,
      task.priority,
      now.toISOString(),
      now.toISOString(),
      task.recurrence || "none",
      task.dueDate ? new Date(task.dueDate).toISOString() : null,
      dependsOnStr,
    );

    return {
      id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      priority: task.priority,
      createdAt: now,
      updatedAt: now,
      recurrence: task.recurrence || "none",
      dueDate: task.dueDate,
      dependsOn: task.dependsOn || [],
    };
  };

  public getTaskById = async (id: string): Promise<Task | null> => {
    const stmt = db.prepare("SELECT * FROM tasks WHERE id = ?");

    const task = stmt.get(id);

    return task ? this.mapTaskFromDb(task) : null;
  };

  public updateTask = async (
    id: string,
    updates: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>,
  ) => {
    const task = this.getTaskById(id);

    if (!task) {
      throw new Error("Task not found");
    }

    const now = new Date();

    // Create an array to hold the parts of the SET clause
    const setClauses = [];
    const params = [];

    if (updates.title !== undefined) {
      setClauses.push("title = ?");
      params.push(updates.title);
    }

    if (updates.description !== undefined) {
      setClauses.push("description = ?");
      params.push(updates.description || null);
    }

    if (updates.completed !== undefined) {
      setClauses.push("completed = ?");
      params.push(updates.completed ? 1 : 0);
    }

    if (updates.priority !== undefined) {
      setClauses.push("priority = ?");
      params.push(updates.priority);
    }

    if (updates.recurrence !== undefined) {
      setClauses.push("recurrence = ?");
      params.push(updates.recurrence);
    }

    if (updates.dueDate !== undefined) {
      setClauses.push("dueDate = ?");
      params.push(updates.dueDate ? new Date(updates.dueDate).toISOString() : null);
    }

    if (updates.dependsOn !== undefined) {
      setClauses.push("dependsOn = ?");
      params.push(JSON.stringify(updates.dependsOn));
    }

    // Always update the updatedAt field
    setClauses.push("updatedAt = ?");
    params.push(now.toISOString());

    // Add the id to the params array for the WHERE clause
    params.push(id);

    if (setClauses.length > 0) {
      const stmt = db.prepare(`
        UPDATE tasks
        SET ${setClauses.join(", ")}
        WHERE id = ?
      `);

      stmt.run(...params);
    }

    return this.getTaskById(id);
  };

  public deleteTask = async (id: string) => {
    const stmt = db.prepare("DELETE FROM tasks WHERE id = ?");
    const result = stmt.run(id);

    return result.changes > 0;
  };

  public getDependentTasks = async (taskId: string): Promise<Task[]> => {
    const stmt = db.prepare(`
      SELECT * FROM tasks 
      WHERE dependsOn LIKE ?
    `);

    const tasks = stmt.all(`%${taskId}%`);

    return tasks.map(this.mapTaskFromDb).filter((task) => {
      return task.dependsOn.includes(taskId);
    });
  };

  public searchTasks = async (filter: TaskFilter, sort?: TaskSort): Promise<Task[]> => {
    let query = "SELECT * FROM tasks WHERE 1=1";
    const params: any[] = [];

    // Apply filters
    if (filter.searchTerm) {
      query += " AND (LOWER(title) LIKE ? OR LOWER(description) LIKE ?)";
      const searchPattern = `%${filter.searchTerm.toLowerCase()}%`;
      params.push(searchPattern, searchPattern);
    }

    if (filter.priorities && filter.priorities.length > 0) {
      query += " AND priority IN (" + filter.priorities.map(() => "?").join(",") + ")";
      params.push(...filter.priorities);
    }

    if (filter.showCompleted !== undefined) {
      query += " AND completed = ?";
      params.push(filter.showCompleted ? 1 : 0);
    }

    if (filter.recurrence) {
      query += " AND recurrence = ?";
      params.push(filter.recurrence);
    }

    if (sort) {
      const orderDirection = sort.direction.toUpperCase();

      switch (sort.field) {
        case "priority":
          // Custom priority order: high, medium, low
          query += ` ORDER BY CASE priority 
                     WHEN 'high' THEN 1 
                     WHEN 'medium' THEN 2 
                     WHEN 'low' THEN 3 
                     END`;
          if (orderDirection === "DESC") {
            query += " DESC";
          }
          break;
        case "dueDate":
          query += " ORDER BY dueDate";
          if (orderDirection === "DESC") {
            query += " DESC";
          }
          // Place NULL values at the end
          query += " NULLS LAST";
          break;
        case "completed":
          query += " ORDER BY completed";
          if (orderDirection === "DESC") {
            query += " DESC";
          }
          break;
        case "createdAt":
        default:
          query += " ORDER BY createdAt";
          if (orderDirection === "DESC") {
            query += " DESC";
          }
      }
    } else {
      // Default sort by createdAt desc if no sort specified
      query += " ORDER BY createdAt DESC";
    }

    const stmt = db.prepare(query);
    const tasks = stmt.all(...params);

    return tasks.map(this.mapTaskFromDb);
  };

  private mapTaskFromDb = (dbTask: any): Task => {
    let dependsOn: string[] = [];

    try {
      dependsOn = dbTask.dependsOn ? JSON.parse(dbTask.dependsOn) : [];
    } catch (e) {
      // If parsing fails, use empty array
      console.error("Error parsing dependsOn field:", e);
    }

    return {
      id: dbTask.id,
      title: dbTask.title,
      description: dbTask.description || undefined,
      completed: Boolean(dbTask.completed),
      priority: dbTask.priority as Priority,
      createdAt: new Date(dbTask.createdAt),
      updatedAt: new Date(dbTask.updatedAt),
      recurrence: dbTask.recurrence as RecurrenceType,
      dueDate: dbTask.dueDate ? new Date(dbTask.dueDate) : undefined,
      dependsOn,
    };
  };
}

export default TaskModel;
