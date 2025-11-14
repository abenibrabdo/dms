import { useState } from 'react';
import { DocumentList } from '@components/documents/DocumentList';
import { DocumentFilters } from '@components/documents/DocumentFilters';
import { DocumentUpload } from '@components/documents/DocumentUpload';

export const DocumentsPage = () => {
  const [showUpload, setShowUpload] = useState(false);
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Documents</h2>
          <p className="text-sm text-slate-600">Browse, filter, and manage organizational records.</p>
        </div>
        <button onClick={() => setShowUpload((v) => !v)} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-emerald-700">
          {showUpload ? 'Close Upload' : 'Upload Document'}
        </button>
      </header>
      {showUpload && (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <DocumentUpload />
        </div>
      )}
      <DocumentFilters />
      <DocumentList />
    </div>
  );
};

