import { Priorities, Priority } from "@workspace/shared-types";

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case Priorities.low:
      return "bg-priority-low/10 text-priority-low";
    case Priorities.medium:
      return "bg-priority-medium/10 text-priority-medium";
    case Priorities.high:
      return "bg-priority-high/10 text-priority-high";
  }
};

const getPriorityLabel = (priority: Priority) => {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
};

export { getPriorityColor, getPriorityLabel };
