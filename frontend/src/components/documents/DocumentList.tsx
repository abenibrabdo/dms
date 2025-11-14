import { useDocuments } from '@hooks/useDocuments';
import { Link } from 'react-router-dom';

export const DocumentList = () => {
  const { data, isLoading, isError } = useDocuments();
  const documents = data ?? [
    {
      id: 'DOC-2025-001',
      title: 'Supplier Contract Renewal',
      type: 'Contract',
      owner: 'Procurement',
      status: 'In Review',
      updatedAt: '2025-11-10',
    },
    {
      id: 'DOC-2025-002',
      title: 'Quarterly Financial Report',
      type: 'Report',
      owner: 'Finance',
      status: 'Approved',
      updatedAt: '2025-11-08',
    },
  ];

  if (isLoading) {
    return <div className="rounded-lg border border-slate-200 bg-white p-6 text-center">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-600">
        Failed to fetch documents. Showing static sample data.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-4 py-3">Document</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Owner</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Updated</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
          {documents.map((doc) => (
            <tr key={doc.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <div className="font-medium text-slate-900">
                  <Link to={`/documents/${encodeURIComponent(doc.id)}`} className="hover:underline">
                    {doc.title}
                  </Link>
                </div>
                <div className="text-xs text-slate-500">{doc.id}</div>
              </td>
              <td className="px-4 py-3">{doc.type}</td>
              <td className="px-4 py-3">{doc.owner}</td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                  {doc.status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-slate-500">{doc.updatedAt}</td>
              <td className="px-4 py-3">
                <a
                  href={`/api/documents/${encodeURIComponent(doc.id)}/download`}
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100"
                >
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

