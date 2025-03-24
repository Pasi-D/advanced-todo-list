# Simplify
## Task management, refined

This is the backend sub repo for the advanced todo list.

> ### Features

- Adding, deleting, updating tasks
- Searching and filtering tasks by status, priority
- Handling recurring tasks logic (auto-create at scheduled intervals)
- Enforcing task dependencies (e.g., Task A must be completed before Task B)

Task related data are stored in a `.sqlite` file in `data` directory.

Task recurring logic is handled using cron jobs. Recurring event(s) is/are created every day at midnight.

> ### Available Scripts

*Please note these commands are working when navigated to the sub repo directory. You can navigate to [monorepo README](../README.md) to see how to set up and run the entire project, including both the backend and frontend components.*

#### Start the development server

```bash
yarn dev
```
