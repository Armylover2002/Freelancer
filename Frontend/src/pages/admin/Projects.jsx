import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { CheckCircle2, AlertTriangle, Archive } from 'lucide-react';
import { projectsAdminApi } from '../../api/adminApi.js';
import { applyServerErrors } from '../../api/axiosClient.js';
import { useAdminCrud } from '../../hooks/useAdminCrud.js';
import { AdminToolbar } from '../../components/admin/AdminToolbar.jsx';
import { DataTable, ToggleSwitch } from '../../components/admin/DataTable.jsx';
import { ImageUploader } from '../../components/admin/ImageUploader.jsx';
import { TagInput } from '../../components/admin/TagInput.jsx';
import { Modal, ConfirmDialog } from '../../components/ui/Modal.jsx';
import { Input, Textarea, Select, FormField } from '../../components/ui/Field.jsx';
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js';

const EMPTY = {
  title: '', businessType: '', category: '', summary: '', problem: '', solution: '',
  features: [], techStack: [], timeline: '', coverImage: undefined, screenshots: [],
  liveUrl: '', results: '', isFeatured: false, status: 'draft',
  seo: { title: '', description: '' },
};

export default function Projects() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalItem, setModalItem] = useState(null); // null = closed, {} = create, {...} = edit
  const [deleteTarget, setDeleteTarget] = useState(null);
  const debounced = useDebouncedValue(search, 400);

  const { items, meta, isLoading, create, update, remove, isSaving, isDeleting } = useAdminCrud(
    'projects', projectsAdminApi, { page, limit: 15, search: debounced || undefined }
  );

  const { register, handleSubmit, control, reset, watch, setError, formState: { errors } } = useForm({ defaultValues: EMPTY });
  const status = watch('status');

  useEffect(() => {
    if (modalItem) reset({ ...EMPTY, ...modalItem, seo: modalItem.seo || { title: '', description: '' } });
  }, [modalItem, reset]);

  const onSubmit = async (values) => {
    try {
      if (values._id) {
        await update({ id: values._id, payload: values });
      } else {
        await create(values);
      }
      setModalItem(null);
    } catch (err) {
      // Toast is shown by useAdminCrud; also surface the exact field so it's easy to find and fix.
      applyServerErrors(err, setError);
    }
  };

  const columns = [
    { key: 'title', header: 'Project', render: (p) => (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-ink-900/5">
          {p.coverImage?.url && <img src={p.coverImage.url} alt="" className="h-full w-full object-cover" />}
        </div>
        <div>
          <p className="font-semibold text-ink-900">{p.title}</p>
          <p className="text-xs text-ink-900/45">{p.category}</p>
        </div>
      </div>
    )},
    { key: 'status', header: 'Status', render: (p) => (
      <span className={`badge capitalize ${p.status === 'published' ? 'bg-emerald-100 text-emerald-700' : p.status === 'archived' ? 'bg-gray-100 text-gray-500' : 'bg-amber-100 text-amber-700'}`}>{p.status}</span>
    )},
    { key: 'isFeatured', header: 'Featured', render: (p) => (
      <ToggleSwitch checked={p.isFeatured} onChange={(v) => update({ id: p._id, payload: { isFeatured: v } })} label="Featured" />
    )},
  ];

  return (
    <div>
      <AdminToolbar
        title="Projects"
        subtitle="Manage your portfolio case studies."
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        onCreate={() => setModalItem(EMPTY)}
        createLabel="Add Project"
      />

      <DataTable
        columns={columns}
        rows={items}
        isLoading={isLoading}
        emptyTitle="No projects yet"
        emptyDescription="Add genuine, completed projects to showcase your work."
        onEdit={(row) => setModalItem(row)}
        onDelete={(row) => setDeleteTarget(row)}
        meta={meta}
        onPageChange={setPage}
      />

      <Modal open={Boolean(modalItem)} onClose={() => setModalItem(null)} title={modalItem?._id ? 'Edit Project' : 'Add Project'} maxWidth="max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('_id')} />

          {status === 'published' ? (
            <div className="callout-success">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <p>This project is <strong>live</strong> on your public Portfolio page.</p>
            </div>
          ) : status === 'archived' ? (
            <div className="callout border-gray-300 bg-gray-50 text-gray-600">
              <Archive className="mt-0.5 h-4 w-4 shrink-0" />
              <p>This project is <strong>archived</strong> and hidden from the public site.</p>
            </div>
          ) : (
            <div className="callout-warning">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                This project is a <strong>Draft</strong> and will not appear on the public Portfolio or Home page
                until you set Status to <strong>Published</strong> below.
              </p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Title" required error={errors.title?.message}>
              <Input {...register('title', { required: 'Title is required' })} />
            </FormField>
            <FormField label="Category" required error={errors.category?.message}>
              <Input {...register('category', { required: 'Category is required' })} placeholder="E-commerce, SaaS, Portfolio..." />
            </FormField>
          </div>
          <FormField label="Business Type">
            <Input {...register('businessType')} placeholder="e.g. Retail, Healthcare, Education" />
          </FormField>
          <FormField label="Summary" required error={errors.summary?.message}>
            <Textarea rows={2} {...register('summary', { required: 'Summary is required' })} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Problem"><Textarea rows={3} {...register('problem')} /></FormField>
            <FormField label="Solution"><Textarea rows={3} {...register('solution')} /></FormField>
          </div>
          <FormField label="Key Features">
            <Controller name="features" control={control} render={({ field }) => <TagInput value={field.value} onChange={field.onChange} placeholder="Add a feature..." />} />
          </FormField>
          <FormField label="Tech Stack">
            <Controller name="techStack" control={control} render={({ field }) => <TagInput value={field.value} onChange={field.onChange} placeholder="React, Node.js..." />} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Timeline"><Input {...register('timeline')} placeholder="e.g. 6 weeks" /></FormField>
            <FormField label="Live URL"><Input {...register('liveUrl')} placeholder="https://" /></FormField>
          </div>
          <FormField label="Results (only genuine, verified results)">
            <Textarea rows={2} {...register('results')} placeholder="e.g. 40% increase in mobile conversions" />
          </FormField>

          <FormField label="Cover Image">
            <Controller name="coverImage" control={control} render={({ field }) => (
              <ImageUploader value={field.value} onChange={field.onChange} folder="projects" />
            )} />
          </FormField>
          <FormField label="Screenshots">
            <Controller name="screenshots" control={control} render={({ field }) => (
              <ImageUploader value={field.value} onChange={field.onChange} multiple folder="projects" label="Add" />
            )} />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Status">
              <Select {...register('status')}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </Select>
            </FormField>
            <FormField label="Featured on homepage">
              <div className="flex h-[46px] items-center">
                <Controller name="isFeatured" control={control} render={({ field }) => (
                  <ToggleSwitch checked={field.value} onChange={field.onChange} label="Featured" />
                )} />
              </div>
            </FormField>
          </div>

          <div className="flex justify-end gap-2 border-t border-ink-900/8 pt-4">
            <button type="button" onClick={() => setModalItem(null)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={isSaving} className="btn-accent">{isSaving ? 'Saving...' : 'Save Project'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { await remove(deleteTarget._id); setDeleteTarget(null); }}
        title="Delete project?"
        description={`"${deleteTarget?.title}" will be permanently removed from the portfolio.`}
        confirmLabel="Delete"
        danger
        loading={isDeleting}
      />
    </div>
  );
}
