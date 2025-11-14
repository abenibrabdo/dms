import { useState } from 'react';
import { apiClient } from '@services/apiClient';

export const PasswordResetConfirm = () => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      await apiClient.post('/auth/reset/confirm', { token, newPassword });
      setMessage('Password reset successful');
      setToken('');
      setNewPassword('');
    } catch (err: any) {
      setMessage(err?.response?.data?.message ?? 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-slate-700">Reset Token</label>
        <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={token} onChange={(e) => setToken(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">New Password</label>
        <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
      </div>
      {message && <div className="rounded-md bg-slate-50 p-2 text-sm text-slate-700">{message}</div>}
      <button type="submit" disabled={loading} className="w-full rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60">{loading ? 'Resetting...' : 'Reset Password'}</button>
    </form>
  );
};
