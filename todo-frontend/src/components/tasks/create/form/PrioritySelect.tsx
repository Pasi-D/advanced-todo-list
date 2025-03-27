import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { Priorities, Priority } from "@workspace/shared-types";

interface PrioritySelectProps {
  priority: Priority;
  onChange: (value: Priority) => void;
}

const PrioritySelect = ({ priority, onChange }: PrioritySelectProps) => {
  const priorities = [
    {
      value: Priorities.low,
      label: "Low",
    },
    {
      value: Priorities.medium,
      label: "Medium",
    },
    {
      value: Priorities.high,
      label: "High",
    },
  ];

  return (
    <div className="grid gap-2">
      <Label htmlFor="priority">Priority</Label>
      <Select
        value={priority}
        onValueChange={(value) => onChange(value as Priority)}
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
  );
};

export default PrioritySelect;
