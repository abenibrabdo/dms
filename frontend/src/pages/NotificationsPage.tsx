import { useNotifications } from '@hooks/useNotifications';
import { apiClient } from '@services/apiClient';
import { useQueryClient } from '@tanstack/react-query';

export const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useNotifications();

  const markRead = async (id: string) => {
    await apiClient.post(`/notifications/${encodeURIComponent(id)}/read`);
    await queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Notifications</h2>
        <p className="text-sm text-slate-600">Stay up to date on approvals, tasks, and document changes.</p>
      </header>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        {isLoading && <div className="text-sm text-slate-500">Loading...</div>}
        {isError && <div className="text-sm text-rose-600">Failed to load notifications.</div>}
        {data && (
          <ul className="divide-y divide-slate-100">
            {data.map((n) => (
              <li key={n.id} className="py-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{n.type}</span>
                  <span className="font-medium">{n.title}</span>
                  <span className="ml-auto text-xs text-slate-500">{new Date(n.createdAt).toLocaleString()}</span>
                  <button
                    onClick={() => markRead(n.id)}
                    className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100"
                    disabled={n.read}
                  >
                    {n.read ? 'Read' : 'Mark read'}
                  </button>
                </div>
                {n.message && <div className="text-xs text-slate-600">{n.message}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

