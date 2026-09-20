import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Star, CheckCircle2, AlertTriangle } from 'lucide-react';
import { testimonialsAdminApi } from '../../api/adminApi.js';
import { applyServerErrors } from '../../api/axiosClient.js';
import { useAdminCrud } from '../../hooks/useAdminCrud.js';
import { AdminToolbar } from '../../components/admin/AdminToolbar.jsx';
import { DataTable, ToggleSwitch } from '../../components/admin/DataTable.jsx';
import { ImageUploader } from '../../components/admin/ImageUploader.jsx';
import { Modal, ConfirmDialog } from '../../components/ui/Modal.jsx';
import { Input, Textarea, Checkbox, FormField } from '../../components/ui/Field.jsx';

const EMPTY = { clientName: '', company: '', role: '', quote: '', rating: 5, photo: undefined, sourceVerified: false, published: false };

export default function Testimonials() {
  const [modalItem, setModalItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { items, isLoading, create, update, remove, isSaving, isDeleting } = useAdminCrud('testimonials', testimonialsAdminApi, { limit: 50 });
  const { register, handleSubmit, control, reset, watch, setValue, setError, formState: { errors } } = useForm({ defaultValues: EMPTY });
  const rating = watch('rating');

  useEffect(() => {
    if (modalItem) reset({ ...EMPTY, ...modalItem }, { keepDefaultValues: false });
  }, [modalItem, reset]);

  const onSubmit = async (values) => {
    try {
      // Use the modal's own item id (not a form field) so a stale hidden _id can never
      // turn "Add" into an overwrite of a previously edited testimonial.
      const payload = { ...values };
      ['_id', 'createdAt', 'updatedAt', '__v'].forEach((k) => delete payload[k]);
      const id = modalItem?._id;
      if (id) await update({ id, payload });
      else await create(payload);
      setModalItem(null);
    } catch (err) {
      applyServerErrors(err, setError);
    }
  };

  const columns = [
    { key: 'clientName', header: 'Client', render: (t) => (
      <div><p className="font-semibold text-ink-900">{t.clientName}</p><p className="text-xs text-ink-900/45">{[t.role, t.company].filter(Boolean).join(', ')}</p></div>
    )},
    { key: 'quote', header: 'Quote', render: (t) => <p className="max-w-xs truncate text-ink-900/60">{t.quote}</p> },
    { key: 'sourceVerified', header: 'Verified', render: (t) => (
      <span className={`badge ${t.sourceVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{t.sourceVerified ? 'Verified' : 'Unverified'}</span>
    )},
    { key: 'published', header: 'Published', render: (t) => <ToggleSwitch checked={t.published} onChange={(v) => update({ id: t._id, payload: { published: v } })} /> },
  ];

  return (
    <div>
      <AdminToolbar title="Testimonials" subtitle="Only genuine, verified client testimonials should be published." onCreate={() => setModalItem(EMPTY)} createLabel="Add Testimonial" />
      <DataTable columns={columns} rows={items} isLoading={isLoading} emptyTitle="No testimonials yet" onEdit={setModalItem} onDelete={setDeleteTarget} />

      <Modal open={Boolean(modalItem)} onClose={() => setModalItem(null)} title={modalItem?._id ? 'Edit Testimonial' : 'Add Testimonial'} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {watch('published') ? (
            <div className="callout-success">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <p>This testimonial is <strong>live</strong> on your public website.</p>
            </div>
          ) : (
            <div className="callout-warning">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>This testimonial is <strong>unpublished</strong> and hidden from visitors until you toggle Published below.</p>
            </div>
          )}

          <FormField label="Photo">
            <Controller name="photo" control={control} render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} folder="testimonials" />} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Client Name" required error={errors.clientName?.message}><Input {...register('clientName', { required: 'Required' })} /></FormField>
            <FormField label="Role"><Input {...register('role')} /></FormField>
          </div>
          <FormField label="Company"><Input {...register('company')} /></FormField>
          <FormField label="Quote" required error={errors.quote?.message}><Textarea rows={3} {...register('quote', { required: 'Required' })} /></FormField>
          <FormField label="Rating">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setValue('rating', n)}>
                  <Star className={`h-6 w-6 ${n <= rating ? 'fill-amber-400 text-amber-400' : 'text-ink-900/20'}`} />
                </button>
              ))}
            </div>
          </FormField>
          <Checkbox label="I confirm this testimonial is genuine and verified with the client." checked={watch('sourceVerified')} onChange={(e) => setValue('sourceVerified', e.target.checked)} />
          <div className="flex items-center justify-between rounded-xl border border-ink-900/10 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-ink-900">Published</p>
              <p className="text-xs text-ink-900/45">Turn on to show this testimonial on the public website.</p>
            </div>
            <Controller name="published" control={control} render={({ field }) => (
              <ToggleSwitch checked={field.value} onChange={field.onChange} />
            )} />
          </div>
          <div className="flex justify-end gap-2 border-t border-ink-900/8 pt-4">
            <button type="button" onClick={() => setModalItem(null)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={isSaving} className="btn-accent">{isSaving ? 'Saving...' : 'Save Testimonial'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { await remove(deleteTarget._id); setDeleteTarget(null); }}
        title="Delete testimonial?"
        confirmLabel="Delete"
        danger
        loading={isDeleting}
      />
    </div>
  );
}
