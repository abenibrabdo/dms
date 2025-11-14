import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@services/apiClient';

type Summary = {
  documents: { total: number; byStatus: Record<string, number> };
  workflows: { total: number; active: number };
  storage: { totalBytes: number };
};

export const AnalyticsPage = () => {
  const { data, isLoading, isError } = useQuery<Summary>({
    queryKey: ['analytics-summary'],
    queryFn: async () => {
      const { data } = await apiClient.get('/analytics/summary');
      return data.data as Summary;
    },
  });

  const { data: trend } = useQuery<any[]>({
    queryKey: ['analytics-trend'],
    queryFn: async () => {
      const { data } = await apiClient.get('/analytics/activity/trend');
      return data.data as any[];
    },
  });

  const { data: leaderboard } = useQuery<any[]>({
    queryKey: ['analytics-leaderboard'],
    queryFn: async () => {
      const { data } = await apiClient.get('/analytics/activity/leaderboard');
      return data.data as any[];
    },
  });

  const [breakdown, setBreakdown] = useState<'department' | 'mimeType'>('department');
  const { data: storageBreakdown } = useQuery<any>({
    queryKey: ['analytics-storage', breakdown],
    queryFn: async () => {
      const { data } = await apiClient.get('/analytics/storage', { params: { breakdown } });
      return data.data as any;
    },
  });

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Analytics</h2>
        <p className="text-sm text-slate-600">Operational metrics and document activity overview.</p>
      </header>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        {isLoading && <div className="text-sm text-slate-500">Loading...</div>}
        {isError && <div className="text-sm text-rose-600">Failed to load analytics.</div>}
        {data && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-md border border-slate-200 p-4">
              <div className="text-xs uppercase text-slate-500">Documents</div>
              <div className="mt-2 text-3xl font-semibold">{data.documents.total}</div>
              <div className="mt-2 text-xs text-slate-600">By status: {Object.entries(data.documents.byStatus || {}).map(([k, v]) => `${k}: ${v}`).join(', ') || '-'}</div>
            </div>
            <div className="rounded-md border border-slate-200 p-4">
              <div className="text-xs uppercase text-slate-500">Workflows</div>
              <div className="mt-2 text-3xl font-semibold">{data.workflows.total}</div>
              <div className="mt-2 text-xs text-slate-600">Active: {data.workflows.active}</div>
            </div>
            <div className="rounded-md border border-slate-200 p-4">
              <div className="text-xs uppercase text-slate-500">Storage</div>
              <div className="mt-2 text-3xl font-semibold">{(data.storage.totalBytes / (1024 * 1024)).toFixed(2)} MB</div>
              <div className="mt-2">
                <a href={`/api/analytics/storage?format=csv`} className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100">Download CSV</a>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold">Activity Trend</h3>
        <div className="mt-2">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-slate-500">Time</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-slate-500">Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(trend ?? []).map((t: any, i: number) => (
                <tr key={i}>
                  <td className="px-3 py-2">{new Date(t.timestamp ?? t.time ?? Date.now()).toLocaleString()}</td>
                  <td className="px-3 py-2">{t.count ?? t.value ?? 0}</td>
                </tr>
              ))}
              {(trend ?? []).length === 0 && (
                <tr>
                  <td className="px-3 py-2 text-xs text-slate-500" colSpan={2}>No activity</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold">User Activity Leaderboard</h3>
        <div className="mt-2">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-slate-500">User</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-slate-500">Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(leaderboard ?? []).map((u: any, i: number) => (
                <tr key={i}>
                  <td className="px-3 py-2">{u.user ?? u.name ?? 'Unknown'}</td>
                  <td className="px-3 py-2">{u.count ?? u.value ?? 0}</td>
                </tr>
              ))}
              {(leaderboard ?? []).length === 0 && (
                <tr>
                  <td className="px-3 py-2 text-xs text-slate-500" colSpan={2}>No data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold">Storage Breakdown</h3>
        <div className="mt-2 flex items-center gap-2">
          <select className="rounded-md border border-slate-300 px-2 py-1 text-sm" value={breakdown} onChange={(e) => setBreakdown(e.target.value as any)}>
            <option value="department">By Department</option>
            <option value="mimeType">By MIME Type</option>
          </select>
        </div>
        <div className="mt-2">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-slate-500">Key</th>
                <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-slate-500">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.entries((storageBreakdown ?? {}) as Record<string, any>).map(([k, v]) => (
                <tr key={k}>
                  <td className="px-3 py-2">{k}</td>
                  <td className="px-3 py-2">{typeof v === 'number' ? v : JSON.stringify(v)}</td>
                </tr>
              ))}
              {Object.keys(storageBreakdown ?? {}).length === 0 && (
                <tr>
                  <td className="px-3 py-2 text-xs text-slate-500" colSpan={2}>No breakdown</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
