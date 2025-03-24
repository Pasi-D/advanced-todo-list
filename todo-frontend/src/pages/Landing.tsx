import TaskDashboard from "@/components/tasks/TaskDashboard";
import { ThemeToggle } from "../components/themeToggle";
import { motion } from "framer-motion";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <motion.header
        className="py-6 px-6 border-b border-border"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
        <div className="max-w-4xl mx-auto">
          <TaskDashboard />
        </div>
      </main>
    </div>
  );
};

export default Landing;
