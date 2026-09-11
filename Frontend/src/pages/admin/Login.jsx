import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Loader2, Lock, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth.js';
import { extractErrorMessage } from '../../api/axiosClient.js';
import { Input, FormField } from '../../components/ui/Field.jsx';
import { AnimatedReveal } from '../../components/ui/AnimatedReveal.jsx';
import { useDocumentHead } from '../../hooks/useDocumentHead.js';

const schema = z.object({
  email: z.string().trim().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  useDocumentHead({ title: 'Admin Sign In', noIndex: true });

  const { login, admin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  if (admin) {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await login(values.email, values.password);
      toast.success('Welcome back!');
      navigate(location.state?.from?.pathname || '/admin/dashboard', { replace: true });
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4">
      <AnimatedReveal className="w-full max-w-sm">
        <div className="card p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-900 text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-5 text-center text-xl font-bold text-ink-900">Admin Sign In</h1>
          <p className="mt-1 text-center text-sm text-ink-900/45">Access the agency management panel</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <FormField label="Email" required error={errors.email?.message}>
              <Input type="email" autoComplete="username" {...register('email')} error={errors.email} placeholder="admin@agency.com" />
            </FormField>
            <FormField label="Password" required error={errors.password?.message}>
              <Input type="password" autoComplete="current-password" {...register('password')} error={errors.password} placeholder="••••••••" />
            </FormField>
            <button type="submit" disabled={submitting} className="btn-accent w-full">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
        <p className="mt-4 text-center text-xs text-white/30">
          <Link to="/" className="hover:text-white/60">Back to website</Link>
        </p>
      </AnimatedReveal>
    </div>
  );
}
