import { useEffect, useState } from 'react';
import { apiClient } from '@services/apiClient';

export const SettingsPage = () => {
  const [allowedIp, setAllowedIp] = useState('');
  const [blockedIp, setBlockedIp] = useState('');
  const [allowedDevice, setAllowedDevice] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    apiClient.get('/auth/access-controls').then(({ data }) => {
      const lists = data.data as { allowedIp: string[]; blockedIp: string[]; allowedDevice: string[] };
      setAllowedIp(lists.allowedIp?.join(',') ?? '');
      setBlockedIp(lists.blockedIp?.join(',') ?? '');
      setAllowedDevice(lists.allowedDevice?.join(',') ?? '');
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const payload = {
        allowedIp: allowedIp.split(',').map((s) => s.trim()).filter(Boolean),
        blockedIp: blockedIp.split(',').map((s) => s.trim()).filter(Boolean),
        allowedDevice: allowedDevice.split(',').map((s) => s.trim()).filter(Boolean),
      };
      await apiClient.put('/auth/access-controls', payload);
      setMessage('Access controls updated');
    } catch (e: any) {
      setMessage(e?.response?.data?.message ?? 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="text-sm text-slate-600">Configure security, permissions, localization, and integrations.</p>
      </header>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold">Access Controls</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-700">Allowed IPs (comma separated)</label>
            <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={allowedIp} onChange={(e) => setAllowedIp(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Blocked IPs</label>
            <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={blockedIp} onChange={(e) => setBlockedIp(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Allowed Device IDs</label>
            <input className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={allowedDevice} onChange={(e) => setAllowedDevice(e.target.value)} />
          </div>
        </div>
        {message && <div className="mt-2 rounded-md bg-slate-50 p-2 text-sm text-slate-700">{message}</div>}
        <button onClick={handleSave} disabled={loading} className="mt-4 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-emerald-700 disabled:opacity-60">
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

