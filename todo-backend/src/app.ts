import express, { Application as ExpressApplication } from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { IController } from "./types";
import { initDatabase } from "./config/database.config";
import swaggerOptions from "./config/swagger.config";

const PORT = 3000;

class App {
  public app: ExpressApplication;

  constructor(controllers: IController[]) {
    this.app = express();
    this.initializeMiddleware();
    this.initializeSwagger();
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

  private initializeSwagger() {
    const swaggerSpec = swaggerJSDoc(swaggerOptions);
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.info(`Swagger documentation available at http://localhost:${PORT}/api-docs 📚`);
  }

  public listen() {
    this.app.listen(PORT, () => {
      console.log(`Advanced TODO API listening on port ${PORT} 🚀`);
    });
  }
}

export default App;
