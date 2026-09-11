import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { pricingAdminApi } from '../../api/adminApi.js';
import { applyServerErrors } from '../../api/axiosClient.js';
import { useAdminCrud } from '../../hooks/useAdminCrud.js';
import { AdminToolbar } from '../../components/admin/AdminToolbar.jsx';
import { DataTable, ToggleSwitch } from '../../components/admin/DataTable.jsx';
import { TagInput } from '../../components/admin/TagInput.jsx';
import { Modal, ConfirmDialog } from '../../components/ui/Modal.jsx';
import { Input, FormField } from '../../components/ui/Field.jsx';

const EMPTY = { name: '', startingPrice: '', currency: 'INR', billingUnit: 'project', features: [], exclusions: [], timeline: '', featured: false, active: true };

export default function Pricing() {
  const [modalItem, setModalItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { items, isLoading, create, update, remove, isSaving, isDeleting } = useAdminCrud('pricing', pricingAdminApi, { limit: 50 });
  const { register, handleSubmit, control, reset, setError, formState: { errors } } = useForm({ defaultValues: EMPTY });

  useEffect(() => {
    if (modalItem) reset({ ...EMPTY, ...modalItem });
  }, [modalItem, reset]);

  const onSubmit = async (values) => {
    const payload = { ...values, startingPrice: Number(values.startingPrice) };
    try {
      if (values._id) await update({ id: values._id, payload });
      else await create(payload);
      setModalItem(null);
    } catch (err) {
      applyServerErrors(err, setError);
    }
  };

  const columns = [
    { key: 'name', header: 'Plan', render: (p) => <p className="font-semibold text-ink-900">{p.name}</p> },
    { key: 'startingPrice', header: 'Starting Price', render: (p) => `₹${p.startingPrice.toLocaleString('en-IN')}` },
    { key: 'featured', header: 'Featured', render: (p) => <ToggleSwitch checked={p.featured} onChange={(v) => update({ id: p._id, payload: { featured: v } })} /> },
    { key: 'active', header: 'Active', render: (p) => <ToggleSwitch checked={p.active} onChange={(v) => update({ id: p._id, payload: { active: v } })} /> },
  ];

  return (
    <div>
      <AdminToolbar title="Pricing Plans" subtitle="Plans shown on the public pricing page." onCreate={() => setModalItem(EMPTY)} createLabel="Add Plan" />
      <DataTable columns={columns} rows={items} isLoading={isLoading} emptyTitle="No pricing plans yet" onEdit={setModalItem} onDelete={setDeleteTarget} />

      <Modal open={Boolean(modalItem)} onClose={() => setModalItem(null)} title={modalItem?._id ? 'Edit Plan' : 'Add Plan'} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('_id')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Plan Name" required error={errors.name?.message}><Input {...register('name', { required: 'Required' })} /></FormField>
            <FormField label="Starting Price (₹)" required error={errors.startingPrice?.message}><Input type="number" {...register('startingPrice', { required: 'Required' })} /></FormField>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Billing Unit"><Input {...register('billingUnit')} placeholder="project, month..." /></FormField>
            <FormField label="Timeline"><Input {...register('timeline')} placeholder="e.g. 3-4 weeks" /></FormField>
          </div>
          <FormField label="Included Features">
            <Controller name="features" control={control} render={({ field }) => <TagInput value={field.value} onChange={field.onChange} placeholder="Add a feature..." />} />
          </FormField>
          <FormField label="Exclusions">
            <Controller name="exclusions" control={control} render={({ field }) => <TagInput value={field.value} onChange={field.onChange} placeholder="Add an exclusion..." />} />
          </FormField>
          <div className="flex justify-end gap-2 border-t border-ink-900/8 pt-4">
            <button type="button" onClick={() => setModalItem(null)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={isSaving} className="btn-accent">{isSaving ? 'Saving...' : 'Save Plan'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { await remove(deleteTarget._id); setDeleteTarget(null); }}
        title="Delete plan?"
        confirmLabel="Delete"
        danger
        loading={isDeleting}
      />
    </div>
  );
}
