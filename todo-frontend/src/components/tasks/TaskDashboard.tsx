import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui";
import TaskHeader from "./TaskHeader";
import TaskItem from "./TaskItem";
import useTaskStore from "@/store/useTaskStore";
import { Task } from "@workspace/shared-types";
import ErrorDisplay from "../ErrorDisplay";

const ITEMS_PER_PAGE = 5;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const TaskDashboard = () => {
  const { tasks, isLoading, error, fetchTasks, getFilteredSortedTasks } =
    useTaskStore();

  const [filteredTasks, setFilteredTasks] = useState<Array<Task>>([]);
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredTasks.length);
  const currentTasks = filteredTasks.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationLinks = () => {
    const links = [];
    const maxVisiblePages = 3;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add ellipsis if there are pages before the visible range
    if (startPage > 1) {
      links.push(
        <PaginationItem key="start-ellipsis">
          <span className="pagination-ellipsis">...</span>
        </PaginationItem>,
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      links.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    // Add ellipsis if there are pages after the visible range
    if (endPage < totalPages) {
      links.push(
        <PaginationItem key="end-ellipsis">
          <span className="pagination-ellipsis">...</span>
        </PaginationItem>,
      );
    }

    return links;
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay message={error} onRetry={() => window.location.reload()} />
    );
  }

  return (
    <div className="space-y-6">
      <TaskHeader taskCount={tasks.length} />
      <div>
        {filteredTasks.length === 0 ? (
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            No tasks found.
          </motion.p>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {currentTasks.map((task, index) => (
              <motion.div
                key={task.id}
                variants={itemVariants}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
              >
                <TaskItem task={task} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {filteredTasks.length > ITEMS_PER_PAGE && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  aria-disabled={currentPage === 1}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {renderPaginationLinks()}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  aria-disabled={currentPage === totalPages}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </motion.div>
      )}

      {isLoading && tasks.length > 0 && (
        <motion.div
          className="flex justify-center items-center py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Loader2 className="animate-spin h-5 w-5 text-primary mr-2" />
          <span className="text-sm text-muted-foreground">Updating...</span>
        </motion.div>
      )}
    </div>
  );
};

export default TaskDashboard;
