import { useEffect, useState } from 'react';
import { apiClient } from '@services/apiClient';

export const SettingsPage = () => {
  const [allowedIp, setAllowedIp] = useState('');
  const [blockedIp, setBlockedIp] = useState('');
  const [allowedDevice, setAllowedDevice] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaMessage, setMfaMessage] = useState<string | null>(null);

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

  const setupMfa = async () => {
    setMfaMessage(null);
    try {
      const { data } = await apiClient.post('/auth/mfa/setup', {});
      const resp = data.data as { secret: string; otpauthUrl?: string };
      setMfaMessage(`MFA secret: ${resp.secret}`);
    } catch (e: any) {
      setMfaMessage(e?.response?.data?.message ?? 'Failed to setup MFA');
    }
  };

  const verifyMfa = async () => {
    setMfaMessage(null);
    try {
      await apiClient.post('/auth/mfa/verify', { token: mfaCode });
      setMfaMessage('MFA verified and enabled');
      setMfaCode('');
    } catch (e: any) {
      setMfaMessage(e?.response?.data?.message ?? 'Failed to verify MFA');
    }
  };

  const disableMfa = async () => {
    setMfaMessage(null);
    try {
      await apiClient.post('/auth/mfa/disable', {});
      setMfaMessage('MFA disabled');
    } catch (e: any) {
      setMfaMessage(e?.response?.data?.message ?? 'Failed to disable MFA');
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
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold">Multi-Factor Authentication</h3>
        {mfaMessage && <div className="mt-2 rounded-md bg-slate-50 p-2 text-sm text-slate-700">{mfaMessage}</div>}
        <div className="mt-2 flex gap-2">
          <button onClick={setupMfa} className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100">Setup</button>
          <input className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="MFA code" value={mfaCode} onChange={(e) => setMfaCode(e.target.value)} />
          <button onClick={verifyMfa} className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white">Verify</button>
          <button onClick={disableMfa} className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100">Disable</button>
        </div>
        <p className="mt-2 text-xs text-slate-600">Use an authenticator app to scan the generated secret or enter it manually.</p>
      </div>
    </div>
  );
};

