import { useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  Check,
  Edit,
  MoreHorizontal,
  Repeat,
  Trash,
  X,
  Link,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui";
import useTaskStore from "@/store/useTaskStore";
import { Task } from "@workspace/shared-types";
import { Separator } from "@/components/ui/separator";
import AddTaskForm from "./AddTaskForm";
import { getPriorityColor, getPriorityLabel } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const { toggleTaskCompletion, deleteTask, tasks } = useTaskStore();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editTaskSheet, setEditTaskSheet] = useState(false);
  const [showDependencies, setShowDependencies] = useState(false);

  const dependencies = task.dependsOn
    ? (task.dependsOn
        .map((id) => tasks.find((t) => t.id === id))
        .filter(Boolean) as Task[])
    : [];
  const hasDependencies = dependencies.length > 0;

  const handleToggleCompletion = async () => {
    const success = await toggleTaskCompletion(task.id);
    if (!success) {
      const { blockedBy } = useTaskStore.getState().canCompleteTask(task.id);
      toast.error(
        "Cannot complete this task as it depends on uncompleted tasks",
        {
          description: blockedBy?.map((t) => t.title).join(", "),
        },
      );
      return;
    }

    if (task.completed) {
      toast.success("Task marked as incomplete");
    } else {
      toast.success("Task completed successfully");
    }
  };

  const handleDeleteTask = () => {
    deleteTask(task.id);
    toast.success("Task deleted successfully");
    setConfirmDelete(false);
  };

  const getRecurrenceLabel = () => {
    switch (task.recurrence) {
      case "daily":
        return "Daily";
      case "weekly":
        return "Weekly";
      case "monthly":
        return "Monthly";
      default:
        return null;
    }
  };

  return (
    <>
      <motion.div
        className={`task-item-container ${task.completed ? "task-item-done" : ""}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <div className="task-item">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={task.completed}
              onCheckedChange={handleToggleCompletion}
              className="mt-1"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3
                  className={`font-medium break-words ${task.completed ? "line-through text-muted-foreground" : ""}`}
                >
                  {task.title}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  <Badge
                    className={`priority-badge ${getPriorityColor(task.priority)}`}
                  >
                    {getPriorityLabel(task.priority)}
                  </Badge>

                  {getRecurrenceLabel() && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Repeat size={12} />
                      {getRecurrenceLabel()}
                    </Badge>
                  )}

                  {hasDependencies && (
                    <Badge
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => setShowDependencies(!showDependencies)}
                    >
                      <Link size={12} className="mr-1" />
                      {dependencies.length}{" "}
                      {dependencies.length === 1
                        ? "dependency"
                        : "dependencies"}
                    </Badge>
                  )}
                </div>
              </div>

              {task.description && (
                <p
                  className={`text-sm mt-1 ${task.completed ? "text-muted-foreground" : ""}`}
                >
                  {task.description}
                </p>
              )}

              {showDependencies && hasDependencies && (
                <div className="mt-2 bg-secondary/50 rounded-md p-2">
                  <h4 className="text-xs font-medium mb-1">Dependencies:</h4>
                  <ul className="text-sm space-y-1">
                    {dependencies.map((dep) => (
                      <li key={dep.id} className="flex items-center gap-2">
                        <Checkbox checked={dep.completed} disabled />
                        <span
                          className={
                            dep.completed
                              ? "line-through text-muted-foreground"
                              : ""
                          }
                        >
                          {dep.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {task.dueDate && (
                <div className="flex items-center gap-1 text-muted-foreground text-xs mt-2">
                  <Calendar size={12} />
                  <span>
                    Due {format(new Date(task.dueDate), "MMM d, yyyy")}
                  </span>
                </div>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="task-action-button"
                >
                  <MoreHorizontal size={18} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleToggleCompletion}>
                  {task.completed ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Mark as incomplete
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Mark as complete
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEditTaskSheet(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit task
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setConfirmDelete(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Delete task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {`This will permanently delete the task ${task.title}. This action
              cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="px-4 py-2 rounded-md">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none transition-all"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet open={editTaskSheet} onOpenChange={setEditTaskSheet}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Task</SheetTitle>
            <SheetDescription>
              Update task details and dependencies
            </SheetDescription>
          </SheetHeader>
          <Separator className="my-4" />
          <AddTaskForm
            open={editTaskSheet}
            setOpen={setEditTaskSheet}
            taskToEdit={task}
            onSuccess={() => setEditTaskSheet(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default TaskItem;
