import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const SignUpForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    department: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate('/auth');
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
      <button
        type="submit"
        className="w-full rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
      >
        Create account
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

