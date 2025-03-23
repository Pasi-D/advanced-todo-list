## 📝 Advanced TODO List Assignment

### Rules:
- Code should be located in a repository (For instance: GitLab) (✅)
- Implement the project using React.js (Frontend) and Node.js | Express (Backend). (✅)
- Use TypeScript for both frontend and backend. (✅)
- Feel free to use any state management library or additional packages. (✅)
- Design your own UI/UX. (✅)
- Demonstrate and reveal all your knowledge in project implementation. (✅)
- Code should follow best practices and include unit tests (⚠️ Unit tests partially done)

### Frontend (React.js + TypeScript)
✅ Implement a TODO list with the following features:
- Users can add, delete, update, and search tasks.
- Each task has a title, status (done/not done), and priority (Low/Medium/High).
- Tasks should be sortable by priority or status. ⭐⭐
- Users can create recurring tasks (daily, weekly, monthly). ⭐⭐⭐
- Users can define dependencies between tasks (e.g., Task A cannot be completed
before Task B). ⭐⭐⭐

### Backend (Node.js + Express + TypeScript)
✅ Implement a REST API to support the frontend, including:
- Adding, deleting, updating tasks.
- Searching and filtering tasks by status, priority. ⭐⭐
- Handling recurring tasks logic (auto-create at scheduled intervals). ⭐⭐⭐
- Enforcing task dependencies (e.g., Task A must be completed before Task B).
⭐⭐⭐

---

> This project uses a [yarn workspace](https://classic.yarnpkg.com/lang/en/docs/workspaces/).

---
### Pre-requisites

- Make sure you have Node JS installed on your environment. Use the node version specified in [./nvmrc]('./nvmrc') file.
- Make sure you have [yarn](https://classic.yarnpkg.com/en/)
- Ensure you have updated the environment variables in `todo-frontend` directory. Refer [Frontend README](./todo-frontend/README.md)

--- 
### Available scripts

> #### Installing dependencies 

```bash
yarn
```

> ### Starting the Advanced TODO API

You can do this in development environment with below command

```bash
yarn api:dev
```

If you want a production version, first build the API

```bash
yarn api:build
```

Then start the build

```bash
yarn api:start
```

> ### Starting the Advanced TODO Frontend

You can do this in development environment with below command

```bash
yarn web:dev
```

You can build a production build using below command

```bash
yarn web:build
```

> ### Running unit tests in backend

You can run the unit tests using

```bash
yarn api:test
```

You can generate coverage report via

```bash
yarn api:test:coverage
```

This will be available within `todo-backend/coverage` directory.