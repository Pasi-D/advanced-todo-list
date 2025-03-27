import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Repeat, Link } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Badge, Checkbox } from "@/components/ui";
import useTaskStore from "@/store/useTaskStore";
import { Recurrences, Task } from "@workspace/shared-types";
import AddTaskForm from "./create";
import { getPriorityColor, getPriorityLabel } from "@/lib/utils";
import TaskSheet from "./TaskSheet";
import DeleteConfirmDialog from "./TaskDeleteConfirmDialog";
import TaskActionsDropdown from "./TaskActionDropdown";

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
    // Check if the task is a dependency for other tasks
    const dependentTasks = tasks.filter((t) => t.dependsOn?.includes(task.id));
    if (dependentTasks.length > 0) {
      toast.error(
        `Cannot delete this task as it is a dependency for the following tasks: ${dependentTasks
          .map((t) => t.title)
          .join(", ")}`,
      );
      return;
    }

    // Proceed with deletion if no dependencies exist
    deleteTask(task.id);
    toast.success("Task deleted successfully");
    setConfirmDelete(false);
  };

  const getRecurrenceLabel = () => {
    switch (task.recurrence) {
      case Recurrences.daily:
        return "Daily";
      case Recurrences.weekly:
        return "Weekly";
      case Recurrences.monthly:
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
                      className="flex items-center gap-1 text-black dark:text-white"
                    >
                      <Repeat size={12} />
                      {getRecurrenceLabel()}
                    </Badge>
                  )}

                  {hasDependencies && (
                    <Badge
                      variant="outline"
                      className="cursor-pointer text-black dark:text-white"
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
                <div className="flex items-center gap-1 text-muted-foreground text-xs mt-2 dark:text-[#e6e3e3]">
                  <Calendar size={12} />
                  <span>
                    Due {format(new Date(task.dueDate), "MMM d, yyyy")}
                  </span>
                </div>
              )}
            </div>

            <TaskActionsDropdown
              isTaskCompleted={task.completed}
              onToggleCompletion={handleToggleCompletion}
              onEdit={() => setEditTaskSheet(true)}
              onDelete={() => setConfirmDelete(true)}
            />
          </div>
        </div>
      </motion.div>

      <DeleteConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        onConfirm={handleDeleteTask}
        title={task.title}
      />

      <TaskSheet
        open={editTaskSheet}
        setOpen={setEditTaskSheet}
        title="Edit Task"
        description="Update task details and dependencies"
      >
        <AddTaskForm
          open={editTaskSheet}
          setOpen={setEditTaskSheet}
          taskToEdit={task}
          onSuccess={() => setEditTaskSheet(false)}
        />
      </TaskSheet>
    </>
  );
};

export default TaskItem;
