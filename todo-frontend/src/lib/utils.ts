import { Priority } from "@workspace/shared-types";

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case "low":
      return "bg-priority-low/10 text-priority-low";
    case "medium":
      return "bg-priority-medium/10 text-priority-medium";
    case "high":
      return "bg-priority-high/10 text-priority-high";
  }
};

const getPriorityLabel = (priority: Priority) => {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

export { getPriorityColor, getPriorityLabel };
