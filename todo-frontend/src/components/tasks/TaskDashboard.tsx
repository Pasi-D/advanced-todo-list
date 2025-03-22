
import { motion, AnimatePresence } from "framer-motion";
import TaskHeader from "./TaskHeader";
import useTaskStore from "@/store/useTaskStore";
import TaskItem from "./TaskItem";

const TaskDashboard = () => {
  const tasks = useTaskStore((state) => state.tasks);

  return (
    <div className="space-y-6">
      <TaskHeader taskCount={tasks.length} />
      <div>
        {tasks.length === 0 ? (
          <p className="text-muted-foreground">No tasks found.</p>
        ) : (
          <AnimatePresence>
            {tasks.map((task) => (
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
