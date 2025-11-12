export const DocumentFilters = () => {
  return (
    <div className="flex flex-wrap gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <input
        className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        placeholder="Search by title, owner, or tag"
      />
      <select className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none">
        <option value="">All Types</option>
        <option value="incoming">Incoming</option>
        <option value="outgoing">Outgoing</option>
        <option value="internal">Internal</option>
      </select>
      <select className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none">
        <option value="">Any Status</option>
        <option value="draft">Draft</option>
        <option value="in-review">In Review</option>
        <option value="approved">Approved</option>
        <option value="archived">Archived</option>
      </select>
      <button className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100">
        Reset
      </button>
    </div>
  );
};

