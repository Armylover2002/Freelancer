import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, Loader2, PartyPopper, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import { publicApi } from '../../api/publicApi.js';
import { extractErrorMessage, extractErrorDetails } from '../../api/axiosClient.js';
import { enquiryFormSchema, STEP_FIELDS, DEFAULT_VALUES, toApiPayload, mapBackendPathToField } from '../../utils/enquirySchema.js';
import {
  PROJECT_TYPES, PAGE_OPTIONS, FEATURE_OPTIONS, DESIGN_STYLES,
  BUDGET_RANGES, TIMELINE_OPTIONS, CONTACT_METHODS, STEP_TITLES,
} from '../../utils/enquiryOptions.js';
import { Input, Textarea, FormField, Checkbox } from '../../components/ui/Field.jsx';
import { AnimatedReveal } from '../../components/ui/AnimatedReveal.jsx';
import { trackEvent, getEnquirySourceMeta } from '../../hooks/useAnalytics.js';
import { useDocumentHead } from '../../hooks/useDocumentHead.js';

const STORAGE_KEY = 'agency_enquiry_draft_v1';
const TOTAL_STEPS = STEP_FIELDS.length;

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_VALUES, ...JSON.parse(raw) } : DEFAULT_VALUES;
  } catch {
    return DEFAULT_VALUES;
  }
}

function SelectableCard({ selected, onClick, title, subtitle }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'flex w-full items-center justify-between rounded-xl border-2 px-4 py-3.5 text-left transition-all',
        selected ? 'border-accent-500 bg-accent-500/5 shadow-glow' : 'border-ink-900/10 bg-white hover:border-ink-900/25'
      )}
    >
      <div>
        <p className="text-sm font-semibold text-ink-900">{title}</p>
        {subtitle && <p className="text-xs text-ink-900/45">{subtitle}</p>}
      </div>
      <div className={clsx('flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2', selected ? 'border-accent-500 bg-accent-500' : 'border-ink-900/20')}>
        {selected && <Check className="h-3 w-3 text-white" />}
      </div>
    </button>
  );
}

function ProgressBar({ step }) {
  const pct = ((step + 1) / TOTAL_STEPS) * 100;
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-medium text-ink-900/45">
        <span>Step {step + 1} of {TOTAL_STEPS}</span>
        <span>{STEP_TITLES[step]}</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-900/8">
        <motion.div
          className="h-full rounded-full bg-accent-500"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function StartProject() {
  useDocumentHead({
    title: 'Start Your Project',
    description: 'Tell us about your project requirements and get a tailored plan.',
  });

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const startTracked = useMemo(() => ({ done: false }), []);

  const {
    register, handleSubmit, trigger, watch, setValue, getValues, setError, formState: { errors },
  } = useForm({
    resolver: zodResolver(enquiryFormSchema),
    mode: 'onTouched',
    defaultValues: loadDraft(),
  });

  const values = watch();

  useEffect(() => {
    if (!startTracked.done) {
      trackEvent('enquiry_start');
      startTracked.done = true;
    }
  }, [startTracked]);

  useEffect(() => {
    const sub = watch((v) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
      } catch {
        /* storage unavailable - safe to ignore */
      }
    });
    return () => sub.unsubscribe?.();
  }, [watch]);

  const toggleArrayValue = (field, val) => {
    const current = getValues(field) || [];
    const next = current.includes(val) ? current.filter((v) => v !== val) : [...current, val];
    setValue(field, next, { shouldValidate: true });
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const result = await publicApi.uploadEnquiryFile(file);
        uploaded.push({ url: result.url, publicId: result.publicId, originalName: result.originalName });
      }
      setValue('brandAssets', [...(getValues('brandAssets') || []), ...uploaded]);
      toast.success(`${uploaded.length} file(s) uploaded`);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeAsset = (publicId) => {
    setValue('brandAssets', (getValues('brandAssets') || []).filter((a) => a.publicId !== publicId));
  };

  const goNext = async () => {
    const fields = STEP_FIELDS[step];
    const valid = await trigger(fields);
    if (!valid) {
      toast.error('Please fix the highlighted fields before continuing.');
      return;
    }
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (formValues) => {
    setSubmitting(true);
    try {
      const payload = { ...toApiPayload(formValues), source: getEnquirySourceMeta() };
      const result = await publicApi.createEnquiry(payload);
      trackEvent('enquiry_submit');
      localStorage.removeItem(STORAGE_KEY);
      setSubmitted(result);
    } catch (err) {
      const details = extractErrorDetails(err);
      if (Array.isArray(details) && details.length) {
        let firstStep = null;
        details.forEach(({ path, message }) => {
          const mapped = mapBackendPathToField(path);
          if (mapped) {
            setError(mapped.field, { type: 'server', message });
            if (firstStep === null && mapped.step !== null) firstStep = mapped.step;
          }
        });
        // Jump back to whichever step actually has the problem, so the message is visible.
        if (firstStep !== null) setStep(firstStep);
      }
      toast.error(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
        <AnimatedReveal className="mx-auto max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <PartyPopper className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="mt-6 text-2xl font-extrabold text-ink-900">Request received!</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-900/60">{submitted.message}</p>

          <p className="mt-4 text-xs text-ink-900/40">
            You can check its status anytime using the email you just submitted with.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/" className="btn-primary">Back to Home</Link>
            <Link to={`/track-request?email=${encodeURIComponent(submitted.email || '')}`} className="btn-outline">
              Track Your Request
            </Link>
          </div>
        </AnimatedReveal>
      </div>
    );
  }

  return (
    <div className="section-y container-page">
      <div className="mx-auto max-w-2xl">
        <AnimatedReveal className="text-center">
          <h1 className="text-3xl font-extrabold text-ink-900 sm:text-4xl">Start Your Project</h1>
          <p className="mt-3 text-ink-900/55">
            Answer a few quick questions so we can understand your requirements and respond with a tailored plan.
          </p>
          <p className="mt-2 text-sm text-ink-900/45">
            Already submitted a request?{' '}
            <Link to="/track-request" className="font-semibold text-accent-600 underline-offset-2 hover:underline">
              Track its status
            </Link>
          </p>
        </AnimatedReveal>

        <div className="mt-8 card p-6 sm:p-8">
          <ProgressBar step={step} />

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
            {/* honeypot - hidden from real users */}
            <input type="text" {...register('website')} className="hidden" tabIndex={-1} autoComplete="off" />

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                {step === 0 && (
                  <>
                    <FormField label="Full Name" required error={errors.name?.message}>
                      <Input {...register('name')} error={errors.name} placeholder="John Doe" />
                    </FormField>
                    <FormField label="Business / Company Name" error={errors.business?.message}>
                      <Input {...register('business')} placeholder="Acme Inc." />
                    </FormField>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FormField label="Email" required error={errors.email?.message}>
                        <Input type="email" {...register('email')} error={errors.email} placeholder="you@example.com" />
                      </FormField>
                      <FormField label="Phone / WhatsApp" required error={errors.phone?.message}>
                        <Input {...register('phone')} error={errors.phone} placeholder="+91 98765 43210" />
                      </FormField>
                    </div>
                    <FormField label="Country" error={errors.country?.message}>
                      <Input {...register('country')} placeholder="India" />
                    </FormField>
                    <FormField label="Preferred Contact Method" required>
                      <div className="grid grid-cols-3 gap-3">
                        {CONTACT_METHODS.map((m) => (
                          <SelectableCard key={m.value} title={m.label} selected={values.preferredContactMethod === m.value} onClick={() => setValue('preferredContactMethod', m.value)} />
                        ))}
                      </div>
                    </FormField>
                  </>
                )}

                {step === 1 && (
                  <>
                    <FormField label="What does your business do?" error={errors.businessDescription?.message}>
                      <Textarea {...register('businessDescription')} placeholder="Briefly describe your business..." />
                    </FormField>
                    <FormField label="Who are your target customers?" error={errors.targetCustomers?.message}>
                      <Textarea rows={3} {...register('targetCustomers')} placeholder="e.g. Young professionals in urban areas..." />
                    </FormField>
                    <FormField label="Existing website or app URL (if any)" error={errors.existingUrl?.message}>
                      <Input {...register('existingUrl')} placeholder="https://" />
                    </FormField>
                    <FormField label="What's your current pain point?" error={errors.painPoint?.message}>
                      <Textarea rows={3} {...register('painPoint')} placeholder="What's not working with your current setup?" />
                    </FormField>
                  </>
                )}

                {step === 2 && (
                  <FormField label="What type of project is this?" required error={errors.projectType?.message}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {PROJECT_TYPES.map((t) => (
                        <SelectableCard key={t.value} title={t.label} selected={values.projectType === t.value} onClick={() => setValue('projectType', t.value, { shouldValidate: true })} />
                      ))}
                    </div>
                  </FormField>
                )}

                {step === 3 && (
                  <FormField label="Which pages do you need?" error={errors.pages?.message}>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                      {PAGE_OPTIONS.map((p) => (
                        <Checkbox key={p} label={p} checked={(values.pages || []).includes(p)} onChange={() => toggleArrayValue('pages', p)} />
                      ))}
                    </div>
                  </FormField>
                )}

                {step === 4 && (
                  <FormField label="Which features do you need?" error={errors.features?.message}>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                      {FEATURE_OPTIONS.map((f) => (
                        <Checkbox key={f} label={f} checked={(values.features || []).includes(f)} onChange={() => toggleArrayValue('features', f)} />
                      ))}
                    </div>
                  </FormField>
                )}

                {step === 5 && (
                  <>
                    <FormField label="What design style do you prefer?" required error={errors.designStyle?.message}>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {DESIGN_STYLES.map((s) => (
                          <SelectableCard key={s.value} title={s.label} selected={values.designStyle === s.value} onClick={() => setValue('designStyle', s.value, { shouldValidate: true })} />
                        ))}
                      </div>
                    </FormField>
                    <FormField label="Reference website URLs (optional)" error={errors.referenceUrls?.message}>
                      <Textarea
                        rows={2}
                        placeholder="https://example.com (one URL per line)"
                        defaultValue={(values.referenceUrls || []).join('\n')}
                        onChange={(e) =>
                          setValue(
                            'referenceUrls',
                            e.target.value.split('\n').map((s) => s.trim()).filter(Boolean),
                            { shouldValidate: true }
                          )
                        }
                      />
                    </FormField>
                    <FormField label="Brand assets / logo (optional)">
                      <label className={clsx('flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-900/15 px-4 py-6 text-sm font-medium text-ink-900/50 transition hover:border-accent-500/40 hover:text-accent-600', uploading && 'opacity-60')}>
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        {uploading ? 'Uploading...' : 'Click to upload images or PDF'}
                        <input type="file" multiple accept="image/*,.pdf" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                      </label>
                      {values.brandAssets?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {values.brandAssets.map((a) => (
                            <span key={a.publicId} className="flex items-center gap-1.5 rounded-full bg-ink-900/5 px-3 py-1.5 text-xs font-medium text-ink-900/70">
                              {a.originalName || 'file'}
                              <button type="button" onClick={() => removeAsset(a.publicId)} aria-label="Remove file">
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </FormField>
                  </>
                )}

                {step === 6 && (
                  <>
                    <FormField label="What's your budget range?" required error={errors.budgetRange?.message}>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {BUDGET_RANGES.map((b) => (
                          <SelectableCard key={b.value} title={b.label} selected={values.budgetRange === b.value} onClick={() => setValue('budgetRange', b.value, { shouldValidate: true })} />
                        ))}
                      </div>
                    </FormField>
                    <FormField label="What's your timeline?" required error={errors.timeline?.message}>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {TIMELINE_OPTIONS.map((t) => (
                          <SelectableCard key={t.value} title={t.label} selected={values.timeline === t.value} onClick={() => setValue('timeline', t.value, { shouldValidate: true })} />
                        ))}
                      </div>
                    </FormField>
                  </>
                )}

                {step === 7 && (
                  <>
                    <FormField label="Anything else we should know?" error={errors.brief?.message}>
                      <Textarea rows={4} {...register('brief')} placeholder="Additional requirements, inspiration, constraints..." />
                    </FormField>
                    <FormField label="How did you hear about us?" error={errors.heardFrom?.message}>
                      <Input {...register('heardFrom')} placeholder="Google, referral, social media..." />
                    </FormField>
                    <Checkbox
                      label="I consent to being contacted about this project request."
                      checked={Boolean(values.consent)}
                      onChange={(e) => setValue('consent', e.target.checked, { shouldValidate: true })}
                    />
                    {errors.consent && <p className="field-error">{errors.consent.message}</p>}
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between border-t border-ink-900/8 pt-6">
              <button
                type="button"
                onClick={goBack}
                disabled={step === 0}
                className="btn-ghost disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>

              {step < TOTAL_STEPS - 1 ? (
                <button type="button" onClick={goNext} className="btn-accent">
                  Continue <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button type="submit" disabled={submitting} className="btn-accent">
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
