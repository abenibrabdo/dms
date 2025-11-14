import { Outlet, Route, Routes } from 'react-router-dom';

import { SignInForm } from '@components/auth/SignInForm';
import { SignUpForm } from '@components/auth/SignUpForm';
import { PasswordResetRequest } from '@components/auth/PasswordResetRequest';
import { PasswordResetConfirm } from '@components/auth/PasswordResetConfirm';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-center text-2xl font-semibold text-slate-900">Welcome back</h1>
        <Outlet />
      </div>
    </div>
  );
};

export const AuthPage = () => {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route index element={<SignInForm />} />
        <Route path="register" element={<SignUpForm />} />
        <Route path="reset" element={<PasswordResetRequest />} />
        <Route path="reset/confirm" element={<PasswordResetConfirm />} />
      </Route>
    </Routes>
  );
};

