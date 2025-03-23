import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Button,
  Calendar,
  Checkbox,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@/components/ui";
import useTaskStore from "@/store/useTaskStore";
import { Priority, RecurrenceType, Task } from "@/types/task";

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
    taskToEdit?.priority || "low",
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

  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);

  // Filter out the current task (if editing) and completed tasks from potential dependencies
  const availableDependencies = tasks.filter(
    (task) => (!taskToEdit || task.id !== taskToEdit.id) && !task.completed,
  );

  const priorities = [
    {
      value: "low" as Priority,
      label: "Low",
    },
    {
      value: "medium" as Priority,
      label: "Medium",
    },
    {
      value: "high" as Priority,
      label: "High",
    },
  ];

  const recurringTypes = [
    {
      value: "daily" as RecurrenceType,
      label: "Daily",
    },
    {
      value: "weekly" as RecurrenceType,
      label: "Weekly",
    },
    {
      value: "monthly" as RecurrenceType,
      label: "Monthly",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() === "") {
      toast.error("Title cannot be empty");
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
      const newTask: Omit<Task, "id" | "createdAt" | "updatedAt"> = {
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
    setPriority("low");
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
      </div>
      <div className="grid gap-2">
        <Label htmlFor="priority">Priority</Label>
        <Select
          value={priority}
          onValueChange={(value) => setPriority(value as Priority)}
        >
          <SelectTrigger id="priority">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            {priorities.map((priority) => (
              <SelectItem key={priority.value} value={priority.value}>
                {priority.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label>Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`w-[240px] justify-start text-left font-normal 
                ${!dueDate && "text-muted-foreground"}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Dependencies Section */}
      {availableDependencies.length > 0 && (
        <div className="grid gap-2">
          <Label>Dependencies</Label>
          <div className="border rounded-md p-3">
            {availableDependencies.length > 4 ? (
              <ScrollArea className="h-[150px]">
                {availableDependencies.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center space-x-2 py-1"
                  >
                    <Checkbox
                      id={`dep-${task.id}`}
                      checked={dependencies.includes(task.id)}
                      onCheckedChange={(checked) =>
                        handleDependencyChange(task.id, checked === true)
                      }
                    />
                    <Label
                      htmlFor={`dep-${task.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {task.title}
                    </Label>
                  </div>
                ))}
              </ScrollArea>
            ) : (
              availableDependencies.map((task) => (
                <div key={task.id} className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id={`dep-${task.id}`}
                    checked={dependencies.includes(task.id)}
                    onCheckedChange={(checked) =>
                      handleDependencyChange(task.id, checked === true)
                    }
                  />
                  <Label
                    htmlFor={`dep-${task.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {task.title}
                  </Label>
                </div>
              ))
            )}
            {availableDependencies.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No available tasks to add as dependencies.
              </p>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          id="recurring"
          checked={isRecurring}
          onCheckedChange={setIsRecurring}
        />
        <Label htmlFor="recurring">Recurring</Label>
      </div>
      {isRecurring && (
        <div className="grid gap-2">
          <Label htmlFor="recurringType">Recurring Type</Label>
          <Select
            value={recurringType}
            onValueChange={(value) => setRecurringType(value as RecurrenceType)}
          >
            <SelectTrigger id="recurringType">
              <SelectValue placeholder="Select recurring type" />
            </SelectTrigger>
            <SelectContent>
              {recurringTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="mt-4">
        <Button type="submit">{taskToEdit ? "Update Task" : "Add Task"}</Button>
      </div>
    </form>
  );
};

export default AddTaskForm;
