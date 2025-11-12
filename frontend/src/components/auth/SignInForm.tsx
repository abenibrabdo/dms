import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@store/authStore';

export const SignInForm = () => {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSession({
      user: {
        id: 'demo-user',
        email,
        fullName: 'Demo User',
        department: 'Innovation',
        roles: ['admin'],
        permissions: ['documents:write'],
        initials: 'DU',
      },
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    });
    navigate('/');
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
      <button
        type="submit"
        className="w-full rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
      >
        Sign in
      </button>
      <p className="text-center text-xs text-slate-500">
        By signing in you agree to our compliance policies.
      </p>
    </form>
  );
};

