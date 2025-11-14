import { useDocuments } from '@hooks/useDocuments';
import { useWorkflows } from '@hooks/useWorkflows';
import { useNotifications } from '@hooks/useNotifications';

export const DashboardPage = () => {
  const { data: docs } = useDocuments();
  const { data: workflows } = useWorkflows();
  const { data: notifications } = useNotifications();

  const recentDocs = (docs ?? []).slice(0, 5);
  const pendingWorkflows = (workflows ?? []).filter((w: any) => w.status === 'pending').slice(0, 5);
  const unreadCount = (notifications ?? []).filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">Overview</h2>
        <p className="text-sm text-slate-600">Track document lifecycle, workflow status, and activity.</p>
      </section>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-xs uppercase text-slate-500">Recent documents</div>
          <ul className="mt-2 divide-y divide-slate-100 text-sm">
            {recentDocs.map((d) => (
              <li key={d.id} className="py-1">
                <span className="font-medium">{d.title}</span>
                <span className="ml-2 text-xs text-slate-500">{d.type}</span>
              </li>
            ))}
            {recentDocs.length === 0 && <li className="py-1 text-xs text-slate-500">No documents</li>}
          </ul>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-xs uppercase text-slate-500">Pending approvals</div>
          <ul className="mt-2 divide-y divide-slate-100 text-sm">
            {pendingWorkflows.map((w: any) => (
              <li key={w.id} className="py-1">
                <span className="font-medium">{w.name}</span>
                <span className="ml-2 text-xs text-slate-500">{w.status}</span>
              </li>
            ))}
            {pendingWorkflows.length === 0 && <li className="py-1 text-xs text-slate-500">No pending workflows</li>}
          </ul>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-xs uppercase text-slate-500">Notifications</div>
          <div className="mt-2 text-3xl font-semibold">{unreadCount}</div>
          <div className="mt-1 text-xs text-slate-600">Unread</div>
        </div>
      </section>
    </div>
  );
};

