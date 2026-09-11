import { useRef, useState } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Copy, Loader2, Trash2, Upload } from 'lucide-react';
import { mediaAdminApi } from '../../api/adminApi.js';
import { extractErrorMessage } from '../../api/axiosClient.js';
import { AdminToolbar } from '../../components/admin/AdminToolbar.jsx';
import { EmptyState, Skeleton } from '../../components/ui/States.jsx';
import { Pagination } from '../../components/ui/Pagination.jsx';
import { ConfirmDialog } from '../../components/ui/Modal.jsx';

export default function Media() {
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const fileInputRef = useRef(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'media', page],
    queryFn: () => mediaAdminApi.list({ page, limit: 24 }),
    placeholderData: keepPreviousData,
  });

  const uploadMutation = useMutation({
    mutationFn: (files) => mediaAdminApi.upload(files),
    onSuccess: (uploaded) => {
      toast.success(`${uploaded.length} file(s) uploaded`);
      queryClient.invalidateQueries({ queryKey: ['admin', 'media'] });
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: mediaAdminApi.remove,
    onSuccess: () => {
      toast.success('Deleted');
      queryClient.invalidateQueries({ queryKey: ['admin', 'media'] });
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied');
  };

  const items = data?.data || [];

  return (
    <div>
      <AdminToolbar
        title="Media Library"
        subtitle="Images stored on Cloudinary, reusable across content modules."
        onCreate={() => fileInputRef.current?.click()}
        createLabel="Upload"
      />
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) uploadMutation.mutate(files);
          e.target.value = '';
        }}
      />

      {uploadMutation.isPending && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-accent-500/10 px-4 py-2.5 text-sm text-accent-700">
          <Loader2 className="h-4 w-4 animate-spin" /> Uploading files...
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="aspect-square" />)}
        </div>
      ) : !items.length ? (
        <EmptyState icon={Upload} title="No media uploaded yet" description="Upload images to use across projects, team profiles and testimonials." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {items.map((m) => (
              <div key={m._id} className="group relative aspect-square overflow-hidden rounded-xl border border-ink-900/8 bg-ink-900/5">
                <img src={m.url} alt={m.altText} className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition group-hover:opacity-100">
                  <button onClick={() => copyUrl(m.url)} className="rounded-full bg-white/90 p-2 text-ink-900" aria-label="Copy URL">
                    <Copy className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(m)} className="rounded-full bg-white/90 p-2 text-red-600" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {data?.meta && <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={setPage} />}
        </>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { await deleteMutation.mutateAsync(deleteTarget._id); setDeleteTarget(null); }}
        title="Delete this image?"
        description="This will permanently remove it from Cloudinary. Make sure it isn't referenced elsewhere."
        confirmLabel="Delete"
        danger
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
