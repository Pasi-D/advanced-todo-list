import { ReactNode } from "react";
import {
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui";

interface TaskSheetProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description: string;
  trigger?: ReactNode;
  children: ReactNode;
}

const TaskSheet = ({
  open,
  setOpen,
  title,
  description,
  trigger,
  children,
}: TaskSheetProps) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {trigger && <SheetTrigger>{trigger}</SheetTrigger>}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />
        {children}
      </SheetContent>
    </Sheet>
  );
};

export default TaskSheet;
