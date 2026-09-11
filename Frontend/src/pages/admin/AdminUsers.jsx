import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { adminUsersApi } from '../../api/adminApi.js';
import { extractErrorMessage } from '../../api/axiosClient.js';
import { useAuth } from '../../hooks/useAuth.js';
import { AdminToolbar } from '../../components/admin/AdminToolbar.jsx';
import { DataTable, ToggleSwitch } from '../../components/admin/DataTable.jsx';
import { Modal, ConfirmDialog } from '../../components/ui/Modal.jsx';
import { Input, Select, FormField } from '../../components/ui/Field.jsx';

export default function AdminUsers() {
  const { admin: currentAdmin } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({ queryKey: ['admin', 'users'], queryFn: adminUsersApi.list });
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: { name: '', email: '', password: '', role: 'admin' } });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });

  const inviteMutation = useMutation({
    mutationFn: adminUsersApi.invite,
    onSuccess: () => { toast.success('Admin invited'); reset(); setModalOpen(false); invalidate(); },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => adminUsersApi.update(id, payload),
    onSuccess: () => { toast.success('Updated'); invalidate(); },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const deactivateMutation = useMutation({
    mutationFn: adminUsersApi.deactivate,
    onSuccess: () => { toast.success('Deactivated'); invalidate(); },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  const columns = [
    { key: 'name', header: 'Admin', render: (u) => (
      <div><p className="font-semibold text-ink-900">{u.name}</p><p className="text-xs text-ink-900/45">{u.email}</p></div>
    )},
    { key: 'role', header: 'Role', render: (u) => (
      <Select
        value={u.role}
        disabled={u.id === currentAdmin.id}
        onChange={(e) => updateMutation.mutate({ id: u.id, payload: { role: e.target.value } })}
        className="!w-36 !py-1.5 text-xs"
      >
        <option value="owner">Owner</option>
        <option value="admin">Admin</option>
        <option value="staff">Staff</option>
      </Select>
    )},
    { key: 'active', header: 'Active', render: (u) => (
      <ToggleSwitch checked={u.active} onChange={(v) => v ? updateMutation.mutate({ id: u.id, payload: { active: true } }) : setDeactivateTarget(u)} />
    )},
    { key: 'lastLoginAt', header: 'Last Login', render: (u) => u.lastLoginAt ? format(new Date(u.lastLoginAt), 'PPp') : 'Never' },
  ];

  return (
    <div>
      <AdminToolbar title="Admin Users" subtitle="Manage who can access the admin panel and their permission level." onCreate={() => setModalOpen(true)} createLabel="Invite Admin" />
      <DataTable columns={columns} rows={users || []} isLoading={isLoading} emptyTitle="No admin users found" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Invite Admin User">
        <form onSubmit={handleSubmit((v) => inviteMutation.mutate(v))} className="space-y-4">
          <FormField label="Name" required error={errors.name?.message}><Input {...register('name', { required: 'Required' })} /></FormField>
          <FormField label="Email" required error={errors.email?.message}><Input type="email" {...register('email', { required: 'Required' })} /></FormField>
          <FormField label="Temporary Password" required error={errors.password?.message}><Input type="password" {...register('password', { required: 'Required', minLength: 8 })} /></FormField>
          <FormField label="Role">
            <Select {...register('role')}>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="owner">Owner</option>
            </Select>
          </FormField>
          <div className="flex justify-end gap-2 border-t border-ink-900/8 pt-4">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={inviteMutation.isPending} className="btn-accent">{inviteMutation.isPending ? 'Inviting...' : 'Send Invite'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deactivateTarget)}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={async () => { await deactivateMutation.mutateAsync(deactivateTarget.id); setDeactivateTarget(null); }}
        title="Deactivate this admin?"
        description={`${deactivateTarget?.name} will lose access to the admin panel immediately.`}
        confirmLabel="Deactivate"
        danger
        loading={deactivateMutation.isPending}
      />
    </div>
  );
}
