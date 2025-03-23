import { Router, Request, Response, NextFunction } from "express";
import { IController } from "../types";

class TaskController implements IController {
  public path = "/task";
  public router = Router();

  constructor() {
    this.router.get(this.path, this.getAllTasks);
  }

  private getAllTasks = (_request: Request, _response: Response, _next: NextFunction) => {};
}

export default TaskController;
