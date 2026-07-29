import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  Plus,
  Star,
  StarOff,
  ExternalLink,
  Calendar,
  Tag,
  Building2,
  BookOpen,
  Pencil,
  Trash2,
  Filter,
  X,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/StateViews';
import { researchService } from '@/services/researchService';
import { toast } from 'sonner';
import type { Research } from '@/types';

const CATEGORIES = [
  'Tech News',
  'Emerging Technology',
  'Company Challenge',
  'Research Paper',
  'Artificial Intelligence',
  'Cloud Computing',
  'Cybersecurity',
  'DevOps',
  'System Design',
  'Database',
  'Networking',
  'Programming',
  'Blockchain',
  'IoT',
] as const;

export function ResearchPage() {
  const qc = useQueryClient();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Research | null>(null);
  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    company: '',
    tags: '',
    summary: '',
    content: '',
    source: '',
    isFavorite: false,
  });

  const researchQuery = useQuery({
    queryKey: ['research'],
    queryFn: researchService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Research>) => researchService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['research'] });
      toast.success('Research saved successfully');
      setAddDialog(false);
      resetForm();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Research> }) =>
      researchService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['research'] });
      toast.success('Research updated successfully');
      setEditDialog(false);
      if (selected) {
        researchService.getById(selected._id).then(setSelected);
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => researchService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['research'] });
      toast.success('Research deleted successfully');
      setDeleteId(null);
      if (selected) setSelected(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) =>
      researchService.update(id, { isFavorite }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['research'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function resetForm() {
    setFormData({
      title: '',
      category: '',
      company: '',
      tags: '',
      summary: '',
      content: '',
      source: '',
      isFavorite: false,
    });
  }

  function openAddDialog() {
    resetForm();
    setAddDialog(true);
  }

  function openEditDialog(research: Research) {
    setFormData({
      title: research.title,
      category: research.category,
      company: research.company || '',
      tags: research.tags.join(', '),
      summary: research.summary,
      content: research.content,
      source: research.source,
      isFavorite: research.isFavorite,
    });
    setEditDialog(true);
  }

  function handleCreate() {
    if (!formData.title.trim() || !formData.category.trim()) {
      toast.error('Title and category are required');
      return;
    }
    createMutation.mutate({
      title: formData.title,
      category: formData.category,
      company: formData.company || undefined,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      summary: formData.summary,
      content: formData.content,
      source: formData.source,
      isFavorite: formData.isFavorite,
    });
  }

  function handleUpdate() {
    if (!selected) return;
    if (!formData.title.trim() || !formData.category.trim()) {
      toast.error('Title and category are required');
      return;
    }
    updateMutation.mutate({
      id: selected._id,
      data: {
        title: formData.title,
        category: formData.category,
        company: formData.company || undefined,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        summary: formData.summary,
        content: formData.content,
        source: formData.source,
        isFavorite: formData.isFavorite,
      },
    });
  }

  function handleDelete(id: string) {
    setDeleteId(id);
  }

  function toggleFavorite(research: Research) {
    toggleFavoriteMutation.mutate({
      id: research._id,
      isFavorite: !research.isFavorite,
    });
  }

  const filteredResearch = researchQuery.data?.filter((r) => {
    const matchesSearch =
      !query ||
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.category.toLowerCase().includes(query.toLowerCase()) ||
      (r.company && r.company.toLowerCase().includes(query.toLowerCase())) ||
      r.tags.some(t => t.toLowerCase().includes(query.toLowerCase())) ||
      r.summary.toLowerCase().includes(query.toLowerCase());
    
    const matchesFavorites = !showFavorites || r.isFavorite;
    
    return matchesSearch && matchesFavorites;
  }) || [];

  // ---- Detail view ----
  if (selected) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
            <BookOpen className="mr-1.5 h-4 w-4" /> Back to Research Hub
          </Button>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => openEditDialog(selected)}>
              <Pencil className="mr-1.5 h-4 w-4" /> Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => handleDelete(selected._id)}
            >
              <Trash2 className="mr-1.5 h-4 w-4" /> Delete
            </Button>
          </div>
        </div>

        {/* Research header */}
        <Card className="overflow-hidden border-border/60 bg-gradient-to-br from-primary/5 to-accent/10 p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                    {selected.category}
                  </Badge>
                  {selected.company && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" /> {selected.company}
                    </Badge>
                  )}
                </div>
                <h1 className="font-display text-2xl font-semibold tracking-tight">
                  {selected.title}
                </h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleFavorite(selected)}
                className="shrink-0"
              >
                {selected.isFavorite ? (
                  <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                ) : (
                  <StarOff className="h-5 w-5" />
                )}
              </Button>
            </div>
            {selected.source && (
              <Button asChild variant="outline" size="sm" className="w-fit">
                <a href={selected.source} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Source
                </a>
              </Button>
            )}
          </div>
        </Card>

        {/* Summary */}
        <Card className="border-border/60 bg-card/40 p-6">
          <h2 className="font-display text-lg font-semibold mb-3">Summary</h2>
          <p className="text-muted-foreground">{selected.summary}</p>
        </Card>

        {/* Tags */}
        {selected.tags.length > 0 && (
          <Card className="border-border/60 bg-card/40 p-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Tag className="h-3.5 w-3.5" /> Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {selected.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {/* Detailed Content */}
        <Card className="border-border/60 bg-card/40 p-6">
          <h2 className="font-display text-lg font-semibold mb-3">Detailed Notes</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-muted-foreground whitespace-pre-wrap">{selected.content}</p>
          </div>
        </Card>

        {/* Metadata */}
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>Created: {new Date(selected.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>Updated: {new Date(selected.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    );
  }

  // ---- List view ----
  return (
    <div className="space-y-6">
      <PageHeader
        title="Research Hub"
        description="Capture emerging technologies, engineering case studies, technical articles, and future trends in one place."
      />

      {/* Top bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xl flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, technology, company or tag..."
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={showFavorites ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFavorites(!showFavorites)}
          >
            {showFavorites ? (
              <Star className="mr-1.5 h-4 w-4 fill-yellow-500 text-yellow-500" />
            ) : (
              <StarOff className="mr-1.5 h-4 w-4" />
            )}
            Favorites
          </Button>
          <Button size="sm" onClick={openAddDialog}>
            <Plus className="mr-1.5 h-4 w-4" /> Add Research
          </Button>
        </div>
      </div>

      {researchQuery.isLoading ? (
        <LoadingState label="Loading research..." />
      ) : researchQuery.error ? (
        <ErrorState message={researchQuery.error.message} onRetry={() => researchQuery.refetch()} />
      ) : (
        <div className="space-y-4">
          {filteredResearch.length > 0 ? (
            filteredResearch.map((research) => (
              <Card
                key={research._id}
                className="group border-border/60 bg-card/40 p-5 transition-all hover:border-primary/40 hover:shadow-lg"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                          {research.category}
                        </Badge>
                        {research.company && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" /> {research.company}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-display text-lg font-semibold tracking-tight">
                        {research.title}
                      </h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {research.summary}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(research)}
                      className="shrink-0"
                    >
                      {research.isFavorite ? (
                        <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                      ) : (
                        <StarOff className="h-5 w-5" />
                      )}
                    </Button>
                  </div>

                  {research.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {research.tags.slice(0, 5).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs font-normal">
                          {tag}
                        </Badge>
                      ))}
                      {research.tags.length > 5 && (
                        <Badge variant="secondary" className="text-xs font-normal">
                          +{research.tags.length - 5}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-border/40">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(research.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelected(research)}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(research)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(research._id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <EmptyState
              icon={<BookOpen className="h-8 w-8" />}
              title="No research available"
              description="Start building your personal technology knowledge base."
              actionLabel="Add Research"
              onAction={openAddDialog}
            />
          )}
        </div>
      )}

      {/* Add Research Dialog */}
      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <DialogTitle>Add Research</DialogTitle>
            <DialogDescription>
              Save a new research article to your knowledge base.
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
            {/* General Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">General Information</h3>
              <Separator className="mb-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-title">Topic *</Label>
                  <Input
                    id="add-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Model Context Protocol (MCP)"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger id="add-category" className="h-11">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-company">Company</Label>
                  <Input
                    id="add-company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Anthropic"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-tags">Tags</Label>
                  <Input
                    id="add-tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="e.g. AI, Agents, Protocol (comma-separated)"
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            {/* Research Details Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Research Details</h3>
              <Separator className="mb-4" />
              
              <div className="space-y-2">
                <Label htmlFor="add-summary">Summary</Label>
                <Textarea
                  id="add-summary"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Brief summary of the research..."
                  className="min-h-[120px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-content">Detailed Notes</Label>
                <Textarea
                  id="add-content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Detailed notes, key points, and observations..."
                  className="min-h-[220px] resize-none"
                />
              </div>
            </div>

            {/* Reference Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Reference</h3>
              <Separator className="mb-4" />
              
              <div className="space-y-2">
                <Label htmlFor="add-source">Source URL</Label>
                <Input
                  id="add-source"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="https://..."
                  className="h-11"
                />
              </div>
            </div>

            {/* Favorite Toggle */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="add-favorite"
                checked={formData.isFavorite}
                onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                className="rounded h-4 w-4"
              />
              <Label htmlFor="add-favorite" className="cursor-pointer">
                Mark as favorite
              </Label>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Button variant="outline" onClick={() => setAddDialog(false)} className="h-10">
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending} className="h-10">
              Save Research
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Research Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <DialogTitle>Edit Research</DialogTitle>
            <DialogDescription>
              Update the research article details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-6">
            {/* General Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">General Information</h3>
              <Separator className="mb-4" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Topic *</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Model Context Protocol (MCP)"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger id="edit-category" className="h-11">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-company">Company</Label>
                  <Input
                    id="edit-company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Anthropic"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-tags">Tags</Label>
                  <Input
                    id="edit-tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="e.g. AI, Agents, Protocol (comma-separated)"
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            {/* Research Details Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Research Details</h3>
              <Separator className="mb-4" />
              
              <div className="space-y-2">
                <Label htmlFor="edit-summary">Summary</Label>
                <Textarea
                  id="edit-summary"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Brief summary of the research..."
                  className="min-h-[120px] resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-content">Detailed Notes</Label>
                <Textarea
                  id="edit-content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Detailed notes, key points, and observations..."
                  className="min-h-[220px] resize-none"
                />
              </div>
            </div>

            {/* Reference Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Reference</h3>
              <Separator className="mb-4" />
              
              <div className="space-y-2">
                <Label htmlFor="edit-source">Source URL</Label>
                <Input
                  id="edit-source"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="https://..."
                  className="h-11"
                />
              </div>
            </div>

            {/* Favorite Toggle */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="edit-favorite"
                checked={formData.isFavorite}
                onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                className="rounded h-4 w-4"
              />
              <Label htmlFor="edit-favorite" className="cursor-pointer">
                Mark as favorite
              </Label>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Button variant="outline" onClick={() => setEditDialog(false)} className="h-10">
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending} className="h-10">
              Update Research
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete this research permanently?"
        description="This action cannot be undone."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </div>
  );
}
