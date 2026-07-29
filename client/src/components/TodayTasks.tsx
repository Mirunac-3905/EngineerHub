import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Check, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { taskService } from '@/services/taskService';
import { toast } from 'sonner';
import type { Task } from '@/types';

const MAX_DISPLAY_TASKS = 8;

export function TodayTasks() {
  const qc = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: taskService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: taskService.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      setNewTaskTitle('');
      setIsAddDialogOpen(false);
      toast.success('Task added');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) =>
      taskService.update(id, updates),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      setIsEditDialogOpen(false);
      setEditingTask(null);
      toast.success('Task updated');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: taskService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task deleted');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    createMutation.mutate(newTaskTitle.trim());
  };

  const handleEditTask = () => {
    if (!editingTask || !editTaskTitle.trim()) return;
    updateMutation.mutate({
      id: editingTask._id,
      updates: { title: editTaskTitle.trim() },
    });
  };

  const handleToggleComplete = (task: Task) => {
    updateMutation.mutate({
      id: task._id,
      updates: { completed: !task.completed },
    });
  };

  const handleDeleteTask = (id: string) => {
    deleteMutation.mutate(id);
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setEditTaskTitle(task.title);
    setIsEditDialogOpen(true);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const displayTasks = tasks.slice(0, MAX_DISPLAY_TASKS);

  if (isLoading) {
    return (
      <Card className="border-border/60 bg-card/40 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 bg-card/40 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold">Today&apos;s Tasks</h2>
          <p className="text-xs text-muted-foreground">
            {totalCount === 0 ? 'No tasks for today' : 'Your daily checklist'}
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Add a new task to your daily checklist.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Enter task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddTask} disabled={createMutation.isPending}>
                  {createMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {totalCount === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">No tasks for today.</p>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>
                  Add a new task to your daily checklist.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input
                  placeholder="Enter task..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddTask} disabled={createMutation.isPending}>
                    {createMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Add
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <>
          {/* Progress */}
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {completedCount} / {totalCount} Completed
              </span>
            </div>
            <Progress value={(completedCount / totalCount) * 100} className="h-2" />
          </div>

          {/* Task List */}
          <div className="space-y-2">
            {displayTasks.map((task) => (
              <div
                key={task._id}
                className="group flex items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3 transition-colors hover:border-primary/40"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => handleToggleComplete(task)}
                  disabled={updateMutation.isPending}
                />
                <span
                  className={`flex-1 text-sm ${
                    task.completed
                      ? 'line-through text-muted-foreground/60'
                      : 'text-foreground'
                  }`}
                >
                  {task.title}
                </span>
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={() => openEditDialog(task)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Task</DialogTitle>
                        <DialogDescription>
                          Update the task title for your daily checklist.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <Input
                          placeholder="Enter task..."
                          value={editTaskTitle}
                          onChange={(e) => setEditTaskTitle(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleEditTask()}
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleEditTask}
                            disabled={updateMutation.isPending}
                          >
                            {updateMutation.isPending && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Save
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteTask(task._id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {tasks.length > MAX_DISPLAY_TASKS && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              +{tasks.length - MAX_DISPLAY_TASKS} more tasks
            </p>
          )}
        </>
      )}
    </Card>
  );
}
