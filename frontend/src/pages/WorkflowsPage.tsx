import { useWorkflows } from '@hooks/useWorkflows';

export const WorkflowsPage = () => {
  const { data, isLoading, isError } = useWorkflows();
  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-semibold">Workflows</h2>
        <p className="text-sm text-slate-600">Monitor approval pipelines, pending tasks, and automation rules.</p>
      </header>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        {isLoading && <div className="text-sm text-slate-500">Loading...</div>}
        {isError && <div className="text-sm text-rose-600">Failed to load workflows.</div>}
        {data && (
          <ul className="divide-y divide-slate-100">
            {data.map((wf: any) => (
              <li key={wf.id} className="py-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{wf.name}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs">{wf.status}</span>
                  <span className="ml-auto text-xs text-slate-500">steps: {(wf.steps?.length ?? 0)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

