import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { apiClient } from '@services/apiClient';
import { useAuthStore } from '@store/authStore';

export const SignUpForm = () => {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    department: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        department: formData.department || undefined,
      };
      await apiClient.post('/auth/register', payload, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });
      setMessage('User created successfully');
      navigate('/auth');
    } catch (e: any) {
      setMessage(e?.response?.data?.message ?? 'Registration failed (admin only)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700">First Name</label>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700">Last Name</label>
          <input
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <input
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Password</label>
        <input
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          type="password"
          name="password"
          required
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Department</label>
        <input
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          name="department"
          value={formData.department}
          onChange={handleChange}
        />
      </div>
      {message && <div className="rounded-md bg-slate-50 p-2 text-sm text-slate-700">{message}</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-60"
      >
        {loading ? 'Creating...' : 'Create account'}
      </button>
      <p className="text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link className="font-semibold text-emerald-600 hover:underline" to="/auth">
          Sign in
        </Link>
      </p>
    </form>
  );
};

