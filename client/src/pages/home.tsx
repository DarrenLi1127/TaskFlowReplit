import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";
import type { Task, InsertTask, UpdateTask } from "@shared/schema";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskItem } from "@/components/task-item";
import { TaskDialog } from "@/components/task-dialog";
import { Plus, ListTodo, LogOut, User } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: InsertTask) => {
      return await apiRequest("POST", "/api/tasks", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Task created",
        description: "Your task has been created successfully.",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/auth";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateTask }) => {
      return await apiRequest("PATCH", `/api/tasks/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setEditingTask(null);
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/auth";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/tasks/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/auth";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      return await apiRequest("PATCH", `/api/tasks/${id}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/auth";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getUserInitials = () => {
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const getUserDisplayName = () => {
    return user?.username || "User";
  };

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/logout", undefined);
      queryClient.clear();
      window.location.href = "/";
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const incompleteTasks = tasks?.filter(task => !task.completed) || [];
  const completedTasks = tasks?.filter(task => task.completed) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
        <div className="container flex h-20 items-center justify-between px-8 max-w-5xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-primary to-accent p-2">
              <ListTodo className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">TaskFlow</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full"
                data-testid="button-user-menu"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-medium" data-testid="text-user-name">
                    {getUserDisplayName()}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="cursor-pointer"
                data-testid="button-logout"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="container px-8 py-10 max-w-5xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Your Awesome Tasks
            </h1>
            <p className="text-base text-muted-foreground font-medium">
              {isLoading ? (
                "Loading your goals..."
              ) : (
                `🎯 ${incompleteTasks.length} to crush • ✨ ${completedTasks.length} done`
              )}
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="w-full sm:w-auto rounded-full px-6 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
            data-testid="button-create-task"
          >
            <Plus className="mr-2 h-5 w-5" />
            New Task
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-md border p-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-5 w-5 rounded flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : tasks && tasks.length > 0 ? (
          <div className="space-y-6">
            {incompleteTasks.length > 0 && (
              <div className="space-y-3">
                {incompleteTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={(completed) => toggleTaskMutation.mutate({ id: task.id, completed })}
                    onEdit={() => setEditingTask(task)}
                    onDelete={() => deleteTaskMutation.mutate(task.id)}
                  />
                ))}
              </div>
            )}

            {completedTasks.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-medium text-muted-foreground">Completed</h2>
                {completedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={(completed) => toggleTaskMutation.mutate({ id: task.id, completed })}
                    onEdit={() => setEditingTask(task)}
                    onDelete={() => deleteTaskMutation.mutate(task.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 p-8">
              <ListTodo className="h-16 w-16 text-primary" />
            </div>
            <h3 className="mb-3 text-2xl font-bold">Ready to Get Things Done?</h3>
            <p className="mb-8 text-lg text-muted-foreground max-w-md">
              Your task list is empty! Let's change that and start crushing some goals! 🚀
            </p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              data-testid="button-create-first-task"
              className="rounded-full px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Task
            </Button>
          </div>
        )}
      </main>

      <TaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={(data) => createTaskMutation.mutate(data)}
        isLoading={createTaskMutation.isPending}
      />

      {editingTask && (
        <TaskDialog
          open={true}
          onOpenChange={(open) => !open && setEditingTask(null)}
          task={editingTask}
          onSubmit={(data) => updateTaskMutation.mutate({ id: editingTask.id, data })}
          isLoading={updateTaskMutation.isPending}
        />
      )}
    </div>
  );
}
