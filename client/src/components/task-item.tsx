import { useState } from "react";
import type { Task } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Flag, Calendar } from "lucide-react";
import { format, isPast, isToday, isTomorrow } from "date-fns";
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

const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case "high":
      return {
        badge: "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20",
        icon: "text-destructive",
      };
    case "medium":
      return {
        badge: "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20",
        icon: "text-primary",
      };
    case "low":
      return {
        badge: "bg-muted text-muted-foreground hover:bg-muted/80 border-border",
        icon: "text-muted-foreground",
      };
    default:
      return {
        badge: "bg-muted text-muted-foreground hover:bg-muted/80 border-border",
        icon: "text-muted-foreground",
      };
  }
};

const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case "high":
      return "High";
    case "medium":
      return "Medium";
    case "low":
      return "Low";
    default:
      return "Medium";
  }
};

const getDueDateInfo = (dueDate: Date | string | null | undefined, completed: boolean) => {
  if (!dueDate) return null;
  
  const date = new Date(dueDate);
  const isOverdue = !completed && isPast(date) && !isToday(date);
  const isDueToday = isToday(date);
  const isDueTomorrow = isTomorrow(date);
  
  let label = format(date, "MMM d");
  let className = "text-muted-foreground/70";
  
  if (isOverdue) {
    label = `Overdue (${format(date, "MMM d")})`;
    className = "text-destructive font-semibold";
  } else if (isDueToday) {
    label = "Due today";
    className = "text-primary font-semibold";
  } else if (isDueTomorrow) {
    label = "Due tomorrow";
    className = "text-primary font-medium";
  }
  
  return { label, className, isOverdue, isDueToday };
};

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const priorityStyles = getPriorityStyles(task.priority || "medium");
  const dueDateInfo = getDueDateInfo(task.dueDate, task.completed);

  return (
    <>
      <div 
        className="group rounded-lg border bg-card p-5 hover-elevate transition-all duration-200 shadow-sm hover:shadow-md"
        data-testid={`task-item-${task.id}`}
      >
        <div className="flex items-start gap-4">
          <Checkbox
            checked={task.completed}
            onCheckedChange={(checked) => onToggle(!!checked)}
            className="mt-1 flex-shrink-0"
            data-testid={`checkbox-task-${task.id}`}
          />
          
          <div className="flex-1 min-w-0">
            <h3 
              className={`text-base font-semibold transition-all duration-200 ${
                task.completed 
                  ? "line-through opacity-50 text-muted-foreground" 
                  : "text-foreground"
              }`}
              data-testid={`text-task-title-${task.id}`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p 
                className={`text-sm mt-2 transition-all duration-200 leading-relaxed ${
                  task.completed 
                    ? "opacity-40 line-through" 
                    : "text-muted-foreground"
                }`}
                data-testid={`text-task-description-${task.id}`}
              >
                {task.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Badge 
                variant="outline" 
                className={`${priorityStyles.badge} text-xs font-medium gap-1.5`}
                data-testid={`badge-priority-${task.id}`}
              >
                <Flag className={`h-3 w-3 ${priorityStyles.icon}`} />
                {getPriorityLabel(task.priority || "medium")}
              </Badge>
              {dueDateInfo && (
                <div 
                  className={`flex items-center gap-1.5 text-xs font-medium ${dueDateInfo.className}`}
                  data-testid={`text-due-date-${task.id}`}
                >
                  <Calendar className="h-3 w-3" />
                  {dueDateInfo.label}
                </div>
              )}
              {task.createdAt && (
                <p className="text-xs font-medium text-muted-foreground/70">
                  {new Date(task.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="h-8 w-8"
              data-testid={`button-edit-task-${task.id}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteDialog(true)}
              className="h-8 w-8 text-destructive/70 hover:text-destructive"
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
