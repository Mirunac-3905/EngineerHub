import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { toast } from 'sonner';

// Generic React Query CRUD helper used across list-based modules.
// Each service exposes getAll/create/update/delete; this hook wires them to
// queries + mutations with optimistic cache invalidation and toast feedback.

interface CrudService<T> {
  getAll: () => Promise<T[]>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  delete: (id: string) => Promise<void>;
}

export function useCrud<T extends { _id: string }>(
  queryKey: string,
  service: CrudService<T>,
  options?: {
    itemName?: string;
    queryOptions?: Partial<UseQueryOptions<T[], Error>>;
  },
) {
  const qc = useQueryClient();
  const name = options?.itemName ?? 'Item';

  const query = useQuery<T[], Error>({
    queryKey: [queryKey],
    queryFn: service.getAll,
    ...options?.queryOptions,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: [queryKey] });

  const createMutation = useMutation({
    mutationFn: service.create,
    onSuccess: () => {
      invalidate();
      toast.success(`${name} added`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<T> }) =>
      service.update(id, data),
    onSuccess: () => {
      invalidate();
      toast.success(`${name} updated`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: service.delete,
    onSuccess: () => {
      invalidate();
      toast.success(`${name} deleted`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return {
    items: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    create: createMutation.mutateAsync,
    creating: createMutation.isPending,
    update: (id: string, data: Partial<T>) =>
      updateMutation.mutateAsync({ id, data }),
    updating: updateMutation.isPending,
    remove: deleteMutation.mutateAsync,
    removing: deleteMutation.isPending,
  };
}
