import { Router, Request, Response, NextFunction } from "express";
import { Priority, RecurrenceType, Task, TaskFilter, TaskSort } from "@workspace/shared-types";
import TaskService from "../services/task.service";
import { validationResult } from "express-validator";
import { IController } from "../types";

class TaskController implements IController {
  public path = "/task";
  public router = Router();

  private taskService = new TaskService();

  constructor() {
    this.router.get(this.path, this.getAllTasks);
    this.router.post(this.path, this.createTask);
    this.router.put(`${this.path}/:id`, this.updateTask);
    this.router.delete(`${this.path}/:id`, this.deleteTask);
    this.router.get(`${this.path}/search`, this.searchTasks);
  }
  
  /**
   * @swagger
   * /task:
   *   get:
   *     summary: Get all tasks
   *     tags:
   *       - Tasks
   *     responses:
   *       200:
   *         description: A list of tasks
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Task'
   *       500:
   *         description: Internal server error
   */
  private getAllTasks = async (_request: Request, response: Response, _next: NextFunction) => {
    try {
      const tasks = await this.taskService.getAllTasks();
      response.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      response.status(500).json({ error: "Failed to fetch tasks" });
    }
  };

  /**
   * @swagger
   * /task:
   *   post:
   *     summary: Create a new task
   *     tags:
   *       - Tasks
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Task'
   *     responses:
   *       201:
   *         description: Task created successfully
   *       400:
   *         description: Validation error
   *       500:
   *         description: Internal server error
   */
  private createTask = async (request: Request, response: Response, _next: NextFunction) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        response.status(400).json({ errors: errors.array() });
      }

      const {
        title,
        description,
        completed = false,
        priority = "medium",
        recurrence = "none",
        dueDate,
        dependsOn = [],
      } = request.body;

      // Validate dependencies if provided
      if (dependsOn.length > 0) {
        const validation = await this.taskService.validateDependencies("new-task", dependsOn);
        if (!validation.valid) {
          response.status(400).json({ error: validation.reason });
        }
      }

      const newTask = await this.taskService.createTask({
        title,
        description,
        completed,
        priority,
        recurrence,
        dueDate,
        dependsOn,
      });

      response.status(201).json(newTask);
    } catch (error) {
      console.error("Error creating task:", error);
      response.status(500).json({ error: "Failed to create task" });
    }
  };

  /**
   * @swagger
   * /task/{id}:
   *   put:
   *     summary: Update an existing task
   *     tags:
   *       - Tasks
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The task ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Task'
   *     responses:
   *       200:
   *         description: Task updated successfully
   *       400:
   *         description: Validation error
   *       404:
   *         description: Task not found
   *       500:
   *         description: Internal server error
   */
  private updateTask = async (request: Request, response: Response, _next: NextFunction) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        response.status(400).json({ errors: errors.array() });
      }

      const { id } = request.params;

      const updates: Partial<Task> = request.body;

      // If updating dependencies, validate them
      if (updates.dependsOn) {
        const validation = await this.taskService.validateDependencies(id, updates.dependsOn);
        if (!validation.valid) {
          response.status(400).json({ error: validation.reason });
        }
      }

      const updatedTask = await this.taskService.updateTask(id, updates);

      if (!updatedTask) {
        response.status(404).json({ error: "Task not found" });
      }

      response.status(200).json(updatedTask);
    } catch (error) {
      console.error("Error updating task:", error);
      response.status(500).json({ error: "Failed to update task" });
    }
  };

  /**
   * @swagger
   * /task/{id}:
   *   delete:
   *     summary: Delete a task
   *     tags:
   *       - Tasks
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: The task ID
   *     responses:
   *       204:
   *         description: Task deleted successfully
   *       404:
   *         description: Task not found
   *       500:
   *         description: Internal server error
   */
  private deleteTask = async (request: Request, response: Response, _next: NextFunction) => {
    try {
      const { id } = request.params;

      const deleted = await this.taskService.deleteTask(id);

      if (!deleted) {
        response.status(404).json({ error: "Task not found" });
      }

      response.status(204).send();
    } catch (error) {
      console.error("Error deleting task:", error);
      response.status(500).json({ error: "Failed to delete task" });
    }
  };

  /**
   * @swagger
   * /task/search:
   *   get:
   *     summary: Search tasks
   *     tags:
   *       - Tasks
   *     parameters:
   *       - in: query
   *         name: searchTerm
   *         schema:
   *           type: string
   *         description: Search term for task titles or descriptions
   *       - in: query
   *         name: priorities
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *         description: Filter by priorities
   *       - in: query
   *         name: showCompleted
   *         schema:
   *           type: boolean
   *         description: Whether to include completed tasks
   *       - in: query
   *         name: recurrence
   *         schema:
   *           type: string
   *         description: Filter by recurrence type
   *       - in: query
   *         name: sortField
   *         schema:
   *           type: string
   *         description: Field to sort by
   *       - in: query
   *         name: sortDirection
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *         description: Sort direction
   *     responses:
   *       200:
   *         description: A list of tasks matching the search criteria
   *       500:
   *         description: Internal server error
   */
  private searchTasks = async (request: Request, response: Response, _next: NextFunction) => {
    try {
      const {
        searchTerm = "",
        priorities = [],
        showCompleted,
        recurrence,
        sortField = "createdAt",
        sortDirection = "desc",
      } = request.query;

      const prioritiesParam = Array.isArray(priorities)
        ? priorities
        : typeof priorities === "string"
          ? [priorities]
          : [];

      const filter: TaskFilter = {
        searchTerm: searchTerm as string,
        priorities: prioritiesParam as Priority[],
        showCompleted: showCompleted as boolean | undefined,
        recurrence: recurrence as RecurrenceType | undefined,
      };

      const sort: TaskSort = {
        field: sortField as any,
        direction: sortDirection as "asc" | "desc",
      };

      const tasks = await this.taskService.searchTasks(filter, sort);

      response.status(200).json(tasks);
    } catch (error) {
      console.error("Error searching tasks:", error);
      response.status(500).json({ error: "Failed to search tasks" });
    }
  };
}

export default TaskController;
