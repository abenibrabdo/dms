import { useState } from 'react';
import { useSearchDocuments } from '@hooks/useSearchDocuments';

export const DocumentFilters = () => {
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const { data } = useSearchDocuments({ q, type, status, limit: 50 });
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-4 gap-4">
        <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Search keyword" value={q} onChange={(e) => setQ(e.target.value)} />
        <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Type" value={type} onChange={(e) => setType(e.target.value)} />
        <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Status" value={status} onChange={(e) => setStatus(e.target.value)} />
        <button className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white">Apply</button>
      </div>
      {data && data.length > 0 && (
        <div className="mt-4 text-xs text-slate-600">Found {data.length} matching documents</div>
      )}
    </div>
  );
};

