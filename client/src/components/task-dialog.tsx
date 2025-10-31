import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTaskSchema, type InsertTask, type Task } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Loader2, Flag, CalendarIcon, X } from "lucide-react";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  onSubmit: (data: InsertTask) => void;
  isLoading?: boolean;
}

export function TaskDialog({ open, onOpenChange, task, onSubmit, isLoading }: TaskDialogProps) {
  const form = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      completed: false,
      priority: "medium",
      dueDate: undefined,
    },
  });

  // Reset form when dialog opens with task data or when creating new task
  useEffect(() => {
    if (open) {
      form.reset({
        title: task?.title || "",
        description: task?.description || "",
        completed: task?.completed || false,
        priority: task?.priority || "medium",
        dueDate: task?.dueDate ? new Date(task.dueDate) : undefined,
      });
    }
  }, [open, task, form]);

  const handleSubmit = (data: InsertTask) => {
    // Explicitly convert undefined to null for dueDate to ensure cleared dates are sent to server
    const submissionData = {
      ...data,
      dueDate: data.dueDate !== undefined ? data.dueDate : null,
    };
    
    onSubmit(submissionData);
    if (!task) {
      form.reset({
        title: "",
        description: "",
        completed: false,
        priority: "medium",
        dueDate: undefined,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" data-testid="dialog-task">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "New Task"}</DialogTitle>
          <DialogDescription>
            {task 
              ? "Update your task details below" 
              : "Create a new task to keep track of your work"
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter task title"
                      {...field}
                      data-testid="input-task-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add more details about this task"
                      className="min-h-32 resize-none"
                      {...field}
                      value={field.value || ""}
                      data-testid="input-task-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-task-priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high" data-testid="option-priority-high">
                          <div className="flex items-center gap-2">
                            <Flag className="h-4 w-4 text-destructive" />
                            <span>High Priority</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="medium" data-testid="option-priority-medium">
                          <div className="flex items-center gap-2">
                            <Flag className="h-4 w-4 text-primary" />
                            <span>Medium Priority</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="low" data-testid="option-priority-low">
                          <div className="flex items-center gap-2">
                            <Flag className="h-4 w-4 text-muted-foreground" />
                            <span>Low Priority</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date (optional)</FormLabel>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "flex-1 justify-start text-left font-normal h-9",
                                !field.value && "text-muted-foreground"
                              )}
                              data-testid="button-select-due-date"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, "MMM d, yyyy") : "Pick a date"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            data-testid="calendar-due-date"
                          />
                        </PopoverContent>
                      </Popover>
                      {field.value && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => field.onChange(null)}
                          data-testid="button-clear-due-date"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                data-testid="button-cancel-task"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                data-testid="button-submit-task"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {task ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
