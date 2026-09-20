import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { teamAdminApi } from '../../api/adminApi.js';
import { applyServerErrors } from '../../api/axiosClient.js';
import { useAdminCrud } from '../../hooks/useAdminCrud.js';
import { AdminToolbar } from '../../components/admin/AdminToolbar.jsx';
import { DataTable, ToggleSwitch } from '../../components/admin/DataTable.jsx';
import { SOCIALS } from '../../components/ui/socials.js';
import { ImageUploader } from '../../components/admin/ImageUploader.jsx';
import { TagInput } from '../../components/admin/TagInput.jsx';
import { Modal, ConfirmDialog } from '../../components/ui/Modal.jsx';
import { Input, Textarea, FormField } from '../../components/ui/Field.jsx';

const EMPTY = { name: '', role: '', experienceText: '', specialty: '', technologies: [], bio: '', photo: undefined, socials: { linkedin: '', github: '', twitter: '', website: '' }, active: true };

export default function Team() {
  const [modalItem, setModalItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { items, isLoading, create, update, remove, isSaving, isDeleting } = useAdminCrud('team', teamAdminApi, { limit: 50 });
  const { register, handleSubmit, control, reset, setError, formState: { errors } } = useForm({ defaultValues: EMPTY });

  useEffect(() => {
    if (modalItem) reset({ ...EMPTY, ...modalItem, socials: modalItem.socials || EMPTY.socials });
  }, [modalItem, reset]);

  const onSubmit = async (values) => {
    try {
      if (modalItem?._id) await update({ id: modalItem._id, payload: values });
      else await create(values);
      setModalItem(null);
    } catch (err) {
      applyServerErrors(err, setError);
    }
  };

  const columns = [
    { key: 'name', header: 'Member', render: (m) => (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-ink-900/5">
          {m.photo?.url && <img src={m.photo.url} alt="" className="h-full w-full object-cover" />}
        </div>
        <div><p className="font-semibold text-ink-900">{m.name}</p><p className="text-xs text-ink-900/45">{m.role}</p></div>
      </div>
    )},
    { key: 'active', header: 'Active', render: (m) => <ToggleSwitch checked={m.active} onChange={(v) => update({ id: m._id, payload: { active: v } })} /> },
  ];

  return (
    <div>
      <AdminToolbar title="Team" subtitle="Real team members shown on the About page." onCreate={() => setModalItem(EMPTY)} createLabel="Add Member" />
      <DataTable columns={columns} rows={items} isLoading={isLoading} emptyTitle="No team members yet" emptyDescription="Add real team members - avoid placeholder profiles." onEdit={setModalItem} onDelete={setDeleteTarget} />

      <Modal open={Boolean(modalItem)} onClose={() => setModalItem(null)} title={modalItem?._id ? 'Edit Member' : 'Add Member'} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('_id')} />
          <FormField label="Photo">
            <Controller name="photo" control={control} render={({ field }) => <ImageUploader value={field.value} onChange={field.onChange} folder="team" />} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Name" required error={errors.name?.message}><Input {...register('name', { required: 'Name is required' })} /></FormField>
            <FormField label="Role" required error={errors.role?.message}><Input {...register('role', { required: 'Role is required' })} placeholder="Full-Stack Developer" /></FormField>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Experience"><Input {...register('experienceText')} placeholder="5+ years" /></FormField>
            <FormField label="Specialty"><Input {...register('specialty')} placeholder="React / Node.js" /></FormField>
          </div>
          <FormField label="Technologies">
            <Controller name="technologies" control={control} render={({ field }) => <TagInput value={field.value} onChange={field.onChange} />} />
          </FormField>
          <FormField label="Bio"><Textarea rows={3} {...register('bio')} /></FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(SOCIALS).map(([key, { label, Icon, color }]) => (
              <FormField key={key} label={<span className="inline-flex items-center gap-1.5"><Icon className="h-4 w-4" style={{ color }} />{label}</span>}>
                <Input placeholder={`${label} profile URL`} {...register(`socials.${key}`)} />
              </FormField>
            ))}
          </div>
          <div className="flex justify-end gap-2 border-t border-ink-900/8 pt-4">
            <button type="button" onClick={() => setModalItem(null)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={isSaving} className="btn-accent">{isSaving ? 'Saving...' : 'Save Member'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { await remove(deleteTarget._id); setDeleteTarget(null); }}
        title="Remove team member?"
        confirmLabel="Remove"
        danger
        loading={isDeleting}
      />
    </div>
  );
}
