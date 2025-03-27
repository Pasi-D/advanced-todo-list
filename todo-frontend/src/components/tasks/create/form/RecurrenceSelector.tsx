import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "@/components/ui";
import { Recurrences, RecurrenceType } from "@workspace/shared-types";

interface RecurrenceSelectProps {
  isRecurring: boolean;
  recurringType: RecurrenceType;
  onRecurringChange: (isRecurring: boolean) => void;
  onRecurringTypeChange: (recurringType: RecurrenceType) => void;
}

const RecurrenceSelect = ({
  isRecurring,
  recurringType,
  onRecurringChange,
  onRecurringTypeChange,
}: RecurrenceSelectProps) => {
  const recurringTypes = [
    {
      value: Recurrences.daily,
      label: "Daily",
    },
    {
      value: Recurrences.weekly,
      label: "Weekly",
    },
    {
      value: Recurrences.monthly,
      label: "Monthly",
    },
  ];

  return (
    <>
      <div className="flex items-center space-x-2">
        <Switch
          id="recurring"
          checked={isRecurring}
          onCheckedChange={onRecurringChange}
        />
        <Label htmlFor="recurring">Recurring</Label>
      </div>

      {isRecurring && (
        <div className="grid gap-2">
          <Label htmlFor="recurringType">Recurring Type</Label>
          <Select
            value={recurringType}
            onValueChange={(value) =>
              onRecurringTypeChange(value as RecurrenceType)
            }
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
    </>
  );
};

export default RecurrenceSelect;
