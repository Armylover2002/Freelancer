import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { servicesAdminApi } from '../../api/adminApi.js';
import { useAdminCrud } from '../../hooks/useAdminCrud.js';
import { AdminToolbar } from '../../components/admin/AdminToolbar.jsx';
import { DataTable, ToggleSwitch } from '../../components/admin/DataTable.jsx';
import { TagInput } from '../../components/admin/TagInput.jsx';
import { Modal, ConfirmDialog } from '../../components/ui/Modal.jsx';
import { Input, Textarea, FormField } from '../../components/ui/Field.jsx';
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js';

const EMPTY = { title: '', icon: '', shortDescription: '', description: '', features: [], startingPrice: '', timeline: '', active: true };

export default function Services() {
  const [search, setSearch] = useState('');
  const [modalItem, setModalItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const debounced = useDebouncedValue(search, 400);

  const { items, isLoading, create, update, remove, isSaving, isDeleting } = useAdminCrud(
    'services', servicesAdminApi, { limit: 50, search: debounced || undefined }
  );

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({ defaultValues: EMPTY });

  useEffect(() => {
    if (modalItem) reset({ ...EMPTY, ...modalItem, startingPrice: modalItem.startingPrice ?? '' });
  }, [modalItem, reset]);

  const onSubmit = async (values) => {
    const payload = { ...values, startingPrice: values.startingPrice === '' ? undefined : Number(values.startingPrice) };
    try {
      if (values._id) await update({ id: values._id, payload });
      else await create(payload);
      setModalItem(null);
    } catch { /* handled */ }
  };

  const columns = [
    { key: 'title', header: 'Service', render: (s) => (
      <div><p className="font-semibold text-ink-900">{s.title}</p><p className="text-xs text-ink-900/45 line-clamp-1">{s.shortDescription}</p></div>
    )},
    { key: 'startingPrice', header: 'From', render: (s) => s.startingPrice ? `₹${s.startingPrice.toLocaleString('en-IN')}` : '-' },
    { key: 'active', header: 'Active', render: (s) => <ToggleSwitch checked={s.active} onChange={(v) => update({ id: s._id, payload: { active: v } })} /> },
  ];

  return (
    <div>
      <AdminToolbar title="Services" subtitle="What you offer to clients." search={search} onSearchChange={setSearch} onCreate={() => setModalItem(EMPTY)} createLabel="Add Service" />
      <DataTable columns={columns} rows={items} isLoading={isLoading} emptyTitle="No services yet" onEdit={setModalItem} onDelete={setDeleteTarget} />

      <Modal open={Boolean(modalItem)} onClose={() => setModalItem(null)} title={modalItem?._id ? 'Edit Service' : 'Add Service'} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('_id')} />
          <FormField label="Title" required error={errors.title?.message}><Input {...register('title', { required: 'Required' })} /></FormField>
          <FormField label="Icon (name)"><Input {...register('icon')} placeholder="globe, cart, dashboard, mobile, seo..." /></FormField>
          <FormField label="Short Description" required error={errors.shortDescription?.message}><Textarea rows={2} {...register('shortDescription', { required: 'Required' })} /></FormField>
          <FormField label="Full Description"><Textarea rows={4} {...register('description')} /></FormField>
          <FormField label="Features">
            <Controller name="features" control={control} render={({ field }) => <TagInput value={field.value} onChange={field.onChange} placeholder="Add a feature..." />} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Starting Price (₹)"><Input type="number" {...register('startingPrice')} /></FormField>
            <FormField label="Typical Timeline"><Input {...register('timeline')} placeholder="e.g. 2-4 weeks" /></FormField>
          </div>
          <div className="flex justify-end gap-2 border-t border-ink-900/8 pt-4">
            <button type="button" onClick={() => setModalItem(null)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={isSaving} className="btn-accent">{isSaving ? 'Saving...' : 'Save Service'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { await remove(deleteTarget._id); setDeleteTarget(null); }}
        title="Delete service?"
        description={`"${deleteTarget?.title}" will be removed.`}
        confirmLabel="Delete"
        danger
        loading={isDeleting}
      />
    </div>
  );
}
