export const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="text-sm text-slate-600">
          Configure security, permissions, localization, and integrations.
        </p>
      </header>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">
          Settings forms will provide MFA, RBAC, and access control configuration.
        </p>
      </div>
    </div>
  );
};

