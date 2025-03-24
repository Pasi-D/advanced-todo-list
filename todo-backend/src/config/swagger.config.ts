import { Options } from "swagger-jsdoc";
import { TaskOpenApiSchema } from "@workspace/shared-types";

const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo App API",
      version: "1.0.0",
      description: "API documentation for the TODO app backend",
    },
    components: {
      schemas: {
        Task: TaskOpenApiSchema,
      },
    },
    servers: [
      {
        url: "http://localhost:3000", // Replace with your server URL
      },
    ],
  },
  apis: ["./src/controllers/*.ts"], // Path to the API docs
};

export default swaggerOptions;
