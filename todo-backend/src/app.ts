import express, { Application as ExpressApplication } from "express";
import cors from "cors";
import helmet from "helmet";
import { IController } from "./types";
import { initDatabase } from "./config/database";

const PORT = 3000;

class App {
  public app: ExpressApplication;

  constructor(controllers: IController[]) {
    this.app = express();
    this.initializeMiddleware();
    this.initializeDatabase();
    this.initializeControllers(controllers);
  }

  private initializeControllers(controllers: IController[]) {
    for (const controller of controllers) {
      this.app.use("/", controller.router);
    }
  }

  private initializeMiddleware() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeDatabase() {
    initDatabase();
  }

  public listen() {
    this.app.listen(PORT, () => {
      console.log(`Advanced TODO API listening on port ${PORT} 🚀`);
    });
  }
}

export default App;
