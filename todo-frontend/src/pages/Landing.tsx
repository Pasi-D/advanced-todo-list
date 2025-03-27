import TaskDashboard from "@/components/tasks/TaskDashboard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import ErrorBoundary from "@/components/ErrorBoundary";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <motion.header
        className="py-6 px-6 border-b border-border"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Simplify</h1>
            <p className="text-muted-foreground">Task management, refined</p>
          </div>
          <ThemeToggle />
        </div>
      </motion.header>

      <main className="py-6 px-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <ErrorBoundary>
            <TaskDashboard />
          </ErrorBoundary>
        </motion.div>
      </main>
    </div>
  );
};

export default Landing;
