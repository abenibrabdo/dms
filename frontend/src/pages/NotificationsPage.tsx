export const NotificationsPage = () => {
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Notifications</h2>
        <p className="text-sm text-slate-600">
          Stay up to date on approvals, tasks, and document changes.
        </p>
      </header>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">
          Real-time alerts from RabbitMQ / Socket.IO will be listed here.
        </p>
      </div>
    </div>
  );
};

