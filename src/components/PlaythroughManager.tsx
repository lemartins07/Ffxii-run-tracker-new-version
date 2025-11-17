import { useState } from 'react';
import { useSettingsStore, Playthrough } from '../stores/useSettingsStore';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { BookOpen, Plus, Check, Trash2, Edit2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function PlaythroughManager() {
  const { 
    playthroughs, 
    currentPlaythroughId, 
    setCurrentPlaythrough,
    createPlaythrough,
    deletePlaythrough,
    renamePlaythrough
  } = useSettingsStore();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [newPlaythroughName, setNewPlaythroughName] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const currentPlaythrough = playthroughs.find(pt => pt.id === currentPlaythroughId);

  const handleCreatePlaythrough = () => {
    if (!newPlaythroughName.trim()) {
      toast.error('Please enter a name for your playthrough');
      return;
    }

    const id = createPlaythrough(newPlaythroughName.trim());
    setNewPlaythroughName('');
    setIsCreateDialogOpen(false);
    toast.success('New playthrough created!', {
      description: `Now tracking progress in "${newPlaythroughName}"`,
    });
  };

  const handleSwitchPlaythrough = (id: string) => {
    const pt = playthroughs.find(p => p.id === id);
    setCurrentPlaythrough(id);
    setIsDropdownOpen(false);
    toast.success('Switched playthrough', {
      description: `Now tracking "${pt?.name}"`,
    });
  };

  const handleDeletePlaythrough = (id: string) => {
    const pt = playthroughs.find(p => p.id === id);
    deletePlaythrough(id);
    setDeleteConfirmId(null);
    toast.success('Playthrough deleted', {
      description: `"${pt?.name}" has been removed`,
    });
  };

  const handleRenamePlaythrough = () => {
    if (!editName.trim() || !editingId) return;
    
    renamePlaythrough(editingId, editName.trim());
    setEditingId(null);
    setEditName('');
    toast.success('Playthrough renamed');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 min-w-[200px] justify-between">
            <div className="flex items-center gap-2 truncate">
              <BookOpen className="size-4 shrink-0" />
              <span className="truncate">{currentPlaythrough?.name || 'Select Run'}</span>
            </div>
            <ChevronDown className="size-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[300px]">
          <DropdownMenuLabel>Your Playthroughs</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {playthroughs.map((pt) => (
            <DropdownMenuItem
              key={pt.id}
              onClick={() => handleSwitchPlaythrough(pt.id)}
              className="flex items-start gap-2 py-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{pt.name}</span>
                  {pt.id === currentPlaythroughId && (
                    <Check className="size-4 text-primary shrink-0" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Last played: {formatDate(pt.lastPlayed)}
                </div>
              </div>
              {playthroughs.length > 1 && (
                <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="inline-flex items-center justify-center size-6 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => {
                      setEditingId(pt.id);
                      setEditName(pt.name);
                    }}
                  >
                    <Edit2 className="size-3" />
                  </button>
                  <button
                    className="inline-flex items-center justify-center size-6 rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors text-destructive"
                    onClick={() => {
                      setDeleteConfirmId(pt.id);
                    }}
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              )}
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            onClick={() => setIsCreateDialogOpen(true)}
            className="gap-2 text-primary"
          >
            <Plus className="size-4" />
            New Playthrough
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Playthrough</DialogTitle>
            <DialogDescription>
              Start tracking a new run through Final Fantasy XII. Each playthrough has independent progress tracking.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Playthrough Name</Label>
              <Input
                id="name"
                placeholder="e.g., 100% Completion, Speedrun, NG+"
                value={newPlaythroughName}
                onChange={(e) => setNewPlaythroughName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreatePlaythrough();
                  }
                }}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-accent"
                onClick={() => setNewPlaythroughName('First Playthrough')}
              >
                First Playthrough
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-accent"
                onClick={() => setNewPlaythroughName('100% Completion')}
              >
                100% Completion
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-accent"
                onClick={() => setNewPlaythroughName('Speedrun')}
              >
                Speedrun
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-accent"
                onClick={() => setNewPlaythroughName('New Game+')}
              >
                New Game+
              </Badge>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePlaythrough}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={!!editingId} onOpenChange={() => setEditingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Playthrough</DialogTitle>
            <DialogDescription>
              Give this playthrough a new name.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRenamePlaythrough();
                  }
                }}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingId(null)}>
              Cancel
            </Button>
            <Button onClick={handleRenamePlaythrough}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Playthrough?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{playthroughs.find(pt => pt.id === deleteConfirmId)?.name}" and all its progress data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && handleDeletePlaythrough(deleteConfirmId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}