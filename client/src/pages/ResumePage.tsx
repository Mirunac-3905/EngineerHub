import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileText,
  Upload,
  Trash2,
  Eye,
  RefreshCw,
  Download,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { resumeService } from '@/services/resumeService';
import { EmptyState, ErrorState, LoadingState } from '@/components/shared/StateViews';
import type { Resume } from '@/types';
import { toast } from 'sonner';

function getFullFileUrl(fileUrl: string) {
  // In development, Vite proxy handles /uploads, so use relative path
  // In production, use the full backend URL
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
  if (apiBaseUrl && !fileUrl.startsWith('http')) {
    return `${apiBaseUrl}${fileUrl}`;
  }
  return fileUrl;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ResumePage() {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: resume, isLoading, error, refetch } = useQuery<Resume | null>({
    queryKey: ['resume'],
    queryFn: resumeService.get,
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => resumeService.upload(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resume'] });
      toast.success('Resume uploaded');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const replaceMutation = useMutation({
    mutationFn: (file: File) => resumeService.replace(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resume'] });
      toast.success('Resume replaced');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: resumeService.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['resume'] });
      toast.success('Resume deleted');
      setConfirmDelete(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function handleFile(e: React.ChangeEvent<HTMLInputElement>, replace = false) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }
    if (replace) replaceMutation.mutate(file);
    else uploadMutation.mutate(file);
    e.target.value = '';
  }

  async function doDelete() {
    setDeleting(true);
    try {
      await deleteMutation.mutateAsync();
    } finally {
      setDeleting(false);
    }
  }

  const busy = uploadMutation.isPending || replaceMutation.isPending;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resume"
        description="Upload, preview, and manage your placement resume."
        action={
          resume && (
            <Button
              variant="outline"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Replace
            </Button>
          )
        }
      />

      <input
        ref={fileRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => handleFile(e, !!resume)}
      />

      {isLoading ? (
        <LoadingState label="Loading resume…" />
      ) : error ? (
        <ErrorState message={error.message} onRetry={() => refetch()} />
      ) : !resume ? (
        <EmptyState
          icon={<FileText className="h-8 w-8" />}
          title="No resume uploaded"
          description="Upload your resume (PDF) to keep it ready for applications."
          actionLabel={busy ? 'Uploading…' : 'Upload Resume'}
          onAction={() => fileRef.current?.click()}
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="flex flex-col gap-5 border-border/60 bg-card/40 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                <FileText className="h-7 w-7" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-base font-semibold">
                  {resume.fileName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(resume.fileSize)} · PDF
                </p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>

            <div className="rounded-lg border border-border/60 bg-background/40 p-3 text-xs text-muted-foreground">
              Uploaded on{' '}
              {new Date(resume.uploadedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>

            <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
              <Button asChild variant="outline" size="sm">
                <a href={getFullFileUrl(resume.fileUrl)} target="_blank" rel="noreferrer">
                  <Eye className="mr-1.5 h-3.5 w-3.5" /> Preview
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href={getFullFileUrl(resume.fileUrl)} download={resume.fileName}>
                  <Download className="mr-1.5 h-3.5 w-3.5" /> Download
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileRef.current?.click()}
                disabled={busy}
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Replace
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
              </Button>
            </div>
          </Card>

          {/* Preview */}
          <Card className="overflow-hidden border-border/60 bg-card/40 p-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Preview
            </p>
            <div className="h-[420px] overflow-hidden rounded-lg border border-border/60 bg-background">
              <iframe
                src={`${getFullFileUrl(resume.fileUrl)}#toolbar=0`}
                title="Resume preview"
                className="h-full w-full"
              />
            </div>
          </Card>
        </div>
      )}

      {busy && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 rounded-lg border border-border/60 bg-card/90 px-4 py-2.5 text-sm shadow-lg backdrop-blur-xl">
          <Loader2 className="h-4 w-4 animate-spin text-primary" /> Uploading…
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete resume?"
        description="Your uploaded resume will be permanently removed."
        loading={deleting}
        onConfirm={doDelete}
      />
    </div>
  );
}
