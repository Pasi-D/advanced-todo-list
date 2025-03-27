import { useState } from "react";
import { toast } from "sonner";
import { Button, DatePicker, Input, Label } from "@/components/ui";
import useTaskStore from "@/store/useTaskStore";
import {
  CreateTaskDto,
  Priorities,
  Priority,
  RecurrenceType,
  Task,
} from "@workspace/shared-types";
import PrioritySelect from "./form/PrioritySelector";
import RecurrenceSelect from "./form/RecurrenceSelector";
import DependencySelector from "./form/DependencySelector";

interface AddTaskFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  taskToEdit?: Task;
  onSuccess?: () => void;
}

const AddTaskForm = ({ setOpen, taskToEdit, onSuccess }: AddTaskFormProps) => {
  const [title, setTitle] = useState<string>(taskToEdit?.title || "");
  const [description, setDescription] = useState<string>(
    taskToEdit?.description || "",
  );
  const [priority, setPriority] = useState<Priority>(
    taskToEdit?.priority || Priorities.low,
  );
  const [dueDate, setDueDate] = useState<Date | undefined>(taskToEdit?.dueDate);
  const [isRecurring, setIsRecurring] = useState<boolean>(
    taskToEdit?.recurrence !== "none" && !!taskToEdit?.recurrence,
  );
  const [recurringType, setRecurringType] = useState<RecurrenceType>(
    taskToEdit?.recurrence || "none",
  );
  const [dependencies, setDependencies] = useState<string[]>(
    taskToEdit?.dependsOn || [],
  );

  // Field validation states
  const [fieldErrors, setFieldErrors] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);

  // Filter out the current task (if editing) and completed tasks from potential dependencies
  const availableDependencies = tasks.filter(
    (task) => (!taskToEdit || task.id !== taskToEdit.id) && !task.completed,
  );

  const validateForm = () => {
    const newErrors = {
      title: "",
      description: "",
      dueDate: "",
    };

    if (title.trim() === "") {
      newErrors.title = "Title is required.";
    }

    if (description.trim() === "") {
      newErrors.description = "Description is required.";
    }

    if (!dueDate) {
      newErrors.dueDate = "Due date is required.";
    }

    setFieldErrors(newErrors);

    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate,
        recurrence: isRecurring ? recurringType : "none",
        dependsOn: dependencies,
      });
      toast.success("Task updated successfully");
      if (onSuccess) onSuccess();
    } else {
      const newTask: CreateTaskDto = {
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate,
        completed: false,
        recurrence: isRecurring ? recurringType : "none",
        dependsOn: dependencies,
      };

      addTask(newTask);
      toast.success("Task added successfully");
    }

    setTitle("");
    setDescription("");
    setPriority(Priorities.low);
    setDueDate(undefined);
    setIsRecurring(false);
    setRecurringType("none");
    setDependencies([]);
    setOpen(false);
  };

  const handleDependencyChange = (taskId: string, checked: boolean) => {
    if (checked) {
      setDependencies((prev) => [...prev, taskId]);
    } else {
      setDependencies((prev) => prev.filter((id) => id !== taskId));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          id="title"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {fieldErrors.title && (
          <p className="text-red-500 text-sm">{fieldErrors.title}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Input
          type="text"
          id="description"
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {fieldErrors.description && (
          <p className="text-red-500 text-sm">{fieldErrors.description}</p>
        )}
      </div>
      <PrioritySelect priority={priority} onChange={setPriority} />
      <DatePicker
        date={dueDate}
        onChange={setDueDate}
        label="Due Date"
        containerClassName="grid gap-2"
      />
      <DependencySelector
        availableDependencies={availableDependencies}
        selectedDependencies={dependencies}
        onDependenciesChange={handleDependencyChange}
      />
      <RecurrenceSelect
        isRecurring={isRecurring}
        recurringType={recurringType}
        onRecurringChange={setIsRecurring}
        onRecurringTypeChange={setRecurringType}
      />
      <div className="mt-4">
        <Button type="submit">{taskToEdit ? "Update Task" : "Add Task"}</Button>
      </div>
    </form>
  );
};

export default AddTaskForm;
