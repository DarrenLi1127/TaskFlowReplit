import { useState } from "react";
import type { Task } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TaskItemProps {
  task: Task;
  onToggle: (completed: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div 
        className="group rounded-md border p-4 hover-elevate transition-all duration-200"
        data-testid={`task-item-${task.id}`}
      >
        <div className="flex items-start gap-4">
          <Checkbox
            checked={task.completed}
            onCheckedChange={(checked) => onToggle(!!checked)}
            className="mt-0.5 flex-shrink-0"
            data-testid={`checkbox-task-${task.id}`}
          />
          
          <div className="flex-1 min-w-0">
            <h3 
              className={`font-medium transition-all duration-200 ${
                task.completed 
                  ? "line-through opacity-60" 
                  : ""
              }`}
              data-testid={`text-task-title-${task.id}`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p 
                className={`text-sm mt-1 transition-all duration-200 ${
                  task.completed 
                    ? "opacity-40" 
                    : "text-muted-foreground"
                }`}
                data-testid={`text-task-description-${task.id}`}
              >
                {task.description}
              </p>
            )}
            {task.createdAt && (
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(task.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              data-testid={`button-edit-task-${task.id}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteDialog(true)}
              data-testid={`button-delete-task-${task.id}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete();
                setShowDeleteDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
