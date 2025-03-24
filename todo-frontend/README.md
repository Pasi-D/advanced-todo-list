# Simplify
## Task management, refined

This is the frontend sub repo for the advanced todo list.

> ### Features
- **Add, Delete, Update, and Search Tasks**: Manage tasks with ease.
- **Task Prioritization**: Assign priorities (Low, Medium, High) to tasks.
- **Recurring Tasks**: Create tasks that repeat daily, weekly, or monthly.
- **Task Dependencies**: Define dependencies between tasks (e.g., Task A cannot be completed before Task B).
- **Sorting**: Sort tasks by priority or status.

> ### Pre-Requisites

- Make sure you create a copy of [.env.dist](./.env.dist) & update the API endpoint
```bash
cp .env.dist .env
```

> ### Available Scripts

*Please note these commands are working when navigated to the sub repo directory. You can navigate to [monorepo README](../README.md) to see how to set up and run the entire project, including both the backend and frontend components.*

#### Start the development server

Make sure you have the backend API running first

```bash
yarn dev
```

Open http://localhost:5173 on your browser to see the result.

### Run tests

```bash
yarn test
```
