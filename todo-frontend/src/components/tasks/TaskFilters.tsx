import {
  Priorities,
  Priority,
  Recurrences,
  TaskFilter,
  TaskSort,
} from "@workspace/shared-types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  Button,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Checkbox,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Badge,
} from "@/components/ui";
import { SlidersHorizontal } from "lucide-react";
import { getPriorityColor, getPriorityLabel } from "@/lib/utils";

interface TaskFiltersProps {
  sort: TaskSort;
  filter: TaskFilter;
  setSort: (sort: TaskSort) => void;
  setFilter: (filter: Partial<TaskFilter>) => void;
}

const TaskFilters = ({
  sort,
  filter,
  setSort,
  setFilter,
}: TaskFiltersProps) => {
  const handleSort = (field: TaskSort["field"]) => {
    if (sort.field === field) {
      setSort({
        field,
        direction: sort.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSort({
        field,
        direction: "desc",
      });
    }
  };

  const handleTogglePriority = (priority: Priority) => {
    const priorities = [...filter.priorities];

    if (priorities.includes(priority)) {
      if (priorities.length > 1) {
        // Don't allow removing all priorities
        setFilter({ priorities: priorities.filter((p) => p !== priority) });
      }
    } else {
      setFilter({ priorities: [...priorities, priority] });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <SlidersHorizontal size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleSort("priority")}>
          Priority{" "}
          {sort.field === "priority" && (sort.direction === "asc" ? "↑" : "↓")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSort("dueDate")}>
          Due date{" "}
          {sort.field === "dueDate" && (sort.direction === "asc" ? "↑" : "↓")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSort("createdAt")}>
          Date created{" "}
          {sort.field === "createdAt" && (sort.direction === "asc" ? "↑" : "↓")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSort("completed")}>
          Completion status{" "}
          {sort.field === "completed" && (sort.direction === "asc" ? "↑" : "↓")}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Filter by priority</DropdownMenuLabel>
        <div className="flex px-2 py-1 gap-1">
          {[Priorities.low, Priorities.medium, Priorities.high].map(
            (priority) => (
              <Badge
                key={priority}
                className={`cursor-pointer ${getPriorityColor(priority)} ${!filter.priorities.includes(priority) ? "opacity-40" : ""}`}
                onClick={() => handleTogglePriority(priority)}
              >
                {getPriorityLabel(priority)}
              </Badge>
            ),
          )}
        </div>

        <DropdownMenuSeparator />

        <div className="px-2 py-1">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="show-completed"
              checked={filter.showCompleted}
              onCheckedChange={(checked) =>
                setFilter({ showCompleted: checked as boolean })
              }
            />
            <label
              htmlFor="show-completed"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Show completed tasks
            </label>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Filter by recurrence</DropdownMenuLabel>
        <div className="px-2 py-1 mb-1">
          <Select
            value={filter.recurrence || "all"}
            onValueChange={(value) =>
              setFilter({
                recurrence:
                  value === "all" ? undefined : (value as Recurrences),
              })
            }
          >
            <SelectTrigger className="w-full bg-white ring-offset-stone-50">
              <SelectValue placeholder="All tasks" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All tasks</SelectItem>
              <SelectItem value={Recurrences.none}>One-time</SelectItem>
              <SelectItem value={Recurrences.daily}>Daily</SelectItem>
              <SelectItem value={Recurrences.weekly}>Weekly</SelectItem>
              <SelectItem value={Recurrences.monthly}>Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskFilters;
