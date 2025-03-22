import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Button,
  Calendar,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@/components/ui";
import useTaskStore from "@/store/useTaskStore";
import { Priority, RecurrenceType, Task } from "@/types/task";
import { toast } from "sonner";

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
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);

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
        dependsOn: [],
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
    setOpen(false);
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
              autoFocus
            />
          </PopoverContent>
        </Popover>
      </div>
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
