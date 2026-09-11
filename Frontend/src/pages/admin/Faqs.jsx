import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { faqsAdminApi } from '../../api/adminApi.js';
import { useAdminCrud } from '../../hooks/useAdminCrud.js';
import { AdminToolbar } from '../../components/admin/AdminToolbar.jsx';
import { DataTable, ToggleSwitch } from '../../components/admin/DataTable.jsx';
import { Modal, ConfirmDialog } from '../../components/ui/Modal.jsx';
import { Input, Textarea, FormField } from '../../components/ui/Field.jsx';

const EMPTY = { category: '', question: '', answer: '', published: true };

export default function Faqs() {
  const [modalItem, setModalItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { items, isLoading, create, update, remove, isSaving, isDeleting } = useAdminCrud('faqs', faqsAdminApi, { limit: 100 });
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: EMPTY });

  useEffect(() => {
    if (modalItem) reset({ ...EMPTY, ...modalItem });
  }, [modalItem, reset]);

  const onSubmit = async (values) => {
    try {
      if (values._id) await update({ id: values._id, payload: values });
      else await create(values);
      setModalItem(null);
    } catch { /* handled */ }
  };

  const columns = [
    { key: 'category', header: 'Category', render: (f) => <span className="badge bg-ink-900/5 text-ink-900/60">{f.category}</span> },
    { key: 'question', header: 'Question', render: (f) => <p className="max-w-sm text-ink-900/80">{f.question}</p> },
    { key: 'published', header: 'Published', render: (f) => <ToggleSwitch checked={f.published} onChange={(v) => update({ id: f._id, payload: { published: v } })} /> },
  ];

  return (
    <div>
      <AdminToolbar title="FAQs" subtitle="Answer common questions to reduce friction before an enquiry." onCreate={() => setModalItem(EMPTY)} createLabel="Add FAQ" />
      <DataTable columns={columns} rows={items} isLoading={isLoading} emptyTitle="No FAQs yet" onEdit={setModalItem} onDelete={setDeleteTarget} />

      <Modal open={Boolean(modalItem)} onClose={() => setModalItem(null)} title={modalItem?._id ? 'Edit FAQ' : 'Add FAQ'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('_id')} />
          <FormField label="Category" required error={errors.category?.message}><Input {...register('category', { required: 'Required' })} placeholder="Process, Pricing, Support..." /></FormField>
          <FormField label="Question" required error={errors.question?.message}><Input {...register('question', { required: 'Required' })} /></FormField>
          <FormField label="Answer" required error={errors.answer?.message}><Textarea rows={4} {...register('answer', { required: 'Required' })} /></FormField>
          <div className="flex justify-end gap-2 border-t border-ink-900/8 pt-4">
            <button type="button" onClick={() => setModalItem(null)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={isSaving} className="btn-accent">{isSaving ? 'Saving...' : 'Save FAQ'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { await remove(deleteTarget._id); setDeleteTarget(null); }}
        title="Delete FAQ?"
        confirmLabel="Delete"
        danger
        loading={isDeleting}
      />
    </div>
  );
}
