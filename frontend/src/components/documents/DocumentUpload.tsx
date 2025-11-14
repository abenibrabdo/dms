import { useState } from 'react';

import { apiClient } from '@services/apiClient';
import { useAuthStore } from '@store/authStore';

export const DocumentUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState<'draft' | 'in-review' | 'approved' | 'archived'>('draft');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [useResumable, setUseResumable] = useState(false);
  const [chunkSizeMb, setChunkSizeMb] = useState(1);
  const auth = useAuthStore();

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;
    setLoading(true);
    setMessage(null);
    try {
      if (!useResumable) {
        const form = new FormData();
        form.append('file', file);
        form.append('title', title);
        form.append('type', type);
        form.append('owner', owner);
        form.append('status', status);
        await apiClient.post('/documents/upload', form);
      } else {
        const chunkBytes = Math.max(1, chunkSizeMb) * 1024 * 1024;
        const initPayload = {
          title,
          type,
          owner: owner || auth.user?.id || '',
          status,
          filename: file.name,
          mimeType: file.type,
          totalSize: file.size,
          chunkSize: chunkBytes,
        };
        const { data: initResp } = await apiClient.post('/documents/uploads/init', initPayload);
        const sessionId = initResp.data.id as string;
        const totalChunks = Math.ceil(file.size / chunkBytes);
        for (let i = 0; i < totalChunks; i++) {
          const start = i * chunkBytes;
          const end = Math.min(file.size, start + chunkBytes);
          const blob = file.slice(start, end);
          await apiClient.put(`/documents/uploads/${encodeURIComponent(sessionId)}/chunks/${i + 1}`, blob, {
            headers: { 'Content-Type': file.type || 'application/octet-stream' },
          });
        }
        await apiClient.post(`/documents/uploads/${encodeURIComponent(sessionId)}/finalize`, {});
      }
      setMessage('Uploaded successfully');
      setFile(null);
      setTitle('');
      setType('');
      setOwner('');
      setStatus('draft');
      setUseResumable(false);
    } catch (e: any) {
      setMessage(e?.response?.data?.message ?? 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleUpload}>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700">Title</label>
          <input className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Type</label>
          <input className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm" value={type} onChange={(e) => setType(e.target.value)} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700">Owner</label>
          <input className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm" value={owner} onChange={(e) => setOwner(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Status</label>
          <select className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value as any)}>
            <option value="draft">Draft</option>
            <option value="in-review">In Review</option>
            <option value="approved">Approved</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <input id="resumable" type="checkbox" checked={useResumable} onChange={(e) => setUseResumable(e.target.checked)} />
          <label htmlFor="resumable" className="text-sm">Use resumable upload</label>
        </div>
        {useResumable && (
          <div>
            <label className="block text-sm font-medium text-slate-700">Chunk size (MB)</label>
            <input className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm" type="number" min={1} max={50} value={chunkSizeMb} onChange={(e) => setChunkSizeMb(Number(e.target.value))} />
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">File</label>
        <input type="file" className="mt-1 w-full text-sm" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required />
      </div>
      {message && <div className="rounded-md bg-slate-50 p-2 text-sm text-slate-700">{message}</div>}
      <button type="submit" disabled={loading} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-emerald-700 disabled:opacity-60">
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
};
