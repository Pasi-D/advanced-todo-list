import { useState } from "react";
import { PlusCircle, Search, SlidersHorizontal, X } from "lucide-react";
import {
  Button,
  Input,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Badge,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  Separator,
} from "@/components/ui";
import {
  Priorities,
  Priority,
  Recurrences,
  TaskSort,
} from "@workspace/shared-types";
import useTaskStore from "@/store/useTaskStore";
import AddTaskForm from "./create";
import { getPriorityColor, getPriorityLabel } from "@/lib/utils";

interface TaskHeaderProps {
  taskCount: number;
}

const TaskHeader = ({ taskCount }: TaskHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const { sort, setSort, filter, setFilter } = useTaskStore();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setFilter({ searchTerm: value });
  };

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
    <div className="mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">
          Tasks{" "}
          <span className="text-lg font-normal text-muted-foreground">
            ({taskCount})
          </span>
        </h1>
        <div className="flex items-center gap-2">
          {showSearch ? (
            <div className="relative flex items-center">
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-64 pr-8"
                autoFocus
              />
              <button
                className="absolute right-2 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setShowSearch(false);
                  handleSearch("");
                }}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setShowSearch(true)}
            >
              <Search size={18} />
            </Button>
          )}

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
                {sort.field === "priority" &&
                  (sort.direction === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("dueDate")}>
                Due date{" "}
                {sort.field === "dueDate" &&
                  (sort.direction === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("createdAt")}>
                Date created{" "}
                {sort.field === "createdAt" &&
                  (sort.direction === "asc" ? "↑" : "↓")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("completed")}>
                Completion status{" "}
                {sort.field === "completed" &&
                  (sort.direction === "asc" ? "↑" : "↓")}
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
                      recurrence: value === "all" ? undefined : (value as any),
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

          <Sheet open={addTaskOpen} onOpenChange={setAddTaskOpen}>
            <SheetTrigger asChild>
              <Button
                className="rounded-full"
                onClick={() => setAddTaskOpen(true)}
              >
                <PlusCircle size={18} className="mr-2" />
                New Task
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Add New Task</SheetTitle>
                <SheetDescription>
                  Create a new task with details and dependencies
                </SheetDescription>
              </SheetHeader>
              <Separator className="my-4" />
              <AddTaskForm open={addTaskOpen} setOpen={setAddTaskOpen} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default TaskHeader;
