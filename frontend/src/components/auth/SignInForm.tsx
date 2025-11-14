import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@store/authStore';
import { apiClient } from '@services/apiClient';

export const SignInForm = () => {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await apiClient.post('/auth/login', {
        email,
        password,
        mfaCode: mfaCode || undefined,
      });
      const resp = data.data as {
        user: { id: string; email: string; firstName: string; lastName: string; roles: string[]; permissions: string[] };
        tokens: { accessToken: string; refreshToken: string };
      };
      setSession({
        user: {
          id: resp.user.id,
          email: resp.user.email,
          fullName: `${resp.user.firstName} ${resp.user.lastName}`,
          roles: resp.user.roles,
          permissions: resp.user.permissions,
          initials: `${resp.user.firstName?.[0] ?? ''}${resp.user.lastName?.[0] ?? ''}`.toUpperCase(),
        },
        accessToken: resp.tokens.accessToken,
        refreshToken: resp.tokens.refreshToken,
      });
      navigate('/');
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <input
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Password</label>
        <input
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">MFA Code (if enabled)</label>
        <input
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          placeholder="123456"
          value={mfaCode}
          onChange={(event) => setMfaCode(event.target.value)}
        />
      </div>
      {error && <div className="rounded-md bg-rose-50 p-2 text-sm text-rose-600">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-60"
      >
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
      <p className="text-center text-xs text-slate-500">By signing in you agree to our compliance policies.</p>
    </form>
  );
};

