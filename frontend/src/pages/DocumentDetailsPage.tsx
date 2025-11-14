import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useDocument } from '@hooks/useDocument';
import { useComments } from '@hooks/useComments';
import { usePresence } from '@hooks/usePresence';
import { apiClient } from '@services/apiClient';

export const DocumentDetailsPage = () => {
  const params = useParams();
  const documentId = params.documentId as string;
  const { data, isLoading, isError, refetch } = useDocument(documentId);
  const { data: comments, refetch: refetchComments } = useComments(documentId);
  const { data: presence, refetch: refetchPresence } = usePresence(documentId);
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [posting, setPosting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState('');
  const [editOwner, setEditOwner] = useState('');
  const [editStatus, setEditStatus] = useState<'draft' | 'in-review' | 'approved' | 'archived'>('draft');
  const [versionFile, setVersionFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setMessage(null);
    if (data) {
      setEditTitle(data.title);
      setEditType(data.type);
      setEditOwner(data.owner);
      setEditStatus(data.status);
    }
  }, [documentId, data]);

  const postComment = async () => {
    if (!comment.trim()) return;
    setPosting(true);
    setMessage(null);
    try {
      const form = new FormData();
      form.append('message', comment);
      for (const f of files) {
        form.append('files', f);
      }
      await apiClient.post(`/collaboration/${encodeURIComponent(documentId)}/comments`, form);
      setComment('');
      setFiles([]);
      setMessage('Comment posted');
      await refetchComments();
    } catch (e: any) {
      setMessage(e?.response?.data?.message ?? 'Failed to post comment');
    } finally {
      setPosting(false);
    }
  };

  const lockDoc = async () => {
    await apiClient.post(`/collaboration/${encodeURIComponent(documentId)}/lock`, { force: false });
    await refetch();
  };

  const unlockDoc = async () => {
    await apiClient.post(`/collaboration/${encodeURIComponent(documentId)}/unlock`);
    await refetch();
  };

  const saveMetadata = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await apiClient.patch(`/documents/${encodeURIComponent(documentId)}`, {
        metadata: { title: editTitle, type: editType, owner: editOwner, status: editStatus },
      });
      setMessage('Document updated');
      await refetch();
    } catch (e: any) {
      setMessage(e?.response?.data?.message ?? 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const uploadVersion = async () => {
    if (!versionFile) return;
    setSaving(true);
    setMessage(null);
    try {
      const form = new FormData();
      form.append('file', versionFile);
      await apiClient.post(`/documents/${encodeURIComponent(documentId)}/versions/upload`, form);
      setVersionFile(null);
      setMessage('Version uploaded');
      await refetch();
    } catch (e: any) {
      setMessage(e?.response?.data?.message ?? 'Failed to upload version');
    } finally {
      setSaving(false);
    }
  };

  const [presenceStatus, setPresenceStatus] = useState<'viewing' | 'editing' | 'idle'>('viewing');
  const [presenceSessionId, setPresenceSessionId] = useState<string | null>(null);

  const joinPresence = async () => {
    const { data } = await apiClient.post(`/collaboration/${encodeURIComponent(documentId)}/presence`, { status: presenceStatus });
    const resp = data.data as { id: string };
    setPresenceSessionId(resp.id);
    await refetchPresence();
  };

  const updatePresenceStatus = async () => {
    await apiClient.patch(`/collaboration/${encodeURIComponent(documentId)}/presence/status`, { status: presenceStatus });
    await refetchPresence();
  };

  const leavePresence = async () => {
    if (!presenceSessionId) return;
    await apiClient.delete(`/collaboration/${encodeURIComponent(documentId)}/presence/${encodeURIComponent(presenceSessionId)}`);
    setPresenceSessionId(null);
    await refetchPresence();
  };

  if (isLoading) {
    return <div className="rounded-lg border border-slate-200 bg-white p-6 text-center">Loading...</div>;
  }
  if (isError || !data) {
    return <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-center text-sm text-rose-600">Failed to load document details.</div>;
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{data.title}</h2>
          <p className="text-sm text-slate-600">{data.id}</p>
        </div>
        <div className="flex gap-2">
          <a href={`/api/documents/${encodeURIComponent(data.id)}/download`} className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100">Download</a>
          <button onClick={lockDoc} className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100">Lock</button>
          <button onClick={unlockDoc} className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100">Unlock</button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h3 className="text-lg font-semibold">Details</h3>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-slate-700">
            <div>
              <div className="text-xs text-slate-500">Title</div>
              <input className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>
            <div>
              <div className="text-xs text-slate-500">Type</div>
              <input className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1" value={editType} onChange={(e) => setEditType(e.target.value)} />
            </div>
            <div>
              <div className="text-xs text-slate-500">Owner</div>
              <input className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1" value={editOwner} onChange={(e) => setEditOwner(e.target.value)} />
            </div>
            <div>
              <div className="text-xs text-slate-500">Status</div>
              <select className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1" value={editStatus} onChange={(e) => setEditStatus(e.target.value as any)}>
                <option value="draft">Draft</option>
                <option value="in-review">In Review</option>
                <option value="approved">Approved</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="col-span-2">
              <button onClick={saveMetadata} disabled={saving} className="mt-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
            </div>
            <div className="col-span-2 mt-4">
              <div className="text-xs text-slate-500">Upload new version</div>
              <div className="mt-1 flex gap-2">
                <input type="file" onChange={(e) => setVersionFile(e.target.files?.[0] ?? null)} className="flex-1 text-sm" />
                <button onClick={uploadVersion} disabled={saving || !versionFile} className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100 disabled:opacity-60">Upload</button>
              </div>
            </div>
            <div className="col-span-2">
              <div className="text-xs text-slate-500">Updated</div>
              <div>{new Date(data.updatedAt).toLocaleString()}</div>
            </div>
            <div className="col-span-2">
              <div className="text-xs text-slate-500">Tags</div>
              <div>{data.tags?.join(', ') || '-'}</div>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 md:col-span-2">
          <h3 className="text-lg font-semibold">Versions</h3>
          <table className="mt-2 min-w-full divide-y divide-slate-200 text-sm">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left">Version</th>
                <th className="px-2 py-1 text-left">File</th>
                <th className="px-2 py-1 text-left">Created</th>
                <th className="px-2 py-1 text-left">By</th>
                <th className="px-2 py-1 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.versions?.map((v) => (
                <tr key={v.versionNumber}>
                  <td className="px-2 py-1">{v.versionNumber}</td>
                  <td className="px-2 py-1">{v.filename}</td>
                  <td className="px-2 py-1">{new Date(v.createdAt).toLocaleString()}</td>
                  <td className="px-2 py-1">{v.createdBy}</td>
                  <td className="px-2 py-1">
                    <a href={`/api/documents/${encodeURIComponent(data.id)}/versions/${v.versionNumber}/download`} className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100">Download</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-semibold">Comments</h3>
        {message && <div className="mt-2 rounded-md bg-slate-50 p-2 text-sm text-slate-700">{message}</div>}
        <ul className="mt-3 divide-y divide-slate-100 text-sm">
          {(comments ?? []).map((c) => (
            <li key={c.id} className="py-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">{c.authorName ?? 'Anonymous'}</span>
                <span className="ml-auto text-xs text-slate-500">{new Date(c.createdAt).toLocaleString()}</span>
              </div>
              <div className="text-sm text-slate-700">{c.message}</div>
            </li>
          ))}
          {(comments ?? []).length === 0 && <li className="py-2 text-xs text-slate-500">No comments</li>}
        </ul>
        <div className="mt-3 flex gap-2">
          <input className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Write a comment" value={comment} onChange={(e) => setComment(e.target.value)} />
          <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files ?? []))} className="text-xs" />
          <button onClick={postComment} disabled={posting} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-emerald-700 disabled:opacity-60">{posting ? 'Posting...' : 'Post'}</button>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-semibold">Presence</h3>
        <div className="mt-2 flex items-center gap-2">
          <select className="rounded-md border border-slate-300 px-2 py-1 text-sm" value={presenceStatus} onChange={(e) => setPresenceStatus(e.target.value as any)}>
            <option value="viewing">Viewing</option>
            <option value="editing">Editing</option>
            <option value="idle">Idle</option>
          </select>
          <button onClick={joinPresence} className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100">Join</button>
          <button onClick={updatePresenceStatus} className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100">Update</button>
          <button onClick={leavePresence} disabled={!presenceSessionId} className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100 disabled:opacity-60">Leave</button>
        </div>
        <ul className="mt-3 divide-y divide-slate-100 text-sm">
          {(presence ?? []).map((p) => (
            <li key={p.id} className="py-2">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{p.status}</span>
                <span className="font-medium">{p.userName ?? 'Unknown user'}</span>
                <span className="ml-auto text-xs text-slate-500">{new Date(p.updatedAt).toLocaleString()}</span>
              </div>
            </li>
          ))}
          {(presence ?? []).length === 0 && <li className="py-2 text-xs text-slate-500">No active presence</li>}
        </ul>
      </section>
    </div>
  );
};
