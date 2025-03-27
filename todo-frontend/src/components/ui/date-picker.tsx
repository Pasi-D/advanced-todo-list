import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Button,
  Calendar,
  Label,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui";

interface DatePickerProps {
  date: Date | undefined;
  onChange: (date: Date | undefined) => void;
  label?: string;
  containerClassName?: string;
}

const DatePicker = ({
  date,
  label,
  onChange,
  containerClassName,
}: DatePickerProps) => {
  return (
    <div className={containerClassName}>
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={`
                w-full justify-start text-left font-normal
                ${!date && "text-muted-foreground"}
            `}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onChange}
            disabled={(date) => date < new Date()}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { DatePicker };
