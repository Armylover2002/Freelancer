import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { extractErrorMessage } from '../api/axiosClient.js';

/**
 * Wraps the standard list/create/update/remove admin CRUD API (projects, services,
 * pricing, team, testimonials, faqs all share this shape) with react-query caching,
 * cache invalidation and toast feedback - so each admin page only defines its fields/UI.
 */
export function useAdminCrud(resourceKey, api, params = {}) {
  const queryClient = useQueryClient();
  const queryKey = ['admin', resourceKey, params];

  const listQuery = useQuery({
    queryKey,
    queryFn: () => api.list(params),
    placeholderData: keepPreviousData,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', resourceKey] });

  const createMutation = useMutation({
    mutationFn: api.create,
    onSuccess: () => {
      toast.success('Created successfully');
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => api.update(id, payload),
    onSuccess: () => {
      toast.success('Updated successfully');
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const removeMutation = useMutation({
    mutationFn: api.remove,
    onSuccess: () => {
      toast.success('Deleted successfully');
      invalidate();
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  return {
    items: listQuery.data?.data || [],
    meta: listQuery.data?.meta,
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    refetch: listQuery.refetch,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: removeMutation.mutateAsync,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isDeleting: removeMutation.isPending,
  };
}
