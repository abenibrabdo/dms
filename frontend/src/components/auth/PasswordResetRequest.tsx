import { useState } from 'react';
import { apiClient } from '@services/apiClient';

export const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      await apiClient.post('/auth/reset/request', { email });
      setMessage('Reset link/code sent if the email exists');
      setEmail('');
    } catch (err: any) {
      setMessage(err?.response?.data?.message ?? 'Failed to request reset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      {message && <div className="rounded-md bg-slate-50 p-2 text-sm text-slate-700">{message}</div>}
      <button type="submit" disabled={loading} className="w-full rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">{loading ? 'Requesting...' : 'Request Reset'}</button>
    </form>
  );
};
