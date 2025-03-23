import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TaskHeader from "./TaskHeader";
import TaskItem from "./TaskItem";
import useTaskStore from "@/store/useTaskStore";

const TaskDashboard = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const sort = useTaskStore((state) => state.sort);
  const filter = useTaskStore((state) => state.filter);
  const getFilteredSortedTasks = useTaskStore(
    (state) => state.getFilteredSortedTasks,
  );

  const [filteredTasks, setFilteredTasks] = useState<Array<any>>([]);

  useEffect(() => {
    setFilteredTasks(getFilteredSortedTasks());
  }, [tasks, sort, filter, getFilteredSortedTasks]);

  return (
    <div className="space-y-6">
      <TaskHeader taskCount={filteredTasks.length} />
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
    </div>
  );
};

export default TaskDashboard;
