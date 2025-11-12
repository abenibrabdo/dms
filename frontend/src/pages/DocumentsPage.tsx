import { DocumentList } from '@components/documents/DocumentList';
import { DocumentFilters } from '@components/documents/DocumentFilters';

export const DocumentsPage = () => {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Documents</h2>
          <p className="text-sm text-slate-600">Browse, filter, and manage organizational records.</p>
        </div>
        <button className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-emerald-700">
          Upload Document
        </button>
      </header>
      <DocumentFilters />
      <DocumentList />
    </div>
  );
};

