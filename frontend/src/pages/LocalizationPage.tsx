import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@services/apiClient';

type Resource = { namespace: string; key: string; language: string; value: string; description?: string };

export const LocalizationPage = () => {
  const [lang, setLang] = useState('');
  const [namespace, setNamespace] = useState('');
  const [pending, setPending] = useState<Resource[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const { data, refetch, isLoading, isError } = useQuery<Resource[]>({
    queryKey: ['localization', lang, namespace],
    queryFn: async () => {
      const { data } = await apiClient.get('/localization/resources', { params: { lang, namespace } });
      return data.data as Resource[];
    },
  });

  useEffect(() => {
    setMessage(null);
  }, [lang, namespace]);

  const upsert = async () => {
    setMessage(null);
    try {
      await apiClient.put('/localization/resources', pending);
      setPending([]);
      setMessage('Resources saved');
      await refetch();
    } catch (e: any) {
      setMessage(e?.response?.data?.message ?? 'Failed to save');
    }
  };

  const remove = async (r: Resource) => {
    setMessage(null);
    try {
      await apiClient.delete(`/localization/resources/${encodeURIComponent(r.namespace)}/${encodeURIComponent(r.key)}/${encodeURIComponent(r.language)}`);
      setMessage('Resource deleted');
      await refetch();
    } catch (e: any) {
      setMessage(e?.response?.data?.message ?? 'Delete failed');
    }
  };

  const addPending = () => {
    setPending((p) => [...p, { namespace: namespace || 'common', key: '', language: lang || 'en', value: '', description: '' }]);
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Localization</h2>
        <p className="text-sm text-slate-600">Manage translation resources by namespace and language.</p>
      </header>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-3 gap-3">
          <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Language (e.g., en)" value={lang} onChange={(e) => setLang(e.target.value)} />
          <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Namespace" value={namespace} onChange={(e) => setNamespace(e.target.value)} />
          <button onClick={() => refetch()} className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white">Load</button>
        </div>
        {message && <div className="mt-2 rounded-md bg-slate-50 p-2 text-sm text-slate-700">{message}</div>}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs uppercase text-slate-500">Existing resources</span>
            <button onClick={addPending} className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100">Add new</button>
          </div>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {(data ?? []).map((r) => (
              <div key={`${r.namespace}:${r.key}:${r.language}`} className="rounded-md border border-slate-200 p-3">
                <div className="text-sm font-medium">{r.namespace}/{r.key}</div>
                <div className="text-xs text-slate-500">{r.language}</div>
                <div className="mt-1 text-sm">{r.value}</div>
                <div className="mt-2">
                  <button onClick={() => remove(r)} className="rounded-md border border-rose-300 px-2 py-1 text-xs text-rose-700 hover:bg-rose-50">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {pending.length > 0 && (
          <div className="mt-6">
            <div className="mb-2 text-xs uppercase text-slate-500">Pending changes</div>
            <div className="space-y-2">
              {pending.map((r, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-2">
                  <input className="rounded-md border border-slate-300 px-2 py-1 text-sm" placeholder="Namespace" value={r.namespace} onChange={(e) => setPending((p) => p.map((x, i) => i === idx ? { ...x, namespace: e.target.value } : x))} />
                  <input className="rounded-md border border-slate-300 px-2 py-1 text-sm" placeholder="Key" value={r.key} onChange={(e) => setPending((p) => p.map((x, i) => i === idx ? { ...x, key: e.target.value } : x))} />
                  <input className="rounded-md border border-slate-300 px-2 py-1 text-sm" placeholder="Language" value={r.language} onChange={(e) => setPending((p) => p.map((x, i) => i === idx ? { ...x, language: e.target.value } : x))} />
                  <input className="rounded-md border border-slate-300 px-2 py-1 text-sm" placeholder="Value" value={r.value} onChange={(e) => setPending((p) => p.map((x, i) => i === idx ? { ...x, value: e.target.value } : x))} />
                </div>
              ))}
            </div>
            <button onClick={upsert} className="mt-3 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white">Save</button>
          </div>
        )}
        {isLoading && <div className="mt-2 text-sm text-slate-500">Loading...</div>}
        {isError && <div className="mt-2 text-sm text-rose-600">Failed to load resources.</div>}
      </div>
    </div>
  );
};
