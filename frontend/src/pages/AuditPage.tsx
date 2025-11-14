import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@services/apiClient';

type AuditItem = {
  id: string;
  entityType: 'document' | 'workflow' | 'user' | 'notification' | 'system';
  entityId?: string;
  action: string;
  performedBy?: string;
  createdAt: string;
  details?: any;
};

export const AuditPage = () => {
  const [entityType, setEntityType] = useState('');
  const [entityId, setEntityId] = useState('');
  const [performedBy, setPerformedBy] = useState('');
  const [limit, setLimit] = useState(50);

  const { data, isLoading, isError, refetch } = useQuery<AuditItem[]>({
    queryKey: ['audit', entityType, entityId, performedBy, limit],
    queryFn: async () => {
      const params: any = { limit };
      if (entityType) params.entityType = entityType;
      if (entityId) params.entityId = entityId;
      if (performedBy) params.performedBy = performedBy;
      const { data } = await apiClient.get('/audit', { params });
      return data.data as AuditItem[];
    },
  });

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Audit Logs</h2>
        <p className="text-sm text-slate-600">Search activity across documents, workflows, users, and notifications.</p>
      </header>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-5 gap-3">
          <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Entity Type" value={entityType} onChange={(e) => setEntityType(e.target.value)} />
          <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Entity ID" value={entityId} onChange={(e) => setEntityId(e.target.value)} />
          <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Performed By" value={performedBy} onChange={(e) => setPerformedBy(e.target.value)} />
          <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" min={1} max={200} placeholder="Limit" value={limit} onChange={(e) => setLimit(Number(e.target.value))} />
          <button onClick={() => refetch()} className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white">Apply</button>
        </div>
        <div className="mt-4">
          {isLoading && <div className="text-sm text-slate-500">Loading...</div>}
          {isError && <div className="text-sm text-rose-600">Failed to load audit logs.</div>}
          {data && (
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-slate-500">Time</th>
                    <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-slate-500">Entity</th>
                    <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-slate-500">Action</th>
                    <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-slate-500">By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((a) => (
                    <tr key={a.id}>
                      <td className="px-3 py-2">{new Date(a.createdAt).toLocaleString()}</td>
                      <td className="px-3 py-2">{a.entityType}{a.entityId ? `/${a.entityId}` : ''}</td>
                      <td className="px-3 py-2">{a.action}</td>
                      <td className="px-3 py-2">{a.performedBy ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
