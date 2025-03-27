import { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";

interface DatePickerProps {
  date: Date | undefined;
  onChange: (date: Date | undefined) => void;
  label?: string;
  containerClassName?: string;
}

const DatePicker = ({
  date,
  onChange,
  label = "Due Date",
  containerClassName,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle click outside to close the calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle date selection
  const handleSelect = (selectedDate: Date | undefined) => {
    onChange(selectedDate);
    setOpen(false);
  };

  return (
    <div className={containerClassName}>
      <Label>{label}</Label>
      <Button
        ref={buttonRef}
        type="button"
        variant="outline"
        className={`w-full justify-start text-left font-normal ${!date ? "text-muted-foreground" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? format(date, "PPP") : <span>Pick a date</span>}
      </Button>

      {open && (
        <div
          ref={calendarRef}
          className="absolute top-full left-0 z-50 mt-1 bg-white border text-black rounded-md shadow-md w-auto p-0"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            disabled={(date) => date < new Date()}
            initialFocus
          />
        </div>
      )}
    </div>
  );
};

export { DatePicker };
