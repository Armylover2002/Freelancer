import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { settingsAdminApi } from '../../api/adminApi.js';
import { extractErrorMessage } from '../../api/axiosClient.js';
import { ImageUploader } from '../../components/admin/ImageUploader.jsx';
import { ToggleSwitch } from '../../components/admin/DataTable.jsx';
import { PageSpinner } from '../../components/ui/States.jsx';
import { Input, Textarea, FormField } from '../../components/ui/Field.jsx';

function Section({ title, description, children }) {
  return (
    <div className="card p-5">
      <h2 className="font-bold text-ink-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-ink-900/45">{description}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

export default function Settings() {
  const queryClient = useQueryClient();
  const { data: settings, isLoading } = useQuery({ queryKey: ['admin', 'settings'], queryFn: settingsAdminApi.get });
  const { register, handleSubmit, control, reset } = useForm();

  useEffect(() => {
    if (settings) reset(settings);
  }, [settings, reset]);

  const mutation = useMutation({
    mutationFn: settingsAdminApi.update,
    onSuccess: () => {
      toast.success('Settings saved');
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      queryClient.invalidateQueries({ queryKey: ['public', 'settings'] });
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });

  if (isLoading) return <PageSpinner label="Loading settings..." />;

  const onSubmit = (values) => mutation.mutate(values);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Site Settings</h1>
      <p className="mt-1 text-sm text-ink-900/50">Controls branding, contact info and defaults shown on the public site.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Section title="Branding">
            <FormField label="Agency Name"><Input {...register('branding.agencyName')} /></FormField>
            <FormField label="Tagline"><Textarea rows={2} {...register('branding.tagline')} /></FormField>
            <FormField label="Logo">
              <Controller name="branding.logoUrl" control={control} render={({ field }) => (
                <ImageUploader
                  value={field.value ? { url: field.value } : undefined}
                  onChange={(v) => field.onChange(v?.url || '')}
                  folder="branding"
                />
              )} />
            </FormField>
          </Section>

          <Section title="Contact Details">
            <FormField label="Email"><Input type="email" {...register('contact.email')} /></FormField>
            <FormField label="Phone"><Input {...register('contact.phone')} /></FormField>
            <FormField label="WhatsApp Number"><Input {...register('contact.whatsapp')} placeholder="919876543210" /></FormField>
            <FormField label="Address"><Textarea rows={2} {...register('contact.address')} /></FormField>
            <FormField label="Business Hours"><Input {...register('contact.businessHours')} placeholder="Mon-Fri, 9am-6pm" /></FormField>
          </Section>

          <Section title="Social Links">
            <FormField label="LinkedIn"><Input {...register('socials.linkedin')} /></FormField>
            <FormField label="Twitter / X"><Input {...register('socials.twitter')} /></FormField>
            <FormField label="Instagram"><Input {...register('socials.instagram')} /></FormField>
            <FormField label="GitHub"><Input {...register('socials.github')} /></FormField>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="SEO Defaults">
            <FormField label="Default Title"><Input {...register('seoDefaults.title')} /></FormField>
            <FormField label="Default Description"><Textarea rows={2} {...register('seoDefaults.description')} /></FormField>
          </Section>

          <Section title="Call-to-Action Labels">
            <FormField label="Primary CTA"><Input {...register('ctaLabels.primary')} /></FormField>
            <FormField label="Secondary CTA"><Input {...register('ctaLabels.secondary')} /></FormField>
          </Section>

          <Section title="Enquiry Confirmation Message">
            <FormField label="Shown after a successful project submission">
              <Textarea rows={3} {...register('enquiryConfirmationMessage')} />
            </FormField>
          </Section>

          <Section title="Feature Flags">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink-900/70">Maintenance Mode</span>
              <Controller name="featureFlags.maintenanceMode" control={control} render={({ field }) => (
                <ToggleSwitch checked={field.value} onChange={field.onChange} />
              )} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-ink-900/70">Show Testimonials</span>
              <Controller name="featureFlags.showTestimonials" control={control} render={({ field }) => (
                <ToggleSwitch checked={field.value} onChange={field.onChange} />
              )} />
            </div>
          </Section>
        </div>

        <div className="col-span-full flex justify-end">
          <button type="submit" disabled={mutation.isPending} className="btn-accent">
            {mutation.isPending ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
