import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@services/apiClient';

type SyncResult = {
  since: string;
  topics: string[];
  documents?: any[];
  workflows?: any[];
  notifications?: any[];
  comments?: any[];
};

export const SyncPage = () => {
  const [since, setSince] = useState('');
  const [limit, setLimit] = useState(100);
  const [topics, setTopics] = useState<string>('documents,workflows,notifications,comments');

  const { data, isLoading, isError, refetch } = useQuery<SyncResult>({
    queryKey: ['sync', since, limit, topics],
    queryFn: async () => {
      const params: any = { limit, topics };
      if (since) params.since = since;
      const { data } = await apiClient.get('/sync', { params });
      return data.data as SyncResult;
    },
  });

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Offline Sync</h2>
        <p className="text-sm text-slate-600">Fetch snapshot for offline usage across selected topics.</p>
      </header>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-4 gap-3">
          <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Since (ISO)" value={since} onChange={(e) => setSince(e.target.value)} />
          <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" min={1} max={1000} placeholder="Limit" value={limit} onChange={(e) => setLimit(Number(e.target.value))} />
          <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Topics (comma)" value={topics} onChange={(e) => setTopics(e.target.value)} />
          <button onClick={() => refetch()} className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white">Fetch</button>
        </div>
        <div className="mt-4">
          {isLoading && <div className="text-sm text-slate-500">Loading...</div>}
          {isError && <div className="text-sm text-rose-600">Failed to fetch sync data.</div>}
          {data && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-md border border-slate-200 p-3">
                <div className="text-xs uppercase text-slate-500">Documents</div>
                <div className="text-xs text-slate-600">{(data.documents?.length ?? 0)} items</div>
              </div>
              <div className="rounded-md border border-slate-200 p-3">
                <div className="text-xs uppercase text-slate-500">Workflows</div>
                <div className="text-xs text-slate-600">{(data.workflows?.length ?? 0)} items</div>
              </div>
              <div className="rounded-md border border-slate-200 p-3">
                <div className="text-xs uppercase text-slate-500">Notifications</div>
                <div className="text-xs text-slate-600">{(data.notifications?.length ?? 0)} items</div>
              </div>
              <div className="rounded-md border border-slate-200 p-3">
                <div className="text-xs uppercase text-slate-500">Comments</div>
                <div className="text-xs text-slate-600">{(data.comments?.length ?? 0)} items</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
