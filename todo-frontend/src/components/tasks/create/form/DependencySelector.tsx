import { Checkbox, Label, ScrollArea } from "@/components/ui";
import { Task } from "@workspace/shared-types";

interface DependencySelectorProps {
  availableDependencies: Task[];
  selectedDependencies: string[];
  onDependenciesChange: (taskId: string, checked: boolean) => void;
}

const DependencySelector = ({
  availableDependencies,
  selectedDependencies,
  onDependenciesChange,
}: DependencySelectorProps) => {
  return availableDependencies.length > 0 ? (
    <div className="grid gap-2">
      <Label>Dependencies</Label>
      <div className="border rounded-md p-3">
        {availableDependencies.length > 4 ? (
          <ScrollArea className="h-[150px]">
            {availableDependencies.map((task) => (
              <div key={task.id} className="flex items-center space-x-2 py-1">
                <Checkbox
                  id={`dep-${task.id}`}
                  checked={selectedDependencies.includes(task.id)}
                  onCheckedChange={(checked) =>
                    onDependenciesChange(task.id, checked === true)
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
                checked={selectedDependencies.includes(task.id)}
                onCheckedChange={(checked) =>
                  onDependenciesChange(task.id, checked === true)
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
      </div>
    </div>
  ) : (
    <p className="text-sm text-muted-foreground">
      No available tasks to add as dependencies.
    </p>
  );
};

export default DependencySelector;
