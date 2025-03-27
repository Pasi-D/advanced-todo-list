import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import { Check, Edit, MoreHorizontal, Trash, X } from "lucide-react";

interface TaskActionsDropdownProps {
  isTaskCompleted: boolean;
  onToggleCompletion: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskActionsDropdown = ({
  isTaskCompleted,
  onDelete,
  onEdit,
  onToggleCompletion,
}: TaskActionsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="task-action-button dark:text-white text-black"
        >
          <MoreHorizontal size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={onToggleCompletion}
        >
          {isTaskCompleted ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Mark as incomplete
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Mark as complete
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={onEdit}>
          <Edit className="w-4 h-4 mr-2" />
          Edit task
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onDelete}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <Trash className="w-4 h-4 mr-2" />
          Delete task
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskActionsDropdown;
