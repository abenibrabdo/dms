import { useState } from 'react';
import { useSearchDocuments } from '@hooks/useSearchDocuments';
import { Link } from 'react-router-dom';

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
        <div className="mt-4">
          <div className="mb-2 text-xs text-slate-600">Found {data.length} matching documents</div>
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-slate-500">Title</th>
                  <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-slate-500">Type</th>
                  <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-slate-500">Owner</th>
                  <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2">
                      <Link to={`/documents/${encodeURIComponent(d.id)}`} className="font-medium hover:underline">{d.title}</Link>
                      <div className="text-xs text-slate-500">{d.id}</div>
                    </td>
                    <td className="px-3 py-2">{d.type}</td>
                    <td className="px-3 py-2">{d.owner}</td>
                    <td className="px-3 py-2">{d.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

