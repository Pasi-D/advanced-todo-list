import { useState } from "react";
import { PlusCircle, Search, X } from "lucide-react";
import {
  Button,
  buttonBaseStyles,
  buttonSizes,
  buttonVariants,
  Input,
} from "@/components/ui";
import useTaskStore from "@/store/useTaskStore";
import AddTaskForm from "./create";
import TaskSheet from "./TaskSheet";
import TaskFilters from "./TaskFilters";

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

          <TaskFilters
            sort={sort}
            filter={filter}
            setSort={setSort}
            setFilter={setFilter}
          />

          <TaskSheet
            open={addTaskOpen}
            setOpen={setAddTaskOpen}
            title="Add New Task"
            trigger={
              // Fix for "In HTML, <button> cannot be a descendant of <button>. This will cause a hydration error."
              <span
                className={`${buttonBaseStyles} ${buttonVariants["default"]} ${buttonSizes["default"]} rounded-full`}
                onClick={() => setAddTaskOpen(true)}
              >
                <PlusCircle size={18} className="mr-2" />
                New Task
              </span>
            }
            description="Create a new task with details and dependencies"
          >
            <AddTaskForm open={addTaskOpen} setOpen={setAddTaskOpen} />
          </TaskSheet>
        </div>
      </div>
    </div>
  );
};

export default TaskHeader;
