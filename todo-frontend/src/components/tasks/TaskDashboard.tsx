import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import TaskHeader from "./TaskHeader";
import TaskItem from "./TaskItem";
import useTaskStore from "@/store/useTaskStore";
import { Task } from "@/types/task";

const TaskDashboard = () => {
  const { tasks, isLoading, error, fetchTasks, getFilteredSortedTasks } =
    useTaskStore();

  const [filteredTasks, setFilteredTasks] = useState<Array<Task>>([]);

  const fetchData = useCallback(async () => {
    await fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setFilteredTasks(getFilteredSortedTasks());
  }, [tasks, getFilteredSortedTasks]);

  // Show toast when an error occurs
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive p-4 rounded-md bg-destructive/10 text-center">
        {error}. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TaskHeader taskCount={tasks.length} />
      <div>
        {filteredTasks.length === 0 ? (
          <p className="text-muted-foreground">No tasks found.</p>
        ) : (
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.2 }}
              >
                <TaskItem task={task} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      {isLoading && tasks.length > 0 && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="animate-spin h-5 w-5 text-primary mr-2" />
          <span className="text-sm text-muted-foreground">Updating...</span>
        </div>
      )}
    </div>
  );
};

export default TaskDashboard;
