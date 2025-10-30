import { useState } from "react";
import type { Task } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Star, Calendar, Clock } from "lucide-react";
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

  const formatDueDate = (date: Date | string) => {
    const dueDate = new Date(date);
    const now = new Date();
    const isOverdue = dueDate < now && !task.completed;
    const isToday = dueDate.toDateString() === now.toDateString();
    
    const dateStr = dueDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: dueDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
    
    const timeStr = dueDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });

    return { dateStr, timeStr, isOverdue, isToday };
  };

  const dueInfo = task.dueDate ? formatDueDate(task.dueDate) : null;

  return (
    <>
      <div 
        className={`group rounded-2xl border p-5 hover-elevate transition-all duration-200 ${
          task.isImportant && !task.completed
            ? "border-secondary/40 bg-gradient-to-br from-secondary/5 to-transparent"
            : ""
        }`}
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
            <div className="flex items-start gap-2 mb-1">
              {task.isImportant && (
                <Star className="h-5 w-5 text-secondary fill-secondary flex-shrink-0 mt-0.5" data-testid={`icon-important-${task.id}`} />
              )}
              <h3 
                className={`font-semibold text-base transition-all duration-200 ${
                  task.completed 
                    ? "line-through opacity-60" 
                    : ""
                }`}
                data-testid={`text-task-title-${task.id}`}
              >
                {task.title}
              </h3>
            </div>
            
            {task.description && (
              <p 
                className={`text-sm mt-1.5 transition-all duration-200 ${
                  task.completed 
                    ? "opacity-40" 
                    : "text-muted-foreground"
                }`}
                data-testid={`text-task-description-${task.id}`}
              >
                {task.description}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-3 mt-3">
              {dueInfo && (
                <Badge 
                  variant={dueInfo.isOverdue ? "destructive" : dueInfo.isToday ? "default" : "secondary"}
                  className="rounded-full text-xs font-medium"
                  data-testid={`badge-due-date-${task.id}`}
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  {dueInfo.dateStr}
                  <Clock className="h-3 w-3 ml-2 mr-1" />
                  {dueInfo.timeStr}
                </Badge>
              )}
              {task.createdAt && (
                <span className="text-xs text-muted-foreground">
                  Created {new Date(task.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>
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
