export const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-semibold">Overview</h2>
        <p className="text-sm text-slate-600">
          Track document lifecycle, workflow status, and team activity at a glance. Widgets go here.
        </p>
      </section>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">Recent documents</div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">Pending approvals</div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">Notifications</div>
      </section>
    </div>
  );
};

